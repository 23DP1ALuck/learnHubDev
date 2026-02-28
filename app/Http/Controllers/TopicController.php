<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTopicRequest;
use App\Models\Module;
use App\Models\Topic;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

class TopicController extends Controller
{
    public function store(StoreTopicRequest $request)
    {
        $validated = $request->validated();
        $moduleId = (int) $validated['module_id'];

        $maxAttempts = 5;
        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            try {
                return DB::transaction(function () use ($validated, $moduleId) {
                    Module::query()
                        ->where('id', $moduleId)
                        ->lockForUpdate()
                        ->firstOrFail();

                    $nextTopicId = $this->nextTopicId($moduleId);

                    return Topic::create([
                        'topic_id' => $nextTopicId,
                        'module_id' => $moduleId,
                        'name' => $validated['name'],
                        'description' => $validated['description'] ?? null,
                    ]);
                });
            } catch (QueryException $e) {
                if ($attempt < $maxAttempts && $this->isUniqueConstraintViolation($e)) {
                    continue;
                }

                throw $e;
            }
        }

        throw new \RuntimeException('Unable to generate next topic id.');
    }

    private function nextTopicId(int $moduleId): int
    {
        $lastTopicId = Topic::query()
            ->where('module_id', $moduleId)
            ->orderByDesc('topic_id')
            ->lockForUpdate()
            ->value('topic_id');

        return ((int) ($lastTopicId ?? 0)) + 1;
    }

    private function isUniqueConstraintViolation(QueryException $e): bool
    {
        $sqlState = $e->errorInfo[0] ?? null;
        $driverErrorCode = $e->errorInfo[1] ?? null;

        return $sqlState === '23505' || $driverErrorCode === 19 || $driverErrorCode === 1062;
    }
}
