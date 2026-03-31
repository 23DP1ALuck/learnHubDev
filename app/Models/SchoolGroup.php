<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SchoolGroup extends Model
{
    use Compoships;
    public $incrementing = false;

    protected $fillable = [
        'group_id',
        'school_id',
        'name'
    ];

    protected function casts(): array
    {
        return [
            'school_id' => 'integer',
            'group_id' => 'integer',
            'name' => 'string',
        ];
    }
    public function school()
    {
        return $this->belongsTo(Organization::class, 'school_id');
    }
    public function groupModulesTeachers()
    {
        return $this->hasMany(GroupModuleTeacher::class, ['group_id', 'school_id'], ['group_id', 'school_id']);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class, ['group_id', 'school_id'], ['group_id', 'school_id']);
    }
}
