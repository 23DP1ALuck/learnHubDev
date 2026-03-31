<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use HasFactory, Compoships;

    public $incrementing = false;

    protected $fillable = [
        'assignment_id',
        'task_id',
        'question_text',
        'task_type',
        'max_points',
    ];

    protected function casts(): array
    {
        return [
            'assignment_id' => 'integer',
            'task_id' => 'integer',
            'max_points' => 'decimal:2',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function assignment(): BelongsTo
    {
        return $this->belongsTo(Assignment::class, 'assignment_id');
    }

    public function correctAnswers(): HasMany
    {
        return $this->hasMany(TaskCorrectAnswer::class, ['assignment_id', 'task_id'], ['assignment_id', 'task_id']);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(TaskAnswer::class, ['assignment_id', 'task_id'], ['assignment_id', 'task_id']);
    }
}
