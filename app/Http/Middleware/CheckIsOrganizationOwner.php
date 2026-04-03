<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CheckIsOrganizationOwner
{
    private function checkIsOrganizationOwner($user, $currentOrg) : bool
    {
        return $user->ownedOrganizations()->where('id', $currentOrg)->exists();
    }
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $currentOrg = session()->get('activeOrganization', '');
        if (! $user || ! $this->checkIsOrganizationOwner($user, $currentOrg)) {
            return redirect()->back();
        }

        return $next($request);
    }

}
