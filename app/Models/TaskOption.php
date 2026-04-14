<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskOption extends Model
{
    use Compoships;

    public $timestamps = false;

    public $incrementing = false;

    protected $fillable = [
        'assignment_id',
        'task_id',
        'option_id',
        'option_text',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, ['assignment_id', 'task_id'], ['assignment_id', 'task_id']);
    }
}
