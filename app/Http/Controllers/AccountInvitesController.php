<?php

namespace App\Http\Controllers;

use App\Http\Requests\Storeaccount_invitesRequest;
use App\Http\Requests\Updateaccount_invitesRequest;
use App\Models\AccountInvites;
use App\Models\OnboardingRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
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

        $invite = DB::transaction(function () use (
            $invitationType,
            $onboardingRequestId,
            $selector,
            $verifier,
            $request
        ) {
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

            return AccountInvites::create([
                'selector' => $selector,
                'verifier_hash' => hash('sha256', $verifier),
                'invitation_type' => $invitationType,
                'onboarding_request_id' => $invitationType === 'onboarding_request' ? $onboardingRequestId : null,
                'expires_at' => now()->addDays(2),
                'invited_by' => $request->user()->id,
            ]);
        });

        if (!$invite) {
            throw ValidationException::withMessages([
                'invitation_type' => 'Failed to create invite.',
            ]);
        }

        $url = url('/join/' . $selector . '.' . $verifier);

        if ($request->expectsJson()) {
            return response()->json(['url' => $url]);
        }

        return redirect()
            ->route('onboarding-requests')
            ->with('success', 'Invite created successfully.')
            ->with('invite_url', $url);
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
