<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreModuleRequest;
use App\Models\Module;
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
}
