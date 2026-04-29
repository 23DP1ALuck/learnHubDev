<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskAnswerFilesRequest;
use App\Models\AnswerFile;
use App\Models\StoredFile;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class TaskAnswerFilesController extends Controller
{
    public function store(StoreTaskAnswerFilesRequest $request, int $assignmentId, int $taskId){
        $user = $request->user();

        $assignment = $user->assignments()->where('id', $assignmentId)->first();
        if(!$assignment){
            return redirect()->back()->with('error', 'Assignment not found');
        }
        $task = $assignment
            ->tasks()
            ->where('task_id', $taskId)
            ->where('assignment_id', $assignment->id)
            ->first();
        if(!$task){
            return redirect()->back()->with('error', 'Task not found');
        }
        $validated = $request->validated();

        $currentSubmission = $task->submissions()->where('student_id', $user->id)->first();
        if(!$currentSubmission){
            return redirect()->back()->with('error', 'You have not submitted this task yet');
        }

        $file = $validated->file('file');
        $displayName = trim($validated['file_name'] ?? '') ?: $file->getClientOriginalName();
        $fileExtension = $file->getClientOriginalExtension();

        $storedPath = $file->store("task_answers/{$assignmentId}/{$taskId}/{$currentSubmission->id}");
        try{
            DB::transaction(function () use ($file,
                $displayName,
                $fileExtension,
                $currentSubmission,
                $taskId,
                $assignmentId,
                $storedPath,
                $user){
               Task::query()
                   ->where('task_id', $taskId)
                   ->where('assignment_id', $assignmentId)
                   ->lockForUpdate();
               $storedFile = StoredFile::create([
                   'file_name' => $displayName . '.' . $fileExtension,
                   'file_path' => $storedPath,
               ]);
               AnswerFile::create([
                   'user_id' => $user->id,
                   'assignment_id' => $assignmentId,
                   'task_id' => $taskId,
                   'file_id' => $storedFile->id,
               ]);
            });
        } catch ( Throwable $e) {
            Storage::delete($storedPath);
        }
    }
}
