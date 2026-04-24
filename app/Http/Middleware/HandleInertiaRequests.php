<?php

namespace App\Http\Middleware;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
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
        $currentOrganizationId = $this->resolveCurrentOrganization($request);

        $currentUser = $request->user();
        $currentOrganization = null;
        if($currentUser instanceof User){
            if($currentUser->role !== 'admin'){
                $currentOrganization = $currentUser
                    ->organizations()
                    ->where('id', $currentOrganizationId)
                    ->first();
            }
        }


        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'chatUnreadCount' => 0,
            'auth' => [
                'user' => $request->user(),
                'currentOrganization' => $currentOrganization,
                'organizationRole' => $currentOrganization?->pivot?->role_in_org,
                'canManageOrganization' => (bool) $currentOrganization?->pivot?->admin_privileges===true,
                'organizations' => $currentUser instanceof User ? $this->listOrganizations($request->user()) : null,
            ],
            'session' => [
                "activeOrganization" => (int) $currentOrganizationId ?? null,
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'afterLogin' => fn() => $request->session()->get('afterLogin'),
                'invite_url' => fn() => $request->session()->get('invite_url'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    private function resolveCurrentOrganization(Request $request): ?int
    {
        $user = $request->user();

        if (! $user instanceof User) {
            return null;
        }
        $activeOrganizationId = $request->session()->get('activeOrganization');
        if(!$activeOrganizationId){
            return null;
        }
        return $activeOrganizationId;
    }
    private function listOrganizations(User $user): Collection{
        return $user->organizations()->get();
    }
}
