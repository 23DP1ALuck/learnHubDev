<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Chat extends Model
{
    protected $primaryKey = 'chat_id';

    protected $fillable = [
        'chat_id',
        'name',
        'type',
        'organization_id',
        'module_id',
    ];

    protected function casts(): array
    {
        return [
            'chat_id' => 'integer',
            'organization_id' => 'integer',
            'module_id' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class, 'module_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'chat_users', 'chat_id', 'user_id')
            ->withPivot(['role', 'last_read_at']);
    }

    public function memberships(): HasMany
    {
        return $this->hasMany(ChatUser::class, 'chat_id', 'chat_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class, 'chat_id', 'chat_id');
    }

    public function latestMessage(): HasOne
    {
        return $this->hasOne(ChatMessage::class, 'chat_id', 'chat_id')->latestOfMany('sent_at');
    }
}
