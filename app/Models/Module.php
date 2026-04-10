<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    protected $fillable = [
        'start_date',
        'name',
        'description',
        'end_date',
        'creator_id',
        'organization_id'
    ];
    protected function casts(): array
    {
        return [
            'name' => 'string',
            'description' => 'string',
            'start_date' => 'date',
            'end_date' => 'date',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'creator_id' => 'integer',
            'organization_id' => 'integer',
        ];
    }
    public function topics(): HasMany
    {
        return $this->hasMany(Topic::class);
    }
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function groupModuleTeachers(): HasMany
    {
        return $this->hasMany(GroupModuleTeacher::class);
    }

    public function assignments(): BelongsToMany
    {
        return $this->belongsToMany(
            Assignment::class,
            'topic_assignments',
            'module_id',
            'assignment_id',
            'id',
            'id',
        )->withPivot('topic_id');
    }

}
