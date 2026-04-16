<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\SchoolGroup;
use App\Models\User;
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
        $studentAssignmentSummary = $this->getStudentAssignmentSummary($group);

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
    private function getStudentAssignmentSummary(SchoolGroup $group): array{

        $groupsModules = $group->groupModulesTeachers()
            ->with('module')
            ->get();

        $modules = $groupsModules->map(function ($groupModuleTeacher) {
            return $groupModuleTeacher->module;
        })->filter();


        $assignments = $modules->flatMap(function ($module) {
            return $module->assignments()->with('topics')->get();
        });

        return $assignments->map(function ($assignment) {
            return [
                'id' => $assignment->id,
                'title' => $assignment->title,
                'description' => $assignment->description,
                'due_date' => $assignment->due_date,
                'tasks_count' => $assignment->tasks()->count(),
                'status' => $assignment->status,
                'first_task_id' => $assignment->tasks()->first()?->task_id,
                'module_names' => $assignment->topics()->pluck('topics.name')->values(),
                'total_points' => $assignment->totalPoints(),
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
}
