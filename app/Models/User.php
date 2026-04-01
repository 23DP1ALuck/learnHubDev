<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
        'status'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
    public function invites(): HasMany
    {
        return $this->hasMany(AccountInvites::class, 'invited_by');
    }
    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organization::class, 'users_organizations')
            ->withPivot(['joined_on', 'role_in_org', 'admin_privileges', 'group_id']);
    }

    public function ownedOrganizations(): BelongsToMany
    {
        return $this->belongsToMany(Organization::class, 'users_organizations')
            ->withPivot(['joined_on', 'role_in_org', 'admin_privileges', 'group_id'])
            ->wherePivot('role_in_org', 'ORGANIZATION_OWNER');
    }

    public function currentOrganization(): ?Organization
    {
        return $this->organizations()->first();
    }

    public function currentOwnedOrganization(): ?Organization
    {
        return $this->ownedOrganizations()->first();
    }

    public function teacher(): HasOne
    {
        return $this->hasOne(Teacher::class);
    }

    public function student(): HasOne
    {
        return $this->hasOne(Student::class, 'user_id');
    }
}
