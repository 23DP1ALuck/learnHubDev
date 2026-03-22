<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $fillable = [
        "speciality"
    ];
    protected function casts(): array
    {
        return [
            'speciality' => 'string',
        ];
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
