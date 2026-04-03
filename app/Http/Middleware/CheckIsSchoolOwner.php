<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CheckIsSchoolOwner
{
    private function checkIsSchoolOwner($user, $currentOrg) : bool
    {
        return $user->ownedOrganizations()->where('id', $currentOrg)->where('organization_type', 'school')->exists();
    }
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $currentOrg = session()->get('activeOrganization', '');
        if (! $user || ! $this->checkIsSchoolOwner($user, $currentOrg)) {
            return redirect()->back();
        }

        return $next($request);
    }
}
