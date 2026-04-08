<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\Module;
use App\Models\TopicAssignment;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherContentController extends Controller
{
//    id: number;
//    name: string;
//    description: string | null;
//    start_date: string | null;
//    end_date: string | null;
//    topics_count: number;
//    created_at: string | null;

//    type ContentStats = {
//    modules: number;
//    topics: number;
//    materials: number;
//    assignments: number;
//    tasks: number;
//    };
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
    public function getStats(User $user, int $organizationId)
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

        $assignments = TopicAssignment::query()
            ->join('modules', 'modules.id', '=', 'topic_assignments.module_id')
            ->where('modules.creator_id', $user->id)
            ->where('modules.organization_id', $organizationId)
            ->count();

        $tasks = TopicAssignment::query()
            ->join('tasks', 'tasks.assignment_id', '=', 'topic_assignments.assignment_id')
            ->join('modules', 'modules.id', '=', 'topic_assignments.module_id')
            ->where('modules.creator_id', $user->id)
            ->where('modules.organization_id', $organizationId)
            ->count();

        return [
            'modules' => $modulesCount,
            'topics' => $topics,
            'materials' => $materials,
            'assignments' => $assignments,
            'tasks' => $tasks,
        ];
    }
}
