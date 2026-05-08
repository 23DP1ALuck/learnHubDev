<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ErrorReportFile extends Model
{
    use Compoships;

    protected $table = 'error_images';

    public $timestamps = false;

    protected $fillable = [
        'error_id',
        'user_id',
        'file_id',
    ];

    public function errorReport(): BelongsTo
    {
        return $this->belongsTo(ErrorReport::class, ['error_id', 'user_id'], ['error_id', 'user_id']);
    }

    public function file(): BelongsTo
    {
        return $this->belongsTo(StoredFile::class, 'file_id');
    }
}
