<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOnboardingRequestRequest;
use App\Http\Requests\UpdateOnboardingRequestRequest;
use App\Models\OnboardingRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OnboardingRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $statuses = ['pending', 'approved', 'rejected']; // allowed statuses
        $queryParam = request()->query('status', 'pending'); // get query param
        if (!in_array($queryParam, $statuses)) {    // check if query param is valid
            return redirect()->route('onboarding-requests')->with('error', 'Invalid status parameter.');
        }
        $requests = OnboardingRequest::where('status', $queryParam)
            ->latest()
            ->paginate(5)
            ->withQueryString();
        $countsByStatus = OnboardingRequest::query()    // get status metrics
            ->selectRaw('SUM(status="approved") as approved,
             SUM(status="rejected") as rejected,
             SUM(status="pending") as pending')
            ->first();
        return Inertia::render('admin/onboarding-requests', [
            'onboardingRequests' => $requests,
            'metrics' => $countsByStatus
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOnboardingRequestRequest $request)
    {
        OnboardingRequest::create($request->validated());

        return redirect()->back()->with('success', 'Your request has been submitted successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(OnboardingRequest $onboardingRequest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(OnboardingRequest $onboardingRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOnboardingRequestRequest $request, OnboardingRequest $onboardingRequest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OnboardingRequest $onboardingRequest)
    {
        //
    }
}
