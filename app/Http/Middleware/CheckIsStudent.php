<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckIsStudent
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $organizationId = (int) $request->session()->get('activeOrganization', 0);

        if (! $user || $organizationId <= 0) {
            return redirect()->route('dashboard');
        }

        $isStudentInActiveOrganization = $user->organizations()
            ->where('organizations.id', $organizationId)
            ->wherePivot('role_in_org', 'STUDENT')
            ->exists();

        if (! $isStudentInActiveOrganization) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
