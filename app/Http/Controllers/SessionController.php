<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    public function setActiveOrganization(Request $request){
        $org = $request->input('currentOrganization');

        $organization = Organization::query()
            ->where('id', $org)
            ->first();

        if(!$organization){
            return redirect()->route('dashboard')
                ->with('error', "No organization found");
        }

        $belongs = $request->user()
            ->organizations()
            ->where('organizations.id', $organization->id)
            ->exists();

        if(!$belongs){
            return redirect()->route('dashboard')
                ->with('error', "You don't belong to this organization");
        }

        session()->put('activeOrganization', $organization);

        return redirect()->route('dashboard')->with('success', 'Organization set successfully.');
    }
}
