<?php

namespace App\Http\Controllers;

use App\Mail\InviteEmail;
use App\Models\AccountInvites;
use App\Models\GroupModuleTeacher;
use App\Models\Module;
use App\Models\Organization;
use App\Models\SchoolGroup;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationOwnerController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $organization = $this->ownedOrganization($request);
        $stats = $this->organizationStats($organization);

        $latestMembers = $organization->users()
            ->orderByDesc('users_organizations.joined_on')
            ->limit(5)
            ->get()
            ->map(fn (User $user) => $this->memberPayload($user))
            ->values();

        $latestInvites = AccountInvites::query()
            ->with('inviter')
            ->where('invitation_type', 'join_org')
            ->where('organization_id', $organization->id)
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (AccountInvites $invite) => $this->invitePayload($invite))
            ->values();

        return Inertia::render('owner/dashboard', [
            'organization' => $this->organizationPayload($organization),
            'stats' => $stats,
            'latestMembers' => $latestMembers,
            'latestInvites' => $latestInvites,
        ]);
    }

    public function organization(Request $request): Response
    {
        $organization = $this->ownedOrganization($request);

        return Inertia::render('owner/organization', [
            'organization' => $this->organizationPayload($organization),
            'stats' => $this->organizationStats($organization),
        ]);
    }

    public function users(Request $request): Response
    {
        $organization = $this->ownedOrganization($request);

        $members = $organization->users()
            ->orderByRaw("CASE users_organizations.role_in_org
                WHEN 'ORGANIZATION_OWNER' THEN 0
                WHEN 'TEACHER' THEN 1
                ELSE 2
            END")
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => $this->memberPayload($user))
            ->values();

        return Inertia::render('owner/users', [
            'organization' => $this->organizationPayload($organization),
            'stats' => $this->organizationStats($organization),
            'members' => $members,
        ]);
    }

    public function invitations(Request $request): Response
    {
        $organization = $this->ownedOrganization($request);

        $invites = AccountInvites::query()
            ->with('inviter')
            ->where('invitation_type', 'join_org')
            ->where('organization_id', $organization->id)
            ->latest()
            ->get()
            ->map(fn (AccountInvites $invite) => $this->invitePayload($invite))
            ->values();

        return Inertia::render('owner/invitations', [
            'organization' => $this->organizationPayload($organization),
            'stats' => $this->organizationStats($organization),
            'invites' => $invites,
            'roleOptions' => [
                ['value' => 'TEACHER', 'label' => 'Teacher'],
                ['value' => 'STUDENT', 'label' => 'Student'],
            ],
        ]);
    }

    public function groups(Request $request): Response
    {
        // TODO: refactor queries
        $organization = $this->ownedOrganization($request);

        abort_if($organization->organization_type !== 'school', 404);

        $studentCounts = DB::table('users_organizations')
            ->select('group_id', DB::raw('COUNT(*) as total'))
            ->where('organization_id', $organization->id)
            ->where('role_in_org', 'STUDENT')
            ->whereNotNull('group_id')
            ->groupBy('group_id')
            ->pluck('total', 'group_id');

        $teacherCounts = DB::table('group_module_teacher')
            ->select('group_id', DB::raw('COUNT(DISTINCT teacher_id) as total'))
            ->where('school_id', $organization->id)
            ->groupBy('group_id')
            ->pluck('total', 'group_id');

        $moduleCounts = DB::table('group_module_teacher')
            ->select('group_id', DB::raw('COUNT(DISTINCT module_id) as total'))
            ->where('school_id', $organization->id)
            ->groupBy('group_id')
            ->pluck('total', 'group_id');

        $groups = $organization->schoolGroups()
            ->orderBy('name')
            ->get()
            ->map(function (SchoolGroup $group) use ($studentCounts, $teacherCounts, $moduleCounts) {
                return [
                    'school_id' => $group->school_id,
                    'group_id' => $group->group_id,
                    'name' => $group->name,
                    'students_count' => (int) ($studentCounts[$group->group_id] ?? 0),
                    'teachers_count' => (int) ($teacherCounts[$group->group_id] ?? 0),
                    'modules_count' => (int) ($moduleCounts[$group->group_id] ?? 0),
                    'created_at' => optional($group->created_at)?->toISOString(),
                ];
            })
            ->values();

        return Inertia::render('owner/groups', [
            'organization' => $this->organizationPayload($organization),
            'stats' => $this->organizationStats($organization),
            'groups' => $groups,
            'students' => $this->organizationStudents($organization),
        ]);
    }

    public function assignStudents(Request $request)
    {
        $studentId = $request->input('student_id');
        $groupId = $request->input('group_id');
        $organizationId = $request->session()->get('activeOrganization');
        $organization = Organization::query()->where('id', $organizationId)->first();
        $student = User::query()->where('id', $studentId)->first();
        if (! $student) {
            return redirect()->back()->with('error', 'Student not found');
        }
        if (! $student->organizations()->wherePivot('organization_id', $organizationId)->exists()) {
            return redirect()->back()->with('error', 'Student doesn\'t belong to this organization');
        }
        $group = SchoolGroup::query()->where('group_id', $groupId)->first();
        if (! $group) {
            return redirect()->back()->with('error', 'Group not found');
        }
        if (! $organization->schoolGroups()->where('group_id', $groupId)->exists()) {
            return redirect()->back()->with('error', 'Group is not a part of this organization');
        }

        $student->organizations()->updateExistingPivot($organization, ['group_id' => $groupId]);

        return redirect()->route('groups')->with('success', 'Student assigned to group successfully');
    }

    public function assignModules(Request $request)
    {
        $groupId = (int) $request->input('group_id');
        $organizationId = $request->session()->get('activeOrganization');
        $organization = Organization::query()->where('id', $organizationId)->first();

        if (! $organization) {
            return redirect()->back()->with('error', 'Organization not found');
        }

        $group = $organization->schoolGroups()
            ->where('group_id', $groupId)
            ->first();

        if (! $group) {
            return redirect()->back()->with('error', 'Group not found');
        }
        $moduleIds = $request->input('module_ids', []);

        $modules = Module::query()
            ->with('creator.teacher')
            ->where('organization_id', $organization->id)
            ->whereIn('id', $moduleIds)
            ->get()
            ->keyBy('id');

        DB::transaction(function () use ($organization, $groupId, $modules) {
            $semester = date('m') > 8 && date('m') <= 12 ? '1' : '2';
            $schoolYear = $semester == 1 ? date('Y').'/'.(int) date('Y') + 1 : (int) date('Y') - 1 .'/'.(int) date('Y');
            foreach ($modules as $module) {
                GroupModuleTeacher::query()
                    ->where('school_id', $organization->id)
                    ->where('group_id', $groupId)
                    ->where('module_id', $module->id)
                    ->where('teacher_id', '!=', $module->creator_id)
                    ->delete();

                GroupModuleTeacher::query()->firstOrCreate(
                    [
                        'school_id' => $organization->id,
                        'group_id' => $groupId,
                        'module_id' => $module->id,
                        'teacher_id' => $module->creator_id,
                    ],
                    [
                        'semester' => $semester,
                        'school_year' => $schoolYear,
                    ],
                );
            }
        });

        return redirect()->route('groups')->with('success', 'Modules assigned to group successfully');
    }

    private function organizationStudents(Organization $organization): array
    {
        return $organization->users()
            ->wherePivot('role_in_org', 'STUDENT')
            ->wherePivotNull('group_id')
            ->get()
            ->toArray();

    }

    public function availableModules(int $organizationId, int $groupId): JsonResponse
    {
        // TODO: finish this
        $schoolGroup = SchoolGroup::query()->where('group_id', $groupId)->where('school_id', $organizationId)->first();

        $workingModuleIds = DB::table('group_module_teacher')
            ->join('school_groups', function ($join) {
                $join->on('group_module_teacher.school_id', '=', 'school_groups.school_id')
                    ->on('group_module_teacher.group_id', '=', 'school_groups.group_id');
            })->where('school_groups.group_id', $groupId)->distinct()->pluck('group_module_teacher.module_id');
        $modules = Module::query()
            ->whereNotIn('id', $workingModuleIds)
            ->where('organization_id', $organizationId)
            ->with('creator')
            ->get();
        $moduleSummary = $modules->map(function (Module $module) {
            return [
                ...$module->toArray(),
                'teacher_name' => $module->creator?->name ?? '',
            ];
        });

        return response()->json($moduleSummary);
    }

    private function ownedOrganization(Request $request): Organization
    {
        $organization = $request->user()?->currentOwnedOrganization();

        abort_if(! $organization, 403);

        return $organization;
    }

    private function organizationStats(Organization $organization): array
    {
        return [
            'members' => $organization->users()->count(),
            'teachers' => $organization->users()->wherePivot('role_in_org', 'TEACHER')->count(),
            'students' => $organization->users()->wherePivot('role_in_org', 'STUDENT')->count(),
            'school_groups' => $organization->schoolGroups()->count(),
            'pending_invites' => AccountInvites::query()
                ->where('invitation_type', 'join_org')
                ->where('organization_id', $organization->id)
                ->whereNull('used_at')
                ->where('expires_at', '>', now())
                ->count(),
        ];
    }

    private function organizationPayload(Organization $organization): array
    {
        return [
            'id' => $organization->id,
            'organization_name' => $organization->organization_name,
            'organization_type' => $organization->organization_type,
            'created_at' => optional($organization->created_at)?->toISOString(),
            'updated_at' => optional($organization->updated_at)?->toISOString(),
        ];
    }

    private function memberPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'status' => $user->status,
            'role_in_org' => $user->pivot?->role_in_org,
            'admin_privileges' => (bool) $user->pivot?->admin_privileges,
            'joined_on' => $user->pivot?->joined_on,
            'created_at' => optional($user->created_at)?->toISOString(),
        ];
    }

    private function invitePayload(AccountInvites $invite): array
    {
        $status = 'pending';

        if ($invite->used_at) {
            $status = 'used';
        } elseif ($invite->expires_at?->isPast()) {
            $status = 'expired';
        }

        return [
            'id' => $invite->id,
            'first_name' => $invite->first_name,
            'last_name' => $invite->last_name,
            'email' => $invite->email,
            'role_in_org' => $invite->role_in_org,
            'created_at' => optional($invite->created_at)?->toISOString(),
            'expires_at' => optional($invite->expires_at)?->toISOString(),
            'used_at' => optional($invite->used_at)?->toISOString(),
            'status' => $status,
            'inviter_name' => $invite->inviter?->name,
        ];
    }

    public function inviteCSV(Request $request)
    {
        $user = $request->user();
        $organizationId = $request->session()->get('activeOrganization');
        $organization = Organization::query()->where('id', $organizationId)->first();
        if (! $organization) {
            return redirect()->route('dashboard')->with('error', 'Organization not found');
        }

        return Inertia::render('owner/invite-csv', [
            'organization' => $organization,
            'users' => [],
        ]);
    }

    public function inviteCSVParse(Request $request)
    {
        $user = $request->user();
        $organizationId = $request->session()->get('activeOrganization');
        $organization = Organization::query()->where('id', $organizationId)->first();
        if (! $organization) {
            return redirect()->route('dashboard')->with('error', 'Organization not found');
        }
        $csvFile = $request->file('csv_file');
        if (! $csvFile) {
            return redirect()->back()->with('error', 'Please select a CSV file');
        }
        $contents = file_get_contents($csvFile->getRealPath());
        // got here
        // https://medium.com/@jani.hidvegi/parsing-csv-contents-to-collections-in-laravel-e9e69db77b29
        // 1. Split by new line. Use the PHP_EOL constant for cross-platform compatibility.
        $lines = explode(PHP_EOL, trim($contents));

        // 2. Extract the header and convert it into a Laravel collection.
        // https://stackoverflow.com/questions/54145035/cant-remove-ufeff-from-a-string
        // need to remove the BOM from the beginning of the string (if file was exported from Excel)
        $header = collect(str_getcsv(array_shift($lines), separator: ',', enclosure: '"', escape: ''))
            ->map(fn ($value) => preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $value));

        // 3. Convert the rows into a Laravel collection.
        $rows = collect($lines);

        // 4. Map through the rows and combine them with the header to produce the final collection.
        $data = $rows->map(fn ($row) => $header->combine(str_getcsv($row, separator: ',', enclosure: '"', escape: '')));

        return Inertia::render('owner/invite-csv', [
            'organization' => $organization,
            'users' => $data,
        ]);
    }

    public function invitePeopleByCSV(Request $request)
    {
        $user = $request->user();
        $organizationId = $request->session()->get('activeOrganization');
        $organization = Organization::query()->where('id', $organizationId)->first();
        if (! $organization) {
            return redirect()->route('dashboard')->with('error', 'Organization not found');
        }
        $users = $request->input('users', []);
        $validated = $request->validate([
            'users' => ['required', 'array', 'min:1'],
            'users.*.first_name' => ['required', 'string', 'max:255'],
            'users.*.last_name' => ['required', 'string', 'max:255'],
            'users.*.email' => ['required', 'string', 'email', 'max:255'],
            'users.*.role' => ['required', Rule::in(['STUDENT', 'TEACHER'])],
        ]);
        $usersCount = count($validated['users']); // initial invite users count
        $sentCount = 0;
        foreach ($validated['users'] as $invitedUser) {
            $result = $this->invite($organization, $user, [
                'first_name' => $invitedUser['first_name'],
                'last_name' => $invitedUser['last_name'],
                'email' => $invitedUser['email'],
                'role' => $invitedUser['role'],
            ]);
            if ($result['mail_sent']) {
                $sentCount++;
            } else {
                $errors[] = $result['mail_error'];
            }
            sleep(1);
        }
        if ($sentCount < $usersCount) { // if not all invites were sent, redirect back to the invitations message with an error message
            return redirect()->route('invitations')
                ->with('error', "{$sentCount} out of {$usersCount} invites were sent. ".implode(' ', $errors));
        }

        return redirect()->route('invitations')->with('success', 'Invites sent successfully');
    }

    private function invite($organization, $user, $invitedUser)
    {
        $pendingInviteExists = AccountInvites::query()
            ->where('invitation_type', 'join_org')
            ->where('organization_id', $organization->id)
            ->where('email', $invitedUser['email'])
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->exists();
        if ($pendingInviteExists) {
            return [
                'mail_sent' => false,
                'mail_error' => "Active invite already exists for {$invitedUser['email']}.",
            ];
        }

        $selector = bin2hex(random_bytes(32));
        $verifier = bin2hex(random_bytes(32));

        $invite = AccountInvites::query()->create([
            'selector' => $selector,
            'verifier_hash' => hash('sha256', $verifier),
            'invitation_type' => 'join_org',
            'organization_id' => $organization->id,
            'email' => $invitedUser['email'],
            'first_name' => $invitedUser['first_name'],
            'last_name' => $invitedUser['last_name'],
            'role_in_org' => $invitedUser['role'],
            'expires_at' => now()->addDays(7),
            'invited_by' => $user->id,
        ]);
        $mailSent = false;
        $mailError = null;
        $url = url('/join/'.$selector.'.'.$verifier);
        try {
            Mail::to($invitedUser['email'])->send(new InviteEmail(
                inviteUrl: $url,
                recipientName: $invitedUser['first_name'].' '.$invitedUser['last_name'],
                organizationName: $organization->organization_name,
                expiresAt: $invite->expires_at,
            ));
            $mailSent = true;
        } catch (\Throwable $e) {
            report($e);
            $mailError = 'Invite created, but email failed to send. Error: '.$e->getMessage();
            $invite->delete();
        }

        return [
            'mail_sent' => $mailSent,
            'mail_error' => $mailError,
        ];
    }
}
