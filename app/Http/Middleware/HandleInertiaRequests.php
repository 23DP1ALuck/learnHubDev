<?php

namespace App\Http\Middleware;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $currentOrganization = $request->user() instanceof User
            ? $this->resolveCurrentOrganization($request->user())
            : null;

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
                'organizationRole' => $currentOrganization?->pivot?->role_in_org,
                'canManageOrganization' => (bool) $currentOrganization?->pivot?->admin_privileges===true,
            ],
            'org' => $currentOrganization,
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'invite_url' => fn() => $request->session()->get('invite_url'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    private function resolveCurrentOrganization(User $user): ?Organization
    {
        return $user->currentOrganization();
    }
}
