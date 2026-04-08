<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckCanManageLearningContent
{

    private function checkIsTeacher($user, $currentOrg) : bool
    {
        return $user->organizations()->where('id', $currentOrg)
            ->wherePivot('role_in_org', 'TEACHER')
            ->exists();
    }
    private function checkIsIndividualOrgAdmin($user, $currentOrg) : bool{
        return $user->ownedOrganizations()->where('id', $currentOrg)->where('organization_type', 'individual')->exists();
    }
    private function canManageLearningContent($user, $currentOrg) : bool{
        return $this->checkIsTeacher($user, $currentOrg) || $this->checkIsIndividualOrgAdmin($user, $currentOrg);
    }
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $currentOrg = $request->session()->get('activeOrganization', '');
        if (!$user){
            return redirect()->route('login');
        }
        if (! $this->canManageLearningContent($user, $currentOrg)) {
            return redirect()->route('dashboard');
        }
        return $next($request);
    }
}
