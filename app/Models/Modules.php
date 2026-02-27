<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Modules extends Model
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


}
