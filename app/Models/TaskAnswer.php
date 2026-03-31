<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TaskAnswer extends Model
{
    use HasFactory, Compoships;

    public $incrementing = false;

    protected $fillable = [
        'student_id',
        'assignment_id',
        'task_id',
        'answer_text',
        'time_spent',
        'points',
        'teacher_comment',
    ];

    protected function casts(): array
    {
        return [
            'student_id' => 'integer',
            'assignment_id' => 'integer',
            'task_id' => 'integer',
            'time_spent' => 'string',
            'points' => 'decimal:2',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class, ['student_id', 'assignment_id'], ['student_id', 'assignment_id']);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, ['assignment_id', 'task_id'], ['assignment_id', 'task_id']);
    }

    public function fileLinks(): HasMany
    {
        return $this->hasMany(AnswerFile::class, ['student_id', 'assignment_id', 'task_id'], ['student_id', 'assignment_id', 'task_id']);
    }
}
