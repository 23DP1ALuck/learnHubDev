<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $unreadMessages = 0;
        if ($currentUser instanceof User) {
            if ($currentUser->role !== 'admin') {
                $currentOrganization = $currentUser
                    ->organizations()
                    ->where('id', $currentOrganizationId)
                    ->first();
                $unreadMessages = $this->getUnreadMessages($currentUser, $currentOrganization->id);
            }
        }
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'chatUnreadCount' => $unreadMessages,
            'locale' => app()->getLocale(),
            'translations' => [
                'common' => trans('common'),
                'landing' => trans('landing'),
                'learning' => trans('learning'),
                'owner' => trans('owner'),
                'teacher' => trans('teacher'),
                'student' => trans('student'),
                'chat' => trans('chat'),
                'settings' => trans('settings'),
                'auth_ui' => trans('auth_ui'),
                'admin' => trans('admin'),
                'error_reports' => trans('error_reports'),
            ],
            'auth' => [
                'user' => $request->user(),
                'currentOrganization' => $currentOrganization,
                'organizationRole' => $currentOrganization?->pivot?->role_in_org,
                'canManageOrganization' => (bool) $currentOrganization?->pivot?->admin_privileges === true,
                'organizations' => $currentUser instanceof User ? $this->listOrganizations($request->user()) : null,
            ],
            'session' => [
                'activeOrganization' => (int) $currentOrganizationId ?? null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'afterLogin' => fn () => $request->session()->get('afterLogin'),
                'invite_url' => fn () => $request->session()->get('invite_url'),
                'error' => fn () => $request->session()->get('error'),
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
        if (! $activeOrganizationId) {
            return null;
        }

        return $activeOrganizationId;
    }

    private function listOrganizations(User $user): Collection
    {
        return $user->organizations()->get();
    }

    private function getUnreadMessages(User $user, int $activeOrg)
    {
        return DB::table('messages')
            ->join('chat_users', 'chat_users.chat_id', '=', 'messages.chat_id')
            ->join('chats', 'chats.chat_id', '=', 'messages.chat_id')
            ->where('chat_users.user_id', $user->id)
            ->where('chats.organization_id', $activeOrg)
            ->where('messages.sender_id', '!=', $user->id)
            ->whereColumn('messages.sent_at', '>', 'chat_users.last_read_at')
            ->count();
    }
}
