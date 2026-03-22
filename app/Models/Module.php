<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    protected $fillable = [
        'start_date',
        'name',
        'description',
        'end_date'
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
        ];
    }
    public function topics(): HasMany
    {
        return $this->hasMany(Topic::class);
    }

    public function groupModuleTeachers(): HasMany
    {
        return $this->hasMany(GroupModuleTeacher::class);
    }

}
