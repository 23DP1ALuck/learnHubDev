<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    /** @use HasFactory<\Database\Factories\OrganizationFactory> */
    use HasFactory;
    protected $fillable = [
        'id',
        'organization_type',
        'organization_name',
    ];

    protected function casts(): array
    {
        return [
            'organization_type' => 'string',
            'organization_name' => 'string',
        ];
    }
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'users_organizations')
            ->withPivot(['joined_on', 'role_in_org', 'admin_privileges', 'group_id']);
    }
    public function schoolGroups(): HasMany
    {
        return $this->hasMany(SchoolGroup::class, 'school_id');
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(AccountInvites::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'users_organizations')
            ->withPivot(['joined_on', 'role_in_org', 'admin_privileges', 'group_id'])
            ->wherePivot('role_in_org', 'STUDENT');
    }
    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'users_organizations')
            ->withPivot(['joined_on', 'role_in_org', 'admin_privileges', 'group_id'])
            ->wherePivot('role_in_org', 'TEACHER');
    }
    public function modules(): HasMany
    {
        return $this->hasMany(Module::class);
    }

    public function chats(): HasMany
    {
        return $this->hasMany(Chat::class, 'organization_id');
    }
}
