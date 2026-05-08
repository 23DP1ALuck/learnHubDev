<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Material extends Model
{
    use Compoships, HasFactory;

    public $incrementing = false;

    protected $primaryKey = 'material_id';

    protected $keyType = 'int';

    protected $fillable = [
        'module_id',
        'topic_id',
        'material_id',
        'title',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'module_id' => 'integer',
            'topic_id' => 'integer',
            'material_id' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class, ['topic_id', 'module_id'], ['topic_id', 'module_id']);
    }

    public function fileLinks(): HasMany
    {
        return $this->hasMany(MaterialFile::class, ['module_id', 'topic_id', 'material_id'], ['module_id', 'topic_id', 'material_id']);
    }
}
