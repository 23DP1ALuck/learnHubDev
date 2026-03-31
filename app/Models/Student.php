<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    use HasFactory, Compoships;

    public $incrementing = false;

    protected $primaryKey = 'user_id';

    protected $keyType = 'int';

    protected $fillable = [
        'user_id',
        'personal_code',
        'school_id',
        'group_id',
    ];

    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'school_id' => 'integer',
            'group_id' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(SchoolGroup::class, ['group_id', 'school_id'], ['group_id', 'school_id']);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class, 'student_id', 'user_id');
    }
}
