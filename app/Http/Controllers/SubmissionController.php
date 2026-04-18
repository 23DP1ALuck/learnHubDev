<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubmissionRequest;
use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    public function store(Request $request, int $assignmentId){
        $user = $request->user();
        if (!$user){
            return redirect()->route('login');
        }
        $assignment = Assignment::query()->where('id', $assignmentId)->first();

        if(!$assignment){
            return redirect()->back()->with('error', 'Assignment not found');
        }
        $firstTaskId = $assignment->tasks()->orderBy('task_id')->value('task_id');
        $submission = Submission::query()
            ->where('student_id', $user->id)
            ->where('assignment_id', $assignmentId)
            ->exists();
        if($submission){
            return redirect()->route('student.tasks.show',
                ['assignment' => $assignment->id,
                    'task' => $firstTaskId,]
            )->with('success', 'You have started the assignment');
        }

        $submission = Submission::create([
            'student_id' => $user->id,
            'assignment_id' => $assignmentId,
            'status' => "DRAFT",
        ]);

        return redirect()->route('student.tasks.show',
            ['assignment' => $assignment->id,
            'task' => $firstTaskId,]
        )->with('success', 'You have started the assignment');
    }
}
