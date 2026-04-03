<?php

namespace App\Http\Requests\Concerns;

use App\Models\User;

trait AuthorizesLearningContent
{
    protected function canManageLearningContent(): bool
    {
        $user = $this->user();

        if (! $user instanceof User) {
            return false;
        }
        $currentOrg = session()->get('activeOrganization', '');
        if(!$currentOrg){
            return false;
        }
        if ($user->ownedOrganizations()->where('id', $currentOrg)->exists()) {
            return true;
        }

        return $user->organizations()
            ->wherePivot('role_in_org', 'TEACHER')
            ->exists();
    }
}
