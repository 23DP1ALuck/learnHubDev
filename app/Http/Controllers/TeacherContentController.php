<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Material;
use App\Models\Module;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TeacherContentController extends Controller
{
    public function modules(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        $organizationId = $request->session()->get('activeOrganization');

        if (! $organizationId) {
            return redirect()->route('dashboard')->with('afterLogin', true);
        }

        $modules = Module::query()
            ->where('creator_id', $user->id)
            ->where('organization_id', $organizationId)
            ->withCount('topics')
            ->latest()
            ->get();
        $stats = $this->getStats($user, $organizationId);
        return Inertia::render('teacher/modules', [
            'stats' => $stats,
            'modules' => $modules,
        ]);
    }

    public function getStats(User $user, int $organizationId): array
    {
        $modulesCount = Module::query()
            ->where('creator_id', $user->id)
            ->where('organization_id', $organizationId)
            ->count();

        $topics = Topic::query()
            ->join('modules', 'modules.id', '=', 'topics.module_id')
            ->where('modules.creator_id', $user->id)
            ->where('modules.organization_id', $organizationId)
            ->count();

        $materials = Material::query()
            ->join('topics', function ($join) {
                $join->on('materials.topic_id', '=', 'topics.topic_id')
                    ->on('materials.module_id', '=', 'topics.module_id');
            })
            ->join('modules', 'modules.id', '=', 'topics.module_id')
            ->where('modules.creator_id', $user->id)
            ->where('modules.organization_id', $organizationId)
            ->count();

        $assignments = DB::table('topic_assignments')
            ->join('modules', 'modules.id', '=', 'topic_assignments.module_id')
            ->where('modules.creator_id', $user->id)
            ->where('modules.organization_id', $organizationId)
            ->distinct()
            ->count('topic_assignments.assignment_id');

        $tasks = DB::table('tasks')
            ->whereIn('assignment_id', function ($query) use ($user, $organizationId) {
                $query
                    ->select('topic_assignments.assignment_id')
                    ->from('topic_assignments')
                    ->join('modules', 'modules.id', '=', 'topic_assignments.module_id')
                    ->where('modules.creator_id', $user->id)
                    ->where('modules.organization_id', $organizationId)
                    ->distinct();
            })
            ->count();

        return [
            'modules' => $modulesCount,
            'topics' => $topics,
            'materials' => $materials,
            'assignments' => $assignments,
            'tasks' => $tasks,
        ];
    }

    public function module(Request $request, Module $module): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }
        $data = $this->getModulePageInfo($request, $module);
        return Inertia::render('teacher/module', [
            'module' => $data['moduleSummary'],
            'stats' => $data['moduleStats'],
            'topics' => $data['topicSummary'],
        ]);

    }

    private function getModulePageInfo(Request $request, Module $module): array
    {
        $topics = Topic::query()
            ->where('module_id', $module->id)
            ->withCount('materials')
            ->get();

        $assignmentCounts = DB::table('topic_assignments')
            ->where('module_id', $module->id)
            ->select('topic_id', DB::raw('count(*) as assignments_count'))
            ->groupBy('topic_id')
            ->pluck('assignments_count', 'topic_id');

        $topicSummary = $topics->map(function (Topic $topic) use ($assignmentCounts) {
            $assignmentsCount = $assignmentCounts->get($topic->topic_id, 0);

            return [
                'topic_id' => $topic->topic_id,
                'module_id' => $topic->module_id,
                'name' => $topic->name,
                'description' => $topic->description,
                'materials_count' => $topic->materials_count,
                'assignments_count' => (int) $assignmentsCount,
                'created_at' => $topic->created_at,
            ];
        });

        $moduleStats = [
            'topics' => $topics->count(),
            'materials' => $topics->sum('materials_count'),
            'topic_assignments' => (int) $assignmentCounts->sum(),
        ];
        return [
            'moduleSummary' => $module,
            'moduleStats' => $moduleStats,
            'topicSummary' => $topicSummary,
        ];
    }
    private function getTopicPageInfo(Request $request, Topic $topic): array{
        $assignments = Assignment::query()->whereIn('id', DB::table('topic_assignments')
            ->where('module_id', $topic->module_id)
            ->where('topic_id', $topic->topic_id)
            ->pluck('assignment_id')->toArray()
        )->withCount('tasks')->get();

        $assignmentsSummary = $assignments->map(function (Assignment $assignment){
            return [
                'id' => $assignment->id,
                'title' =>$assignment->title,
                'description' => $assignment->description,
                'grading_policy' => $assignment->grading_policy,
                'due_date' => $assignment->due_date,
                'tasks_count' => $assignment->tasks_count,
            ];
        });
        $materials = Material::query()->where('module_id', $topic->module_id)
            ->where('topic_id', $topic->topic_id)
            ->get();
        return [
            'assignmentsSummary' => $assignmentsSummary,
            'materials' => $materials,
        ];
    }
    public function topic(Request $request, Module $module, Topic $topic): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        $moduleSummary = [
            'id' => $module->id,
            'name' => $module->name,
            'description' => $module->description
        ];
        $data = $this->getTopicPageInfo($request, $topic);
        return Inertia::render('teacher/topic', [
            'module' => $moduleSummary,
            'topic' => $topic,
            'materials' => $data['materials'],
            'assignments' => $data['assignmentsSummary'],
        ]);
    }
    private function getMaterialPageInfo(Material $material): array{
        $files = $material->fileLinks()->with('file')->get();

        return [
            'files' => $files,
        ];
    }
    public function material(Request $request, Module $module, Topic $topic, Material $material): Response|RedirectResponse{
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }
        $moduleSummary = [
            'id' => $module->id,
            'name' => $module->name,
            'description' => $module->description
        ];
        $topicSummary = [
            "topic_id"=>$topic->topic_id,
            "module_id"=>$topic->module_id,
            "name"=>$topic->name,
            "description"=>$topic->description,
            "created_at"=>$topic->created_at,
        ];

        $data = $this->getMaterialPageInfo($material);
        return Inertia::render('teacher/material', [
            'module' => $moduleSummary,
            'topic' => $topicSummary,
            'material' => $material,
            'files' => $data['files'],
        ]);
    }
}
