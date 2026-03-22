<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        return $this->hasMany(GroupModuleTeacher::class, ['group_id', 'organisation_id'], ['group_id', 'school_id']);
    }
}
