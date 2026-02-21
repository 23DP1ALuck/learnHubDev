<?php

namespace App\Http\Controllers;

use App\Exceptions\IncorrectVerifierException;
use App\Exceptions\InvalidTokenFormatException;
use App\Exceptions\InviteExpiredException;
use App\Exceptions\InviteNotFoundException;
use App\Exceptions\InviteUsedException;
use App\Exceptions\OnboardingRequestNotFoundException;
use App\Http\Requests\Storeaccount_invitesRequest;
use App\Http\Requests\Updateaccount_invitesRequest;
use App\Mail\InviteEmail;
use App\Models\AccountInvites;
use App\Models\OnboardingRequest;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Random\RandomException;

class AccountInvitesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     * @throws RandomException
     */
    public function store(Storeaccount_invitesRequest $request)
    {
        $validated = $request->validated();
        $invitationType = $validated['invitation_type'];
        $onboardingRequestId = $validated['onboarding_request_id'] ?? null;

        // Generate a token for URL creation (64 chars each).
        $selector = bin2hex(random_bytes(32));
        $verifier = bin2hex(random_bytes(32));

        [$invite, $onboardingRequest] = DB::transaction(function () use (
            $invitationType,
            $onboardingRequestId,
            $selector,
            $verifier,
            $request
        ) {
            $onboardingRequest = null;
            if ($invitationType === 'onboarding_request') {
                $onboardingRequest = OnboardingRequest::lockForUpdate()->find($onboardingRequestId);
                if (!$onboardingRequest) {
                    throw ValidationException::withMessages([
                        'onboarding_request_id' => 'Onboarding request not found.',
                    ]);
                }

                if ($onboardingRequest->status === 'pending') {
                    $onboardingRequest->update(['status' => 'approved']);
                }
            }

            $invite = AccountInvites::create([
                'selector' => $selector,
                'verifier_hash' => hash('sha256', $verifier),
                'invitation_type' => $invitationType,
                'onboarding_request_id' => $invitationType === 'onboarding_request' ? $onboardingRequestId : null,
                'expires_at' => now()->addDays(2),
                'invited_by' => $request->user()->id,
            ]);

            return [$invite, $onboardingRequest];
        });

        if (!$invite) {
            throw ValidationException::withMessages([
                'invitation_type' => 'Failed to create invite.',
            ]);
        }

        $url = url('/join/' . $selector . '.' . $verifier);
        $mailSent = false;
        $mailError = null;

        if ($onboardingRequest) {
            try {
                Mail::to($onboardingRequest->email)->send(new InviteEmail(
                    inviteUrl: $url,
                    recipientName: $onboardingRequest->first_name,
                    organizationName: $onboardingRequest->organization_name,
                    expiresAt: $invite->expires_at,
                ));
                $mailSent = true;
            } catch (\Throwable $e) {
                report($e);
                $mailError = 'Invite created, but email failed to send.';
            }
        }

        if ($request->expectsJson()) {
            return response()->json([
                'url' => $url,
                'emailed' => $mailSent,
                'email' => $onboardingRequest?->email,
            ]);
        }

        $redirect = redirect()
            ->route('onboarding-requests')
            ->with('invite_url', $url);

        if ($mailSent) {
            return $redirect->with('success', 'Invite emailed successfully.');
        }

        if ($mailError) {
            return $redirect
                ->with('success', 'Invite created successfully.')
                ->with('error', $mailError);
        }

        return $redirect->with('success', 'Invite created successfully.');
    }

    /**
     * @throws ValidationException
     */
    public function join(Request $request, string $token){
        try {
            [$selector, $verifier] = $this->parseToken($token);

            DB::transaction(function () use ($selector, $verifier, $request) {
                $invite = $this->getInviteForUpdate($selector);
                $invite = $this->assertInviteValid($invite, $verifier);

                $onboardingRequest = $this->verifyOnboardingRequest($invite);

                $password = $request->input('password');
                if (!$password) {
                    throw ValidationException::withMessages([
                        'password' => 'Password is required.',
                    ]);
                }

                $org = Organization::create([
                    'organization_name' => $onboardingRequest->organization_name,
                    'organization_type' => $onboardingRequest->organization_type,
                ]);

                $user = User::create([
                    'email' => $onboardingRequest->email,
                    'name' => $onboardingRequest->first_name . ' ' . $onboardingRequest->last_name,
                    'password' => Hash::make($password),
                    'role' => 'user',
                    'status' => 'active',
                ]);

                $user->organizations()->attach($org->id, [
                    'joined_on' => now()->toDateString(),
                    'role_in_org' => 'ORGANIZATION_OWNER',
                    'admin_privileges' => true,
                ]);

                $invite->used_at = now();
                $invite->save();
            });

            return redirect()->route('login')->with('success', 'Account created successfully.');
        } catch (ValidationException $e) {
            $first = collect($e->errors())->flatten()->first() ?? 'Validation failed.';
            return redirect()->route('login')->with('error', $first);
        } catch (
        InviteNotFoundException |
        InvalidTokenFormatException |
        IncorrectVerifierException |
        InviteUsedException |
        InviteExpiredException |
        OnboardingRequestNotFoundException $e
        ) {
            return redirect()->route('login')->with('error', $e->getMessage());
        }
    }

    private function getInviteForView(string $selector): ?AccountInvites
    {
        return AccountInvites::where('selector', $selector)->first();

    }
    private function getInviteForUpdate(string $selector) : ?AccountInvites{
        return AccountInvites::where('selector', $selector)
            ->lockForUpdate()
            ->first();
    }
    public function showJoinForm(Request $request, string $token):Response|RedirectResponse{
        try {
            [$selector, $verifier] = $this->parseToken($token);

            $invite = $this->getInviteForView($selector);
            $this->assertInviteValid($invite, $verifier);

            return Inertia::render('auth/join', [
                'token' => $token,
            ]);
        } catch (
        InviteNotFoundException |
        InvalidTokenFormatException |
        IncorrectVerifierException |
        InviteUsedException |
        InviteExpiredException $e
        ) {
            return redirect()->route('login')->with('error', $e->getMessage());
        }
    }
 /**
 * @throws IncorrectVerifierException
 * @throws InviteExpiredException
 * @throws InviteUsedException
 * @throws InviteNotFoundException
 */
    private function assertInviteValid(?AccountInvites $invite, string $verifier): AccountInvites
    {
        if (!$invite) {
            throw new InviteNotFoundException();
        }

        if ($invite->used_at !== null) {
            throw new InviteUsedException();
        }

        if ($invite->expires_at->isPast()) {
            throw new InviteExpiredException();
        }

        if (!hash_equals($invite->verifier_hash, hash('sha256', $verifier))) {
            throw new IncorrectVerifierException();
        }
        return $invite;
}
    /**
     * @throws InvalidTokenFormatException
     */
    private function parseToken(string $token): array
    {
        $parts = explode('.', $token, 2);
        if (count($parts) !== 2 || $parts[0] === '' || $parts[1] === '') {
            throw new InvalidTokenFormatException();
        }
        return $parts;
    }

    /**
     * @throws OnboardingRequestNotFoundException
     */
    private function verifyOnboardingRequest(AccountInvites $accountInvite): OnboardingRequest{
        $onboardingRequest = $accountInvite
            ->onboardingRequest()
            ->first();
        if (!$onboardingRequest) {
            throw new OnboardingRequestNotFoundException();
        }
        return $onboardingRequest;
    }
    /**
     * Display the specified resource.
     */
    public function show(AccountInvites $account_invites)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AccountInvites $account_invites)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updateaccount_invitesRequest $request, AccountInvites $account_invites)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AccountInvites $account_invites)
    {
        //
    }
}
