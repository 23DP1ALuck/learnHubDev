<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatUser extends Model
{
    protected $table = 'chat_users';

    public $timestamps = false;

    public $incrementing = false;

    protected $fillable = [
        'chat_id',
        'user_id',
        'role',
        'last_read_at',
    ];

    protected function casts(): array
    {
        return [
            'chat_id' => 'integer',
            'user_id' => 'integer',
            'last_read_at' => 'datetime',
        ];
    }

    public function chat(): BelongsTo
    {
        return $this->belongsTo(Chat::class, 'chat_id', 'chat_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
