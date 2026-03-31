<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnswerFile extends Model
{
    use Compoships;

    protected $table = 'answer_files';

    public $timestamps = false;

    public $incrementing = false;

    protected $fillable = [
        'student_id',
        'assignment_id',
        'task_id',
        'file_id',
    ];

    public function taskAnswer(): BelongsTo
    {
        return $this->belongsTo(TaskAnswer::class, ['student_id', 'assignment_id', 'task_id'], ['student_id', 'assignment_id', 'task_id']);
    }

    public function file(): BelongsTo
    {
        return $this->belongsTo(StoredFile::class, 'file_id');
    }
}
