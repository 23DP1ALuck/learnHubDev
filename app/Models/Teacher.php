<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
