<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOnboardingRequestRequest;
use App\Http\Requests\UpdateOnboardingRequestRequest;
use App\Models\OnboardingRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OnboardingRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/onboarding-requests', []);
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
