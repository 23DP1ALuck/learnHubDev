<?php

namespace App\Http\Controllers;

use App\Exceptions\IncorrectVerifierException;
use App\Exceptions\InvalidTokenFormatException;
use App\Exceptions\InviteExpiredException;
use App\Exceptions\InviteNotFoundException;
use App\Exceptions\InviteUsedException;
use App\Exceptions\OnboardingRequestNotFoundException;
use App\Http\Requests\Storeaccount_invitesRequest;
use App\Http\Requests\StoreOrganizationInviteRequest;
use App\Http\Requests\Updateaccount_invitesRequest;
use App\Mail\InviteEmail;
use App\Models\AccountInvites;
use App\Models\OnboardingRequest;
use App\Models\Organization;
use App\Models\SchoolGroup;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Random\RandomException;

class AccountInvitesController extends Controller
{
    public function index()
    {
        //
    }

    public function create()
    {
        //
    }

    /**
     * @throws RandomException
     */
    public function store(Storeaccount_invitesRequest $request)
    {
        $validated = $request->validated();
        $invitationType = $validated['invitation_type'];
        $onboardingRequestId = $validated['onboarding_request_id'] ?? null;

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
                $onboardingRequest = OnboardingRequest::query()
                    ->lockForUpdate()
                    ->find($onboardingRequestId);

                if (! $onboardingRequest) {
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

        if (! $invite) {
            throw ValidationException::withMessages([
                'invitation_type' => 'Failed to create invite.',
            ]);
        }

        $url = $this->inviteUrl($invite, $verifier);
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
     * @throws RandomException
     */
    public function storeOrganizationInvite(StoreOrganizationInviteRequest $request): RedirectResponse
    {
        $organization = $request->user()->currentOwnedOrganization();

        if (! $organization) {
            abort(403);
        }

        $validated = $request->validated();

        if ($organization->users()->where('email', $validated['email'])->exists()) {
            throw ValidationException::withMessages([
                'email' => 'This user is already a member of your organization.',
            ]);
        }

        $pendingInviteExists = AccountInvites::query()
            ->where('invitation_type', 'join_org')
            ->where('organization_id', $organization->id)
            ->where('email', $validated['email'])
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->exists();

        if ($pendingInviteExists) {
            throw ValidationException::withMessages([
                'email' => 'There is already an active invite for this email.',
            ]);
        }

        $selector = bin2hex(random_bytes(32));
        $verifier = bin2hex(random_bytes(32));

        $invite = AccountInvites::create([
            'selector' => $selector,
            'verifier_hash' => hash('sha256', $verifier),
            'invitation_type' => 'join_org',
            'organization_id' => $organization->id,
            'email' => $validated['email'],
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'role_in_org' => $validated['role_in_org'],
            'expires_at' => now()->addDays(7),
            'invited_by' => $request->user()->id,
        ]);

        $url = $this->inviteUrl($invite, $verifier);
        $mailSent = false;
        $mailError = null;

        try {
            Mail::to($validated['email'])->send(new InviteEmail(
                inviteUrl: $url,
                recipientName: $validated['first_name'],
                organizationName: $organization->organization_name,
                expiresAt: $invite->expires_at,
            ));
            $mailSent = true;
        } catch (\Throwable $e) {
            report($e);
            $mailError = 'Invite created, but email failed to send.';
        }

        $redirect = redirect()
            ->route('invitations')
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
    public function join(Request $request, string $token): RedirectResponse
    {
        try {
            [$selector, $verifier] = $this->parseToken($token);

            DB::transaction(function () use ($selector, $verifier, $request) {
                $invite = $this->getInviteForUpdate($selector);
                $invite = $this->assertInviteValid($invite, $verifier);

                $this->acceptInvite($request, $invite);
            });

            return redirect()->route('login')->with('success', 'Invite accepted successfully.');
        } catch (
            InviteNotFoundException|
            InvalidTokenFormatException|
            IncorrectVerifierException|
            InviteUsedException|
            InviteExpiredException|
            OnboardingRequestNotFoundException $e
        ) {
            return redirect()->route('login')->with('error', $e->getMessage());
        }
    }

    private function getInviteForView(string $selector): ?AccountInvites
    {
        return AccountInvites::query()
            ->with(['onboardingRequest', 'organization'])
            ->where('selector', $selector)
            ->first();
    }

    private function getInviteForUpdate(string $selector): ?AccountInvites
    {
        return AccountInvites::query()
            ->with(['onboardingRequest', 'organization'])
            ->where('selector', $selector)
            ->lockForUpdate()
            ->first();
    }

    public function showJoinForm(Request $request, string $token): Response|RedirectResponse
    {
        try {
            [$selector, $verifier] = $this->parseToken($token);

            $invite = $this->getInviteForView($selector);
            $invite = $this->assertInviteValid($invite, $verifier);

            return Inertia::render('auth/join', [
                'token' => $token,
                'invite' => $this->invitePayload($invite),
            ]);
        } catch (
            InviteNotFoundException|
            InvalidTokenFormatException|
            IncorrectVerifierException|
            InviteUsedException|
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
        if (! $invite) {
            throw new InviteNotFoundException;
        }

        if ($invite->used_at !== null) {
            throw new InviteUsedException;
        }

        if ($invite->expires_at->isPast()) {
            throw new InviteExpiredException;
        }

        if (! hash_equals($invite->verifier_hash, hash('sha256', $verifier))) {
            throw new IncorrectVerifierException;
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
            throw new InvalidTokenFormatException;
        }

        return $parts;
    }

    /**
     * @throws OnboardingRequestNotFoundException
     */
    private function verifyOnboardingRequest(AccountInvites $accountInvite): OnboardingRequest
    {
        $onboardingRequest = $accountInvite->onboardingRequest;

        if (! $onboardingRequest) {
            throw new OnboardingRequestNotFoundException;
        }

        return $onboardingRequest;
    }

    /**
     * @throws OnboardingRequestNotFoundException
     * @throws ValidationException
     */
    private function acceptInvite(Request $request, AccountInvites $invite): void
    {
        if ($invite->invitation_type === 'join_org') {
            $this->acceptOrganizationInvite($request, $invite);

            return;
        }

        $this->acceptOnboardingInvite($request, $invite);
    }

    /**
     * @throws OnboardingRequestNotFoundException
     * @throws ValidationException
     */
    private function acceptOnboardingInvite(Request $request, AccountInvites $invite): void
    {
        $onboardingRequest = $this->verifyOnboardingRequest($invite);
        $password = $this->validatedPassword($request);

        if (User::query()->where('email', $onboardingRequest->email)->exists()) {
            throw ValidationException::withMessages([
                'password' => 'A user with this email already exists.',
            ]);
        }
        try {
            DB::transaction(function () use ($onboardingRequest, $password, $invite) {
                $organization = Organization::create([
                    'organization_name' => $onboardingRequest->organization_name,
                    'organization_type' => $onboardingRequest->organization_type,
                ]);

                $user = User::create([
                    'email' => $onboardingRequest->email,
                    'name' => trim($onboardingRequest->first_name.' '.$onboardingRequest->last_name),
                    'password' => Hash::make($password),
                    'role' => 'user',
                    'status' => 'active',
                ]);

                $user->forceFill(['email_verified_at' => now()])->save();

                $user->organizations()->attach($organization->id, [
                    'joined_on' => now()->toDateString(),
                    'role_in_org' => 'ORGANIZATION_OWNER',
                    'admin_privileges' => true,
                ]);

                $invite->forceFill(['used_at' => now()])->save();

                if ($organization->organization_type === 'individual') {
                    Teacher::query()->firstOrCreate( // individual is also a teacher
                        ['user_id' => $user->id],
                        ['speciality' => null],
                    );
                    SchoolGroup::create([   // default group for individual
                        'group_id' => 1,
                        'school_id' => $organization->id,
                        'name' => 'Course group',
                    ]);
                }
            });

        } catch (\Exception $exception) {
            report($exception);
        }

    }

    /**
     * @throws ValidationException
     */
    private function acceptOrganizationInvite(Request $request, AccountInvites $invite): void
    {
        $organization = $invite->organization;

        if (! $organization) {
            throw ValidationException::withMessages([
                'password' => 'This organization invite is no longer valid.',
            ]);
        }

        if (! $invite->email || ! $invite->role_in_org) {
            throw ValidationException::withMessages([
                'password' => 'This invite is missing organization invite details.',
            ]);
        }

        $user = User::query()
            ->where('email', $invite->email)
            ->lockForUpdate()
            ->first();

        if (! $user) {
            $password = $this->validatedPassword($request);

            $user = User::create([
                'email' => $invite->email,
                'name' => trim(($invite->first_name ?? '').' '.($invite->last_name ?? '')) ?: $invite->email,
                'password' => Hash::make($password),
                'role' => 'user',
                'status' => 'active',
            ]);

            $user->forceFill(['email_verified_at' => now()])->save();
        } else {
            $user->forceFill([
                'status' => 'active',
                'email_verified_at' => $user->email_verified_at ?? now(),
            ])->save();
        }

        $membershipExists = $user->organizations()
            ->where('organization_id', $organization->id)
            ->exists();

        if (! $membershipExists) {
            $groupId = null;

            if ($invite->role_in_org === 'STUDENT' && $organization->organization_type === 'individual') {
                $groupId = $organization->schoolGroups()
                    ->where('name', 'Course group')
                    ->value('group_id');
            }

            $user->organizations()->attach($organization->id, [
                'joined_on' => now()->toDateString(),
                'role_in_org' => $invite->role_in_org,
                'admin_privileges' => false,
                'group_id' => $groupId,
            ]);
        }

        if ($invite->role_in_org === 'TEACHER') {
            Teacher::query()->firstOrCreate(
                ['user_id' => $user->id],
                ['speciality' => null],
            );
        } elseif ($invite->role_in_org === 'STUDENT') {
            Student::query()->firstOrCreate(
                ['user_id' => $user->id],
                ['personal_code' => null],
            );
        }

        $invite->forceFill(['used_at' => now()])->save();
    }

    /**
     * @throws ValidationException
     */
    private function validatedPassword(Request $request): string
    {
        return $request->validate([
            'password' => ['required', 'confirmed', Password::defaults()],
        ])['password'];
    }

    private function invitePayload(AccountInvites $invite): array
    {
        $onboardingRequest = $invite->onboardingRequest;
        $organization = $invite->organization;
        $email = $invite->email ?? $onboardingRequest?->email;
        $name = trim(implode(' ', array_filter([
            $invite->first_name ?? $onboardingRequest?->first_name,
            $invite->last_name ?? $onboardingRequest?->last_name,
        ])));

        return [
            'invitation_type' => $invite->invitation_type,
            'recipient_name' => $name ?: null,
            'email' => $email,
            'organization_name' => $organization?->organization_name ?? $onboardingRequest?->organization_name,
            'role_in_org' => $invite->role_in_org,
            'requires_password' => $email ? ! User::query()->where('email', $email)->exists() : true,
        ];
    }

    private function inviteUrl(AccountInvites $invite, string $plainVerifier): string
    {
        return url('/join/'.$invite->selector.'.'.$plainVerifier);
    }

    public function show(AccountInvites $account_invites)
    {
        //
    }

    public function edit(AccountInvites $account_invites)
    {
        //
    }

    public function update(Updateaccount_invitesRequest $request, AccountInvites $account_invites)
    {
        //
    }

    public function destroy(AccountInvites $account_invites)
    {
        //
    }
}
