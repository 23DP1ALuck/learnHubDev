<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->string('file_name', 120);
            $table->string('file_path')->nullable();
            $table->timestamps();
        });

        Schema::create('materials', function (Blueprint $table) {
            $table->unsignedBigInteger('module_id');
            $table->unsignedBigInteger('topic_id');
            $table->unsignedBigInteger('material_id');
            $table->string('title');
            $table->string('description')->nullable();
            $table->timestamps();

            $table->primary(['module_id', 'topic_id', 'material_id']);
            $table->index(['topic_id', 'module_id']);
            $table->foreign(['topic_id', 'module_id'])
                ->references(['topic_id', 'module_id'])
                ->on('topics')
                ->cascadeOnDelete();
        });

        Schema::create('material_files', function (Blueprint $table) {
            $table->unsignedBigInteger('module_id');
            $table->unsignedBigInteger('topic_id');
            $table->unsignedBigInteger('material_id');
            $table->foreignId('file_id')
                ->constrained('files')
                ->cascadeOnDelete();

            $table->primary(['module_id', 'topic_id', 'material_id', 'file_id']);
            $table->foreign(['module_id', 'topic_id', 'material_id'])
                ->references(['module_id', 'topic_id', 'material_id'])
                ->on('materials')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('material_files');
        Schema::dropIfExists('materials');
        Schema::dropIfExists('files');
    }
};
