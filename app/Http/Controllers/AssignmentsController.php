<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAssignmentRequest;
use App\Models\Assignment;
use App\Models\Topic;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AssignmentsController extends Controller
{
    public function store(StoreAssignmentRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            $assignment = Assignment::create([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'grading_policy' => $validated['grading_policy'] ?? null,
                'due_date' => $validated['due_date'] ?? null,
            ]);

            $topics = collect($validated['topics'])
                ->map(fn (array $topic) => [
                    'module_id' => (int) $topic['module_id'],
                    'topic_id' => (int) $topic['topic_id'],
                ])
                ->unique(fn (array $topic) => $topic['module_id'].'-'.$topic['topic_id'])
                ->values();

            foreach ($topics as $topicRef) {
                $topic = Topic::query()
                    ->where('module_id', $topicRef['module_id'])
                    ->where('topic_id', $topicRef['topic_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                $topic->assignments()->attach($assignment->id);
            }

            $assignment->load('topics');
        });

        return redirect()->back()->with('success', 'Assignment created.');
    }

    public function assignmentStatusUpdate(Request $request, int $assignmentId, int $studentId): RedirectResponse
    {
        $user = $request->user();
        $assignment = Assignment::query()->where('id', $assignmentId)->first();
        if (! $assignment) {
            return redirect()->back()->with('error', 'Assignment not found');
        }
        $submission = $assignment->submissions()->where('student_id', $studentId)->first();
        if (! $submission) {
            return redirect()->back()->with('error', 'Submission not found');
        }
        $assignment->submissions()->where('student_id', $studentId)->first()->update([
            'status' => 'GRADED',
        ]);
        return redirect()->back()->with('success', 'Assignment status updated.');
    }
}
