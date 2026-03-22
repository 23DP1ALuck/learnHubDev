<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupModuleTeacher extends Model
{
    /** @use HasFactory<\Database\Factories\GroupModuleTeacherFactory> */
    use HasFactory, Compoships;
    protected $table = 'group_module_teacher';

    public $timestamps = false;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'school_id',
        'group_id',
        'module_id',
        'teacher_id',
        'semester',
        'school_year',
    ];

    protected $casts = [
        'school_id' => 'integer',
        'group_id' => 'integer',
        'module_id' => 'integer',
        'teacher_id' => 'integer',
        'semester' => 'integer',
    ];

    public function group()
    {
        return $this->belongsTo(SchoolGroup::class, ['group_id', 'school_id'], ['group_id', 'school_id']);
    }

    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }
}
