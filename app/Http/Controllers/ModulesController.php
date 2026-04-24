<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreModuleRequest;
use App\Models\Module;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class ModulesController extends Controller
{
//    public function index(Request $request){
//        $modules = Module::query()
//            ->where('')
//    }
    public function store(StoreModuleRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Module::create([
            ...$validated,
            'creator_id' => $request->user()->id,
            'organization_id' => $request->session()->get('activeOrganization', '')]
        );

        return redirect()->back()->with('success', 'Module created.');
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
