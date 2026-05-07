<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ErrorReportFile extends Model
{
    protected $table = 'error_images';
    public $timestamps = false;

    protected $fillable = [
        'error_id',
        'user_id',
        'file_id',
    ];

    public function file(BelongsTo $file)
    {
        return $this->belongsTo(StoredFile::class, 'file_id');
    }
}
