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
        Schema::create('teachers', function (Blueprint $table) {
            $table->string('speciality')->nullable();

            $table->foreignId('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->primary('user_id');
        });
        Schema::create('group_module_teacher', function (Blueprint $table) {
            $table->unsignedBigInteger('school_id');
            $table->unsignedBigInteger('group_id');
            $table->unsignedBigInteger('module_id');
            $table->unsignedBigInteger('teacher_id');

            $table->integer('semester')->nullable();
            $table->string('school_year', 10)->nullable();

            $table->primary([
                'school_id',
                'group_id',
                'module_id',
                'teacher_id'
            ], 'gmt_primary');

            $table->foreign(['group_id', 'school_id'])
                ->references(['group_id', 'school_id'])
                ->on('school_groups')
                ->cascadeOnDelete();

            $table->foreign('module_id')
                ->references('id')
                ->on('modules')
                ->cascadeOnDelete();

            $table->foreign('teacher_id')
                ->references('user_id')
                ->on('teachers')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_module_teacher');
        Schema::dropIfExists('teachers');
    }
};
