<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Teacher extends Model
{
    public $incrementing = false;
    public $timestamps = false;

    protected $primaryKey = 'user_id';

    protected $keyType = 'int';

    protected $fillable = [
        "user_id",
        "speciality"
    ];
    protected function casts(): array
    {
        return [
            'speciality' => 'string',
        ];
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function groupModuleTeachers(): HasMany
    {
        return $this->hasMany(GroupModuleTeacher::class, 'teacher_id', 'user_id');
    }
}
