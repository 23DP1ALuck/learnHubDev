<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatMessage extends Model
{
    use Compoships;

    protected $table = 'messages';

    protected $primaryKey = 'message_id';

    public $timestamps = false;

    protected $fillable = [
        'message_id',
        'chat_id',
        'sender_id',
        'text',
        'sent_at',
        'is_seen',
    ];

    protected function casts(): array
    {
        return [
            'message_id' => 'integer',
            'chat_id' => 'integer',
            'sender_id' => 'integer',
            'sent_at' => 'datetime',
            'is_seen' => 'boolean',
        ];
    }

    public function chat(): BelongsTo
    {
        return $this->belongsTo(Chat::class, 'chat_id', 'chat_id');
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function fileLinks(): HasMany
    {
        return $this->hasMany(MessageFile::class, ['chat_id', 'message_id'], ['chat_id', 'message_id']);
    }
}
