<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Organization extends Model
{
    /** @use HasFactory<\Database\Factories\OrganizationFactory> */
    use HasFactory;
    protected $fillable = [
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
            ->withPivot(['joined_on', 'role_in_org', 'admin_privileges']);
    }
}
