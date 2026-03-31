<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TopicAssignment extends Model
{
    use Compoships;

    protected $table = 'topic_assignments';

    public $timestamps = false;

    public $incrementing = false;

    protected $fillable = [
        'module_id',
        'topic_id',
        'assignment_id',
    ];

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class, ['topic_id', 'module_id'], ['topic_id', 'module_id']);
    }

    public function assignment(): BelongsTo
    {
        return $this->belongsTo(Assignment::class, 'assignment_id');
    }
}
