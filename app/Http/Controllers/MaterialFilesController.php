<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMaterialFileRequest;
use App\Models\Material;
use App\Models\MaterialFile;
use App\Models\StoredFile;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class MaterialFilesController extends Controller
{
    public function store(StoreMaterialFileRequest $request): RedirectResponse
    {
        // TODO: check if context is for current user
        $validated = $request->validated();
        $file = $request->file('file');
        $moduleId = (int) $validated['module_id'];
        $topicId = (int) $validated['topic_id'];
        $materialId = (int) $validated['material_id'];
        $fileExtension = $file->getClientOriginalExtension();

        $storedPath = $file->store("materials/{$moduleId}/{$topicId}/{$materialId}");
        $displayName = trim((string) ($validated['file_name'] ?? '')) ?: $file->getClientOriginalName();

        try {
            DB::transaction(function () use ($moduleId, $topicId, $materialId, $storedPath, $displayName, $fileExtension) {
                Material::query()
                    ->where('module_id', $moduleId)
                    ->where('topic_id', $topicId)
                    ->where('material_id', $materialId)
                    ->lockForUpdate()
                    ->firstOrFail();

                $storedFile = StoredFile::create([
                    'file_name' => $displayName . '.' . $fileExtension,
                    'file_path' => $storedPath,
                ]);

                MaterialFile::create([
                    'module_id' => $moduleId,
                    'topic_id' => $topicId,
                    'material_id' => $materialId,
                    'file_id' => $storedFile->id,
                ]);
            });
        } catch (Throwable $e) {
            Storage::delete($storedPath);

            throw $e;
        }

        return redirect()->back()->with('success', 'File uploaded.');
    }
    public function download(Request $request, int $module, int $topic, int $material, int $file) {
        $moduleId = $module;
        $topicId = $topic;
        $materialId = $material;
        $fileId = $file;

        $file = MaterialFile::query()->where('module_id', $moduleId)
            ->where('topic_id', $topicId)
            ->where('material_id', $materialId)
            ->where('file_id', $fileId)
            ->firstOrFail();

        $storedFile = $file->file()->first();
        return Storage::download(
            $storedFile->file_path,
            $storedFile->file_name
        );
        // query here
    }
}
