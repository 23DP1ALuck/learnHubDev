<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreModuleRequest;
use App\Models\GroupModuleTeacher;
use App\Models\Module;
use App\Models\Organization;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class ModulesController extends Controller
{
//    public function index(Request $request){
//        $modules = Module::query()
//            ->where('')
//    }
    public function store(StoreModuleRequest $request): RedirectResponse
    {
        $user = $request->user();
        if(!$user){
            return redirect()->route('login');
        }
        $organizationId = $request->session()->get('activeOrganization');
        if(!$organizationId){
            return redirect()->route('dashboard')->with('afterLogin', true);
        }
        $organization = Organization::query()->where('id', $organizationId)->first();
        if(!$organization){
            return redirect()->route('dashboard')->with('afterLogin', true);
        }
        $validated = $request->validated();
        try{
            DB::transaction(function () use ($organization, $user, $validated){
                $module = Module::create([
                        ...$validated,
                        'creator_id' => $user->id,
                        'organization_id' => $organization->id]
                );
                if($organization->organization_type === 'individual'){
                    GroupModuleTeacher::create([
                        'school_id' => $organization->id,
                        'group_id' => $organization->schoolGroups()->first()->group_id,
                        'module_id' => $module->id,
                        'teacher_id' => $user->id,
                    ]);
                };
            });
        } catch (Exception $e){
            return redirect()->back()->with('error', 'Failed to create module');
        }





        return redirect()->back()->with('success', 'Module created.');
    }
    public function update(StoreModuleRequest $request, int $moduleId): RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        $organizationId = $request->session()->get('activeOrganization');

        if (! $organizationId) {
            return redirect()->route('dashboard')->with('afterLogin', true);
        }

        $module = Module::query()->where('id', $moduleId)->first();

        if (! $module) {
            return redirect()->route('teacher.modules')->with('error', 'Module not found.');
        }

        if ($module->organization_id !== (int) $organizationId || $module->creator_id !== $user->id) {
            return redirect()->route('teacher.modules')->with('error', 'You do not have permission to edit this module.');
        }

        $module->update($request->validated());

        return redirect()->route('teacher.modules.edit', $module->id)->with('success', 'Module updated.');
    }
    public function destroy(Request $request, int $moduleId){
        $user = $request->user();
        if(!$user){
            return redirect()->route('login');
        }
        $organizationId = $request->session()->get('activeOrganization');
        if(!$organizationId){
            return redirect()->route('dashboard')->with('afterLogin', true);
        }
        $organization = Organization::query()->where('id', $organizationId)->first();
        $module = Module::query()->where('id', $moduleId)->first();
        if(!$module){
            return redirect()->back()->with('error', 'Module not found');
        }
        if($module->organization()->first()->id !== $organization->id // part of current organization
            || $module->creator()->first()->id !== $user->id){ // creator or no
            return redirect()->route('dashboard')->with('error', 'You do not have permission to delete this module.');
        }
        $module->delete();
        return redirect()->route('teacher.modules')->with('success', 'Module deleted.');
    }
}
