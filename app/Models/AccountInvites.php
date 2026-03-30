<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccountInvites extends Model
{
    /** @use HasFactory<\Database\Factories\AccountInvitesFactory> */
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'selector',
        'verifier_hash',
        'invitation_type',
        'onboarding_request_id',
        'organization_id',
        'email',
        'first_name',
        'last_name',
        'role_in_org',
        'expires_at',
        'invited_by',
        'used_at',
    ];

    /**
     * The model's default values for attributes.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'selector',
        'verifier_hash',
        'onboarding_request_id',
        'organization_id',
        'used_at',
        'created_at',
        'updated_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'selector' => 'string',
            'verifier_hash' => 'string',
            'invitation_type' => 'string',
            'invited_by' => 'integer',
            'onboarding_request_id' => 'integer',
            'organization_id' => 'integer',
            'email' => 'string',
            'first_name' => 'string',
            'last_name' => 'string',
            'role_in_org' => 'string',
            'expires_at' => 'datetime',
            'used_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
    public function onboardingRequest(): BelongsTo
    {
        return $this->belongsTo(OnboardingRequest::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function inviter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }
}
