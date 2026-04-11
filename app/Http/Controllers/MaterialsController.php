<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMaterialRequest;
use App\Models\Material;
use App\Models\Topic;
use Helper;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class MaterialsController extends Controller
{
    public function store(StoreMaterialRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $moduleId = (int) $validated['module_id'];
        $topicId = (int) $validated['topic_id'];

        $maxAttempts = 5;

        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            try {
                DB::transaction(function () use ($validated, $moduleId, $topicId) {
                    Topic::query()
                        ->where('module_id', $moduleId)
                        ->where('topic_id', $topicId)
                        ->lockForUpdate()
                        ->firstOrFail();

                    return Material::create([
                        'module_id' => $moduleId,
                        'topic_id' => $topicId,
                        'material_id' => $this->nextMaterialId($moduleId, $topicId),
                        'title' => $validated['title'],
                        'description' => $validated['description'] ?? null,
                    ]);
                });

                return redirect()->back()->with('success', 'Material created.');
            } catch (QueryException $e) {
                if ($attempt < $maxAttempts && Helper::isUniqueConstraintViolation($e)) {
                    continue;
                }

                throw $e;
            }
        }

        throw new RuntimeException('Unable to generate next material id.');
    }

    private function nextMaterialId(int $moduleId, int $topicId): int
    {
        $lastMaterialId = Material::query()
            ->where('module_id', $moduleId)
            ->where('topic_id', $topicId)
            ->orderByDesc('material_id')
            ->lockForUpdate()
            ->value('material_id');

        return ((int) ($lastMaterialId ?? 0)) + 1;
    }
}
