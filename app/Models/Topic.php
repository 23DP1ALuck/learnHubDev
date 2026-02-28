<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
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
    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id');
    }
}
