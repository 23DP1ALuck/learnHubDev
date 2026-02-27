<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('topics', function (Blueprint $table) {
            $table->unsignedBigInteger('topic_id');
            $table->foreignId('module_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->timestamps();
            $table->string('name');
            $table->string('description')->nullable();

            $table->primary(['topic_id', 'module_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('topics');
    }
};
