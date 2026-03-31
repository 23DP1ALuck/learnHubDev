<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Submission extends Model
{
    use HasFactory, Compoships;

    public $incrementing = false;

    protected $fillable = [
        'student_id',
        'assignment_id',
        'status',
        'submitted_on',
        'total_points',
        'total_percent',
    ];

    protected function casts(): array
    {
        return [
            'student_id' => 'integer',
            'assignment_id' => 'integer',
            'submitted_on' => 'date',
            'total_points' => 'decimal:2',
            'total_percent' => 'decimal:2',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id', 'user_id');
    }

    public function assignment(): BelongsTo
    {
        return $this->belongsTo(Assignment::class, 'assignment_id');
    }

    public function taskAnswers(): HasMany
    {
        return $this->hasMany(TaskAnswer::class, ['student_id', 'assignment_id'], ['student_id', 'assignment_id']);
    }
}
