<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTopicRequest;
use App\Models\Module;
use App\Models\Topic;
use Helper;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class TopicController extends Controller
{
    public function store(StoreTopicRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $moduleId = (int) $validated['module_id'];

        $maxAttempts = 5;
        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            try {
                DB::transaction(function () use ($validated, $moduleId) {
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

                return redirect()->back()->with('success', 'Topic created.');
            } catch (QueryException $e) {
                if ($attempt < $maxAttempts && Helper::isUniqueConstraintViolation($e)) {
                    continue;
                }

                throw $e;
            }
        }

        throw new RuntimeException('Unable to generate next topic id.');
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
    public function update(StoreTopicRequest $request, int $moduleId, int $topicId): RedirectResponse
    {
        $user = $request->user();
        if (! $user) {
            return redirect()->route('login');
        }

        $organizationId = $request->session()->get('activeOrganization');
        $validated = $request->validated();

        $module = Module::query()
            ->where('id', $moduleId)
            ->where('creator_id', $user->id)
            ->where('organization_id', $organizationId)
            ->first();
        if (! $module) {
            return redirect()->route('teacher.modules')->with('error', 'You do not have permission to edit this topic.');
        }

        $topic = Topic::query()
            ->where('topic_id', $topicId)
            ->where('module_id', $moduleId)
            ->first();
        if (! $topic) {
            return redirect()->route('teacher.modules.show', $moduleId)->with('error', 'Topic not found.');
        }

        $topic->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);
        Topic::query() // need to query again because of composite key
            ->where('topic_id', $topicId)
            ->where('module_id', $moduleId)
            ->first()
            ->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            ]);;

        return redirect()->route('teacher.topics.edit', [$moduleId, $topicId])->with('success', 'Topic updated.');
    }
    public function destroy(Request $request, int $moduleId, int $topicId): RedirectResponse
    {
        $user = $request->user();
        if(!$user){
            return redirect()->route('login');
        }
        $organizationId = $request->session()->get('activeOrganization');
        $organization = $user->organizations()->where('organizations.id', $organizationId)->first();
        if(!$organization){
            return redirect()->route('dashboard')->with('afterLogin', true);
        }
        $module = Module::query()
            ->where('id', $moduleId)
            ->where('creator_id', $user->id)
            ->where('organization_id', $organization->id)
            ->first();
        if(!$module){
            return redirect()->route('dashboard')->with('error', 'You do not have permission to delete this topic.');
        }
        $topic = Topic::query()
            ->where('topic_id', $topicId)
            ->where('module_id', $moduleId)
            ->first();
        if(!$topic){
            return redirect()->route('dashboard')->with('error', 'Topic not found.');
        }
        Topic::query() // need to query again because of composite key
            ->where('topic_id', $topicId)
            ->where('module_id', $moduleId)
            ->first()
            ->delete();
        return redirect()->route('teacher.modules.show', $moduleId)->with('success', 'Topic deleted.');
    }
}
