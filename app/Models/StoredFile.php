<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StoredFile extends Model
{
    use HasFactory;

    protected $table = 'files';

    protected $fillable = [
        'file_name',
        'file_path',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function materialLinks(): HasMany
    {
        return $this->hasMany(MaterialFile::class, 'file_id');
    }

    public function answerLinks(): HasMany
    {
        return $this->hasMany(AnswerFile::class, 'file_id');
    }

    public function messageLinks(): HasMany
    {
        return $this->hasMany(MessageFile::class, 'file_id');
    }
}
