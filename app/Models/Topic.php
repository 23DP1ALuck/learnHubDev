<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Topic extends Model
{
    use Compoships;

    public $incrementing = false;

    protected $primaryKey = 'topic_id';

    protected $keyType = 'int';

    protected $fillable = [
        'topic_id',
        'module_id',
        'name',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'topic_id' => 'integer',
            'module_id' => 'integer',
            'name' => 'string',
            'description' => 'string',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class, 'module_id');
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class, ['topic_id', 'module_id'], ['topic_id', 'module_id']);
    }

    public function assignments(): BelongsToMany
    {
        $relation = $this->belongsToMany(
            Assignment::class,
            'topic_assignments',
            'topic_id',
            'assignment_id',
            'topic_id',
            'id',
        )->withPivot('module_id');

        if ($this->module_id !== null) {
            $relation->withPivotValue('module_id', $this->module_id);
        }

        return $relation;
    }
}
