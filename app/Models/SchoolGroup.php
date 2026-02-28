<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolGroup extends Model
{
    public $incrementing = false;

    protected $primaryKey = 'group_id';

    protected $keyType = 'int';

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
}
