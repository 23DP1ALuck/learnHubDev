<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\Module;
use App\Models\Organization;
use App\Models\SchoolGroup;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentContentController extends Controller
{
    public function dashboard(Request $request){

        $user = $request->user();
        $organizationId = $request->session()->get('activeOrganization');

        $organization = $user->organizations()
            ->where('organizations.id', $organizationId)
            ->withPivot('group_id')
            ->firstOrFail();

        $groupId = $organization->pivot->group_id;

        $group = $organization->schoolGroups()
            ->where('group_id', $groupId)
            ->where('school_id', $organization->id)
            ->firstOrFail();

        $dashboardSummary = $this->getDashboardSummary($user, $group);
        $studentModuleSummary = $this->getStudentModuleSummary($group);
        $studentAssignmentSummary = $this->getStudentAssignmentSummary($group, $user);
        dd($studentAssignmentSummary);

        return Inertia::render('student/dashboard', [
            "stats" => $dashboardSummary,
            "modules" => $studentModuleSummary,
            "upcomingAssignments" => $studentAssignmentSummary,
        ]);
    }
    private function getDashboardSummary(User $user, SchoolGroup $group): array{

        $moduleCount = $group->groupModulesTeachers()
            ->distinct()
            ->count('module_id');

        $groupsModules = $group->groupModulesTeachers()
            ->with('module')
            ->get();

        $modules = $groupsModules->map(function ($groupModuleTeacher) {
            return $groupModuleTeacher->module;
        })->filter(); // filter removes null values

        $topics = $modules->flatMap(function ($module) {
            return $module->topics()->withCount('assignments')->get();
        });

        $assignmentsCount = $topics->sum('assignments_count');

        $assignments = $topics->flatMap(function ($topic) {
            return $topic->assignments()->with('submissions')->get();
        });

        $submissions = $assignments->flatMap(function ($assignment) {
            return $assignment->submissions;
        });

        $pending = $submissions
            ->where('student_id', $user->id)
            ->where('status', 'DRAFT')
            ->count();

        $averagePercent = $submissions
            ->where('student_id', $user->id)
            ->avg('percent') ?? 0;
        return[
            'modules' => $moduleCount,
            'assignments' => $assignmentsCount,
            'pending' => $pending,
            'averagePercent' => $averagePercent,
        ];
    }
    private function getStudentModuleSummary(SchoolGroup $group): array{

        $groupsModules = $group->groupModulesTeachers()
            ->with('module')
            ->get();

        $modules = $groupsModules->map(function ($groupModuleTeacher) {
            return $groupModuleTeacher->module;
        })->filter(); // filter removes null values

        return $modules->map(function ($module){
            return [
                'id' => $module->id,
                'name' => $module->name,
                'description' => $module->description,
                'start_date' => $module->start_date,
                'end_date' => $module->end_date,
                'topics_count' => $module->topics()->count(),
                'assignments_count' => $module->assignments()->count(),
            ];
        })->toArray();
    }
    private function getStudentAssignmentSummary(SchoolGroup $group, User $user): array{

        $groupsModules = $group->groupModulesTeachers()
            ->with('module')
            ->get();

        $modules = $groupsModules->map(function ($groupModuleTeacher) {
            return $groupModuleTeacher->module;
        })->filter();


        $assignments = $modules->flatMap(function ($module) {
            return $module->assignments()->with('topics')->get();
        });

        return $assignments->map(function ($assignment) use ($user) {
            return [
                ...$assignment->toArray(),
                'tasks_count' => $assignment->tasks()->count(),
                'first_task_id' => $assignment->tasks()->first()?->task_id,
                'module_names' => $assignment->topics()->pluck('topics.name')->values(),
                'total_points' => $assignment->totalPoints(),
                'status' => $assignment->submissions()->where('student_id', $user->id)->first()?->status ?? 'Not started',
            ];
        })->toArray();


    }

    public function modules(Request $request){
        $user = $request->user();
        $organizationId = $request->session()->get('activeOrganization');

        $organization = $user->organizations()
            ->where('organizations.id', $organizationId)
            ->withPivot('group_id')
            ->firstOrFail();

        $groupId = $organization->pivot->group_id;

        $group = $organization->schoolGroups()
            ->where('group_id', $groupId)
            ->where('school_id', $organization->id)
            ->firstOrFail();

        $studentModuleSummary = $this->getStudentModuleSummary($group);
        return Inertia::render('student/modules', [
            "modules" => $studentModuleSummary,
        ]);
    }

    public function module(Request $request, int $moduleId){
        $user = $request->user();
        $organizationId = $request->session()->get('activeOrganization');
        $organization = $user->organizations()
            ->where('organizations.id', $organizationId)
            ->withPivot('group_id')
            ->firstOrFail();
        if(!$organization){
            return redirect()->back()->with('error', 'Organization not found');
        }

        $groupId = $organization->pivot->group_id;

        $group = $organization->schoolGroups()
            ->where('group_id', $groupId)
            ->where('school_id', $organization->id)
            ->firstOrFail();

        if(!$group){
            return redirect()->back()->with('error', 'Group not found');
        }

        $groupsModules = $group->groupModulesTeachers() // check if the user's group enroll in this module
        ->where('group_id', $group->group_id)
            ->where('school_id', $group->school_id)
            ->where('module_id', $moduleId)
            ->with('module')
            ->first();

        if(!$groupsModules){
            return redirect()->back()->with('error', 'You have no access to this module');
        }
        $module = $groupsModules->module;


        $studentModuleSummary = $this->getStudentSpecificModuleSummary($module);
        $studentTopicSummary = $this->getStudentTopicSummary($group);
        return Inertia::render('student/module', [
            "module" => $studentModuleSummary,
            "topics" => $studentTopicSummary
        ]);
    }
    private function getStudentTopicSummary(SchoolGroup $group): array{
        $groupsModules = $group->groupModulesTeachers()
            ->with('module')
            ->get();

        $modules = $groupsModules->map(function ($groupModuleTeacher) {
            return $groupModuleTeacher->module;
        })->filter(); // clear null values

        return $modules->flatMap(function ($module) {
            return $module->topics()->withCount('materials', 'assignments')->get();
        })->toArray();
    }
    private function getStudentSpecificModuleSummary(Module $module): array{
        return [
            'id' => $module->id,
            'name' => $module->name,
            'description' => $module->description,
            'start_date' => $module->start_date,
            'end_date' => $module->end_date,
            'topics_count' => $module->topics()->count(),
            'assignments_count' => $module->assignments()->count(),
        ];
    }
    public function topic(Request $request, int $moduleId, int $topicId){
        $user = $request->user();
        $organizationId = $request->session()->get('activeOrganization');
        $organization = $user->organizations()
            ->where('organizations.id', $organizationId)
            ->withPivot('group_id')
            ->firstOrFail();
        if(!$organization){
            return redirect()->back()->with('error', 'Organization not found');
        }

        $groupId = $organization->pivot->group_id;

        $group = $organization->schoolGroups()
            ->where('group_id', $groupId)
            ->where('school_id', $organization->id)
            ->firstOrFail();

        if(!$group){
            return redirect()->back()->with('error', 'Group not found');
        }

        $groupsModules = $group->groupModulesTeachers() // check if the user's group enroll in this module
        ->where('group_id', $group->group_id)
            ->where('school_id', $group->school_id)
            ->where('module_id', $moduleId)
            ->with('module')
            ->first();

        if(!$groupsModules){
            return redirect()->back()->with('error', 'You have no access to this module');
        }
        $module = $groupsModules->module;
        $topic = $module->topics()->where('topics.topic_id', $topicId)->first();
        if(!$topic){
            return redirect()->back()->with('error', 'Topic not found');
        }
        $studentTopicSummary = $this->getSpecificTopicSummary($topic);
        $studentModuleSummary = $this->getStudentSpecificModuleSummary($module);
        $studentAssignmentSummary = $this->getStudentAssignmentSummary($group, $user);
        return Inertia::render('student/topic', [
            "module" => $studentModuleSummary,
            "topic" => $studentTopicSummary,
            "materials" => $topic->materials()->get()->toArray(),
            "assignments" => $studentAssignmentSummary,
        ]);
    }
    private function getSpecificTopicSummary(Topic $topic): array{
        return [
            'id' => $topic->id,
            'name' => $topic->name,
            'description' => $topic->description,
            'start_date' => $topic->start_date,
            'end_date' => $topic->end_date,
            'materials_count' => $topic->materials()->count(),
            'assignments_count' => $topic->assignments()->count(),
        ];
    }

}
