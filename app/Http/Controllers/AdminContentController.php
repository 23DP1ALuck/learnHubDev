<?php

namespace App\Http\Controllers;

use App\Models\OnboardingRequest;
use App\Models\Organization;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminContentController extends Controller
{
    public function dashboard(Request $request): RedirectResponse | Response
    {
        $user = $request->user();
        if (!$user || $user->role !== 'admin') {
            return redirect()->route('login');
        }
        $stats = $this->dashboardStats();
//            'recentOrganizations' => [
//                [

//                ],
//            ],
//            'recentActivity' => [
//                [
//                    'id' => 1,
//                    'title' => 'New onboarding request',
//                    'description' => 'School A requested access.',
//                    'created_at' => '2026-04-28',
//                ],
//            ],

        return Inertia::render('admin/dashboard', [
            'stats' => $this->dashboardStats() ?? [
                'users' => 0,
                'organizations' => 0,
                'schools' => 0,
                'individual_courses' => 0,
                'teachers' => 0,
                'students' => 0,
                'pending_onboarding' => 0,
                'approved_onboarding' => 0,
                ],
            'onboardingRequests' => $this->latestOnboardingRequests() ?? [],
            'recentOrganizations' => $this->recentOrganizations() ?? [],
            'recentActivity' => $this->recentActivity() ?? [],
        ]);
    }

    private function dashboardStats(): array
    {
        return [
            'users' => User::query()->count(),
            'organizations' => Organization::query()->count(),
            'schools' => Organization::query()->where('organization_type', 'school')->count(),
            'individual_courses' => Organization::query()->where('organization_type', 'individual')->count(),
            'teachers' => Teacher::query()->count(),
            'students' => Student::query()->count(),
            'pending_onboarding' => OnboardingRequest::query()->where('status', 'pending')->count(),
            'approved_onboarding' => OnboardingRequest::query()->where('status', 'approved')->count(),
        ];
    }

    private function latestOnboardingRequests()
    {
        return OnboardingRequest::query()
            ->latest()
            ->take(5)
            ->get();
    }

    private function recentOrganizations(): array
    {
        return Organization::query()
            ->withCount('users')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn (Organization $organization) => [
                'id' => $organization->id,
                'organization_name' => $organization->organization_name,
                'organization_type' => $organization->organization_type,
                'users_count' => $organization->users_count,
                'created_at' => $organization->created_at,
            ])
            ->toArray();
    }

    private function recentActivity(): array
    {
        return OnboardingRequest::query()
            ->latest()
            ->take(5)
            ->get()
            ->map(fn (OnboardingRequest $request) => [
                'id' => $request->id,
                'title' => 'New onboarding request',
                'description' => "{$request->organization_name} requested {$request->organization_type} access.",
                'created_at' => $request->created_at,
            ])
            ->toArray();
    }

}
