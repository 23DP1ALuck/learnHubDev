<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ErrorReport extends Model
{
    use HasFactory, Compoships;

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

    public function fileLinks(): HasMany
    {
        return $this->hasMany(ErrorReportFile::class, [
            'error_id', 'user_id',
        ], [
            'error_id', 'user_id',
        ]);
    }
}
