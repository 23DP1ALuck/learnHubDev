<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSchoolGroupRequest;
use App\Models\Organization;
use App\Models\SchoolGroup;
use App\Http\Controllers\Helper;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class SchoolGroupController extends Controller
{
    public function store(StoreSchoolGroupRequest $request): RedirectResponse
    {
        $validated = $request->validated();
//        $schoolId = (int) $validated['school_id'];

        $schoolId = $request->session()->get('activeOrganization', '');

        $maxAttempts = 5;
        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            try {
                DB::transaction(function () use ($validated, $schoolId) {
                    Organization::query()
                        ->where('id', $schoolId)
                        ->lockForUpdate()
                        ->firstOrFail();

                    $groupId = $this->nextGroupId($schoolId);

                    SchoolGroup::create([
                        'school_id' => $schoolId,
                        'group_id' => $groupId,
                        'name' => $validated['name'],
                    ]);
                });

                return to_route('groups')->with('success', 'Group created successfully.');
            } catch (QueryException $e) {
                if ($attempt < $maxAttempts && Helper::isUniqueConstraintViolation($e)) {
                    continue;
                }
                throw $e;
            }
        }

        throw new RuntimeException('Unable to generate next topic id.');
    }

    private function nextGroupId(int $schoolId): int
    {
        $lastGroupId = SchoolGroup::query()
            ->where('school_id', $schoolId)
            ->orderByDesc('group_id')
            ->value('group_id');

        return ((int) ($lastGroupId ?? 0)) + 1;
    }
}
