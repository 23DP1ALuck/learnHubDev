<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskAnswerRequest;
use App\Models\AnswerFile;
use App\Models\Assignment;
use App\Models\StoredFile;
use App\Models\Submission;
use App\Models\Task;
use App\Models\TaskAnswer;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Throwable;

class TaskAnswersController extends Controller
{
    public function store(StoreTaskAnswerRequest $request, int $assignmentId, int $taskId)
    {
        $user = $request->user();
        $validated = $request->validated();
        if (! $user) {
            return redirect()->route('login');
        }
        $organizationId = $request->session()->get('activeOrganization');
        $organization = $user->organizations()->where('organizations.id', $organizationId)->first();
        if (! $organization) {
            return redirect()->route('dashboard');
        }
        $groupId = $organization->pivot->group_id;
        $assignment = Assignment::query()->where('id', $assignmentId)->first();
        if (! $assignment) {
            return redirect()->back()->with('error', 'Assignment not found');
        }

        $module = $assignment->topics()->first()->module()->first();
        $enrolled = $module
            ->groupModuleTeachers()
            ->where('group_id', $groupId)
            ->exists();

        if (! $enrolled) {
            return redirect()->back()->with('error', 'You are not enrolled in this module');
        }

        $task = $assignment->tasks()
            ->where('task_id', $taskId)
            ->first();

        if (! $task) {
            return redirect()->back()->with('error', 'Task not found');
        }
        $alreadyAnswered = TaskAnswer::query()
            ->where('student_id', $user->id)
            ->where('assignment_id', $assignmentId)
            ->where('task_id', $taskId)
            ->exists();
        if ($alreadyAnswered) {
            return redirect()->route('student.tasks.show', [
                'assignment' => $assignmentId,
                'task' => $taskId,
            ])->with('error', 'You have already answered this task');
        }
        if ($task->correctAnswers()->exists()) {
            $result = 0; // initial value for calculating the score
            $maxPoints = $task->max_points;

            if ($task->task_type == 'CHECKBOX') {

                $taskCorrectAnswer = $task->correctAnswers()->get();
                $correctAnswersLength = $taskCorrectAnswer->count();
                $step = $maxPoints / $correctAnswersLength; // calculate the step for 1 correct answer

                foreach ($taskCorrectAnswer as $correctAnswer) {
                    // add the step to the result if the answer is correct
                    if (in_array($correctAnswer->answer, $validated['answer_text'])) {
                        $result += $step;
                    }
                }
            } else {
                $taskCorrectAnswer = $task->correctAnswers()->first();
                $result = $taskCorrectAnswer->answer == $validated['answer_text'][0] ? $maxPoints : 0; // max points for correct answer
            }
        }

        if ($task->task_type == 'FILE') {
            $this->storeTaskAnswerFile($request, $user, $task, $assignment);
        } else {
            TaskAnswer::create([
                'student_id' => $user->id,
                'assignment_id' => $assignmentId,
                'task_id' => $taskId,
                'answer_text' => json_encode($validated['answer_text']),
                'points' => round($result ?? 0, 2),
            ]);
        }

        $completedTasks = TaskAnswer::query()
            ->where('assignment_id', $assignmentId)
            ->where('student_id', $user->id)
            ->pluck('task_id');

        $nextTaskId = $assignment // take the smallest task_id from incompleted tasks
            ->tasks()
            ->whereNotIn('task_id', $completedTasks)
            ->orderBy('task_id')
            ->value('task_id');

        if (! $nextTaskId) {
            $submission = $assignment
                ->submissions()
                ->where('student_id', $user->id)
                ->where('status', 'DRAFT')
                ->first();
            $totalPoints = $submission?->taskAnswers()->sum('points');
            $totalPercent = $totalPoints / $assignment->totalPoints() * 100;
            Submission::query()
                ->where('student_id', $user->id)
                ->where('assignment_id', $assignmentId)
                ->update([
                    'status' => 'SUBMITTED',
                    'total_points' => $totalPoints,
                    'total_percent' => round($totalPercent, 2),
                    'submitted_on' => now(),
                ]);

            return redirect()->route('student.assignments.show', $assignmentId)
                ->with('success', 'You have completed the assignment');

        }

        return redirect()->route('student.tasks.show',
            ['assignment' => $assignmentId, 'task' => $nextTaskId]
        )
            ->with('success', 'Answer submitted successfully');
    }

    private function storeTaskAnswerFile(StoreTaskAnswerRequest $request, User $user, Task $task, Assignment $assignment): void
    {

        $validated = $request->validated();

        $currentSubmission = $assignment->submissions()->where('student_id', $user->id)->first();
        if (! $currentSubmission) {
            throw ValidationException::withMessages([
                'file' => 'You have not started this assignment yet.',
            ]);
        }

        $file = $request->file('file');
        if (! $file) {
            throw ValidationException::withMessages([
                'file' => 'File is required for this task.',
            ]);
        }

        $displayName = trim($validated['file_name'] ?? '') ?: $file->getClientOriginalName();
        $fileExtension = $file->getClientOriginalExtension();
        $storedFileName = $fileExtension !== '' ? "{$displayName}.{$fileExtension}" : $displayName;

        $taskId = $task->task_id;
        $assignmentId = $assignment->id;
        $storedPath = $file->store("task_answers/{$taskId}/{$assignmentId}/{$currentSubmission->id}");
        try {
            DB::transaction(function () use (
                $storedFileName,
                $currentSubmission,
                $taskId,
                $assignmentId,
                $storedPath,
                $user) {

                Task::query()
                    ->where('task_id', $taskId)
                    ->where('assignment_id', $assignmentId)
                    ->lockForUpdate()->firstOrFail();
                $taskAnswer = $currentSubmission
                    ->taskAnswers()
                    ->where('task_id', $taskId)
                    ->where('student_id', $user->id)
                    ->first();
                if (! $taskAnswer) {
                    $taskAnswer = TaskAnswer::create([
                        'student_id' => $user->id,
                        'assignment_id' => $assignmentId,
                        'task_id' => $taskId,
                        'answer_text' => json_encode('file'),
                        'time_spent' => null,
                        'points' => 0,
                        'teacher_comment' => null,
                    ]);
                }
                $storedFile = StoredFile::create([
                    'file_name' => $storedFileName,
                    'file_path' => $storedPath,
                ]);
                AnswerFile::create([
                    'student_id' => $taskAnswer->student_id,
                    'assignment_id' => $taskAnswer->assignment_id,
                    'task_id' => $taskAnswer->task_id,
                    'file_id' => $storedFile->id,
                ]);
            });
        } catch (Throwable $e) {
            Storage::delete($storedPath);
            throw $e;
        }
    }
}
