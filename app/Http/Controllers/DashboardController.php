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

        $currentOrg = $request->session()->get('activeOrganization', '');
        if(!$currentOrg){
            return redirect()->route('login');
        }
        $organization = $request->user()?->organizations()->where('id', $currentOrg)->first();
        if($organization){
            switch ($organization->pivot->role_in_org) {
                case 'ORGANIZATION_OWNER':
                    return app(OrganizationOwnerController::class)->dashboard($request);
                case 'STUDENT':
                    return app(StudentContentController::class)->dashboard($request);
                case 'TEACHER':
                    return app(TeacherContentController::class)->dashboard($request);
            }
        }



        return $this->userDashboard($request);
    }

    private function adminDashboard(): Response
    {
        $latestOnboardingRequests = OnboardingRequest::latest()->take(5)->get();

        return Inertia::render('admin/dashboard', [
            'onboardingRequests' => $latestOnboardingRequests,
        ]);
    }

    private function userDashboard(Request $request): Response
    {
        return app(StudentContentController::class)->dashboard($request);
    }
}
