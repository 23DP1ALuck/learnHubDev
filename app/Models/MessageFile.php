<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MessageFile extends Model
{
    use Compoships;

    protected $table = 'message_files';

    public $timestamps = false;

    public $incrementing = false;

    protected $fillable = [
        'chat_id',
        'message_id',
        'file_id',
    ];

    protected function casts(): array
    {
        return [
            'chat_id' => 'integer',
            'message_id' => 'integer',
            'file_id' => 'integer',
        ];
    }

    public function message(): BelongsTo
    {
        return $this->belongsTo(ChatMessage::class, ['chat_id', 'message_id'], ['chat_id', 'message_id']);
    }

    public function file(): BelongsTo
    {
        return $this->belongsTo(StoredFile::class, 'file_id');
    }
}
