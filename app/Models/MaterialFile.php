<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaterialFile extends Model
{
    use Compoships;

    public $timestamps = false;

    public $incrementing = false;

    protected $fillable = [
        'module_id',
        'topic_id',
        'material_id',
        'file_id',
    ];

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class, ['module_id', 'topic_id', 'material_id'], ['module_id', 'topic_id', 'material_id']);
    }

    public function file(): BelongsTo
    {
        return $this->belongsTo(StoredFile::class, 'file_id');
    }
}
