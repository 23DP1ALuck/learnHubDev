<?php

namespace App\Http\Controllers;

use App\Models\OnboardingRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $role = $request->user()?->role;

        if ($role === 'admin') {
            return $this->adminDashboard();
        }

        if ($request->user()?->ownedOrganizations()->exists()) {
            return app(OrganizationOwnerController::class)->dashboard($request);
        }

        return $this->userDashboard();
    }

    private function adminDashboard(): Response
    {
        $latestOnboardingRequests = OnboardingRequest::latest()->take(5)->get();

        return Inertia::render('admin/dashboard', [
            'onboardingRequests' => $latestOnboardingRequests,
        ]);
    }

    private function userDashboard(): Response
    {
        return Inertia::render('dashboard', []);
    }
}
