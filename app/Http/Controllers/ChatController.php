<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreChatRequest;
use App\Models\Organization;
use App\Models\SchoolGroup;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    public function chats(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        if (!$user) {
            return redirect()->route('login');
        }
        $organizationId = $request->session()->get('activeOrganization');

        if (!$organizationId) {
            return redirect()->route('dashboard')->with('afterLogin', true);
        }

        $organization = $user->organizations()->where('organizations.id', $organizationId)->first();

        $groupMembers = $organization
            ->users()
            ->wherePivot('group_id', $organization->pivot->group_id)
            ->where('id', '!=', $user->id)
            ->get();

        $groupId = $organization->pivot?->group_id;
        $group = null;

        if ($groupId) {
            $group = SchoolGroup::query()
                ->where('group_id', $groupId)
                ->where('school_id', $organization->id)
                ->first();
        }


        // get all modules/teachers for current group
        $moduleTeacher = $group?->groupModulesTeachers()->with('teacher')->get();
        $moduleNames = $this->getTeacherModuleNames($moduleTeacher); // retrieve names

        $teachers = $moduleTeacher->map(function ($groupModuleTeacher) use ($moduleNames){
            $teacher = $groupModuleTeacher->teacher->user()->first();
            return [
                'id' => $teacher->id,
                'name' => $teacher->name,
                'email' => $teacher->email,
                'role_in_org' => 'TEACHER',
                'module_names' => $moduleNames,
            ];
        })->unique('id');


        $classMates = $groupMembers->map(function (User $user) use ($organization) {
            $groupId = $organization?->pivot?->group_id;
            $group = SchoolGroup::query()
                ->where('group_id', $groupId)
                ->where('school_id', $organization->id)
                ->first();
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role_in_org' => $user->pivot?->role_in_org,
                'group_name' => $group->name ?? null,
            ];
        });

//        dd($teachers);
        $classPools = $classMates->merge($teachers)->toArray();
        return Inertia::render('chats/index', [
            'stats' => [
                'total' => 0,
                'unread' => 0,
                'private' => 0,
                'groups' => 0,
                'modules' => 0,
            ],
            'chats' => [],
            'activeChat' => null,
            'recipientPools' => [
                'class' => $classPools,
                'organization' => [],
            ],
        ]);
    }
    private function getTeacherModuleNames(Collection $moduleTeachers): array
    {
        return $moduleTeachers->map(function ($moduleTeacher) {
            return $moduleTeacher->module->name;
        })->unique()->toArray();
    }
    public function createChat(StoreChatRequest $request): RedirectResponse
    {
        $request = $request->validated();

        dd($request);
        return redirect()->route('chats');
    }
}
