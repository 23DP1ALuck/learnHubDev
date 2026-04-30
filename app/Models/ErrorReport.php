<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ErrorReport extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    protected $primaryKey = 'error_id';

    protected $fillable = [
        'user_id',
        'report_text',
        'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function files(): BelongsToMany
    {
        return $this->belongsToMany(StoredFile::class, 'error_images', 'error_id', 'file_id', 'error_id', 'id')
            ->withPivot('user_id');
    }
}
