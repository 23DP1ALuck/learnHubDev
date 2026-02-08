<?php

namespace App\Http\Controllers;

use App\Models\OnboardingRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->user()?->role;
        if($role == 'admin'){
            return $this->adminDashboard();
        }
        return $this->userDashboard();

    }
    private function adminDashboard(){
        $latestOnboardingRequests = OnboardingRequest::latest()->take(5)->get();
        return Inertia::render('admin/dashboard', [
            'onboardingRequests' => $latestOnboardingRequests,
        ]);
    }
    private function userDashboard()
    {
        return Inertia::render('dashboard', []);
    }
}
