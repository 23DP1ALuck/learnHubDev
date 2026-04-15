<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Models\Assignment;
use App\Models\Task;
use App\Models\TaskCorrectAnswer;
use App\Models\TaskOption;
use Helper;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class TasksController extends Controller
{
    public function store(StoreTaskRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $assignmentId = (int) $validated['assignment_id'];

        $maxAttempts = 5;

        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            try {
                DB::transaction(function () use ($validated, $assignmentId) {
                    Assignment::query()
                        ->whereKey($assignmentId)
                        ->lockForUpdate()
                        ->firstOrFail();

                    $taskId = $this->nextTaskId($assignmentId);

                    $task = Task::create([
                        'assignment_id' => $assignmentId,
                        'task_id' => $taskId,
                        'question_text' => $validated['question_text'],
                        'task_type' => $validated['task_type'],
                        'max_points' => $validated['max_points'],
                    ]);

                    foreach ($this->normalizedAnswers($validated['correct_answers'] ?? []) as $index => $answer) {
                        TaskCorrectAnswer::create([
                            'assignment_id' => $assignmentId,
                            'task_id' => $taskId,
                            'answer_id' => $index + 1,
                            'answer' => $answer,
                        ]);
                    }
                    foreach ($this->normalizedOptions($validated['options'] ?? []) as $index => $option){
                        TaskOption::create([
                            'assignment_id' => $assignmentId,
                            'task_id' => $taskId,
                            'option_id' => $index + 1,
                            'option_text' => $option,
                        ]);
                    }
                });

                return redirect()->back()->with('success', 'Task created.');
            } catch (QueryException $e) {
                if ($attempt < $maxAttempts && Helper::isUniqueConstraintViolation($e)) {
                    continue;
                }

                throw $e;
            }
        }

        throw new RuntimeException('Unable to generate next task id.');
    }

    private function nextTaskId(int $assignmentId): int
    {
        $lastTaskId = Task::query()
            ->where('assignment_id', $assignmentId)
            ->orderByDesc('task_id')
            ->lockForUpdate()
            ->value('task_id');

        return ((int) ($lastTaskId ?? 0)) + 1;
    }

    /**
     * @param  array<int, string>  $answers
     * @return array<int, string>
     */
    private function normalizedAnswers(array $answers): array
    {
        return array_values(array_filter(
            array_map(static fn (mixed $answer) => trim((string) $answer), $answers), // parse to string and trim
            static fn (string $answer) => $answer !== '', // remove empty strings
        ));
    }
    private function normalizedOptions(array $options): array{
        return array_values(array_filter(
            array_map(fn (mixed $option) => trim((string) $option), $options),
            fn (string $option) => $option !== '',
        ));
    }
}
