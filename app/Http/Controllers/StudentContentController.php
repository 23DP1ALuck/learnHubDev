<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Material;
use App\Models\Module;
use App\Models\Organization;
use App\Models\SchoolGroup;
use App\Models\Task;
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


        $topics = $modules->flatMap(function (Module $module) {
            return $module->topics()->get();
        });
        $assignments = $topics->flatMap(function (Topic $topic) {
            return $topic->assignments()->get();
        })->unique('id')->values();

        return $assignments->map(function ($assignment) use ($user) {
            $submission = $assignment->submissions()->where('student_id', $user->id)->first();
            $status = $submission?->status ?? 'Not started';

            $totalPercent = $submission?->total_percent ?? 0;
            return [
                ...$assignment->toArray(),
                'tasks_count' => $assignment->tasks()->count(),
                'first_task_id' => $assignment->tasks()->first()?->task_id,
                'module_names' => $assignment->topics()->pluck('topics.name')->values(),
                'total_points' => $assignment->totalPoints(),
                'total_percent' => $totalPercent,
                'status' => $status
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
            'topic_id' => $topic->topic_id,
            'name' => $topic->name,
            'description' => $topic->description,
            'start_date' => $topic->start_date,
            'end_date' => $topic->end_date,
            'materials_count' => $topic->materials()->count(),
            'assignments_count' => $topic->assignments()->count(),
        ];
    }
    public function assignment(Request $request, int $assignmentId){
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

        $assignment = Assignment::query()
            ->where('id', $assignmentId)
            ->first();

        if(!$assignment){
            return redirect()->back()->with('error', 'Assignment not found');
        }
        $module = $assignment
            ->topics()
            ->first()
            ->module()
            ->first();
        $groupsModules = $group->groupModulesTeachers() // check if the user's group enroll in this module
        ->where('group_id', $group->group_id)
            ->where('school_id', $group->school_id)
            ->where('module_id', $module->id)
            ->first();

        if(!$groupsModules){
            return redirect()->back()->with('error', 'You have no access to this module');
        }
        $assignmentSummary = $this->getSpecificAssignmentSummary($assignment, $user);
        $assignmentTopicsSummary = $this->getSpecificAssignmentTopicsSummary($assignment, $user);
        return Inertia::render('student/assignment', [
            "assignment" => $assignmentSummary,
            "topics" => $assignmentTopicsSummary,
        ]);

    }
    private function getSpecificAssignmentSummary(Assignment $assignment, User $user): array{
        $tasks = $assignment->tasks()->get();
        $points = $tasks->sum('max_points');
        $answers = $tasks->map(function ($task) use ($user){
            return $task
                ->answers()
                ->where('student_id', $user->id)
                ->value('task_id');
        });
        $lastIncompletedTask = $tasks->whereNotIn('task_id', $answers)->sortBy('task_id')->first();
        return [
            ...$assignment->toArray(),
            'tasks_count' => $assignment->tasks()->count(),
            'first_task_id' => $assignment->tasks()->first()?->task_id,
            'module_names' => $assignment->topics()->pluck('topics.name')->values(),
            'total_max_points' => $assignment->totalPoints(),
            'status' => $assignment->submissions()->where('student_id', $user->id)->first()?->status ?? 'Not started',
            'last_incompleted_task' => $lastIncompletedTask->task_id ?? null,
        ];
    }
    private function getSpecificAssignmentTopicsSummary(Assignment $assignment, User $user): array{
        $topics = $assignment->topics()->get();
        return $topics->map(function ($topic){
            return [
                'module_id' => $topic->module_id,
                'module_name' => $topic->module->name,
                'topic_id' => $topic->topic_id,
                'topic_name' => $topic->name,
            ];
        })->toArray();
    }
    public function task(Request $request, int $assignmentId, int $taskId){
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


        $assignment = Assignment::query()
            ->where('id', $assignmentId)
            ->first();

        if(!$assignment){
            return redirect()->back()->with('error', 'Assignment not found');
        }
        $module = $assignment
            ->topics()
            ->first()
            ->module()
            ->first();
        $groupsModules = $group->groupModulesTeachers() // check if the user's group enroll in this module
        ->where('group_id', $group->group_id)
            ->where('school_id', $group->school_id)
            ->where('module_id', $module->id)
            ->first();

        if(!$groupsModules){
            return redirect()->back()->with('error', 'You have no access to this module');
        }

        $assignmentSummary = [
            "id" => $assignment->id,
            "title" => $assignment->title,
            "description" => $assignment->description,
            "due_date" => $assignment->due_date,
            "status" => $assignment->submissions()->where('student_id', $user->id)->first()?->status ?? 'Not started',
            "tasks_count" => $assignment->tasks()->count(),
        ];
        $task = $assignment->tasks()->where('task_id', $taskId)->first();
        if(!$task){
            return redirect()->back()->with('error', 'Task not found');
        }
        $taskSummary = $this->getSpecificTaskSummary($task, $user);
        $taskNavigation = $this->getTaskNavigation($assignment, $user);
        return Inertia::render('student/task', [
            "moduleId" => $module->id,
            "assignment" => $assignmentSummary,
            "task" => $taskSummary,
            "taskNavigation" => $taskNavigation
        ]);
    }
    private function getSpecificTaskSummary(Task $task, User $user): array{
        $answer = $task->answers()->where('student_id', $user->id)->first();
        return [
            'task_id' => $task->task_id,
            'question_text' => $task->question_text,
            'task_type' => $task->task_type,
            'max_points' => $task->max_points,
            'options' => $task->options()->get()->toArray(),
            'answer' => json_decode($answer?->answer_text) ?? null,
        ];
    }
    private function getTaskNavigation(Assignment $assignment, User $user): array{
//        TODO: send isCompleted flag
        $isCompleted = $assignment
                ->submissions()
                ->where('student_id', auth()->id())->first()?->status === 'COMPLETED';
        $tasks = $assignment->tasks()->get();
        return $tasks->map(function ($task) use ($user) {
            return [
                'task_type' => $task->task_type,
                'task_id' => $task->task_id,
                'max_points' => $task->max_points,
                'is_completed' => $task
                        ->answers()
                        ->where('student_id', $user->id)->exists()
            ];
        })->toArray();
    }
    public function assignments(Request $request){
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

        $studentAssignmentSummary = $this->getStudentAssignmentSummary($group, $user);

        return Inertia::render('student/assignments', [
            "assignments" => $studentAssignmentSummary,
        ]);
    }
}
