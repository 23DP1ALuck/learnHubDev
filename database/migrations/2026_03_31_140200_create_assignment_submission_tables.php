<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->string('title', 120);
            $table->text('description')->nullable();
            $table->text('grading_policy')->nullable();
            $table->date('due_date')->nullable();
            $table->timestamps();
        });

        Schema::create('topic_assignments', function (Blueprint $table) {
            $table->unsignedBigInteger('module_id');
            $table->unsignedBigInteger('topic_id');
            $table->foreignId('assignment_id')
                ->constrained('assignments')
                ->cascadeOnDelete();

            $table->primary(['module_id', 'topic_id', 'assignment_id']);
            $table->index(['topic_id', 'module_id']);
            $table->foreign(['topic_id', 'module_id'])
                ->references(['topic_id', 'module_id'])
                ->on('topics')
                ->cascadeOnDelete();
        });

        Schema::create('tasks', function (Blueprint $table) {
            $table->foreignId('assignment_id')
                ->constrained('assignments')
                ->cascadeOnDelete();
            $table->unsignedBigInteger('task_id');
            $table->text('question_text');
            $table->enum('task_type', ['TEST', 'TEXT', 'FILE', 'YES_NO', 'NUMBER']);
            $table->decimal('max_points', 5, 2);
            $table->timestamps();

            $table->primary(['assignment_id', 'task_id']);
        });

        Schema::create('task_correct_answers', function (Blueprint $table) {
            $table->unsignedBigInteger('assignment_id');
            $table->unsignedBigInteger('task_id');
            $table->unsignedBigInteger('answer_id');
            $table->string('answer');

            $table->primary(['assignment_id', 'task_id', 'answer_id']);
            $table->foreign(['assignment_id', 'task_id'])
                ->references(['assignment_id', 'task_id'])
                ->on('tasks')
                ->cascadeOnDelete();
        });

        Schema::create('submissions', function (Blueprint $table) {
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('assignment_id');
            $table->enum('status', ['DRAFT', 'SUBMITTED', 'GRADED'])->default('DRAFT');
            $table->date('submitted_on')->nullable();
            $table->decimal('total_points', 5, 2)->nullable();
            $table->decimal('total_percent', 5, 2)->nullable();
            $table->timestamps();

            $table->primary(['student_id', 'assignment_id']);
            $table->index('assignment_id');
            $table->foreign('student_id')
                ->references('user_id')
                ->on('students')
                ->cascadeOnDelete();
            $table->foreign('assignment_id')
                ->references('id')
                ->on('assignments')
                ->cascadeOnDelete();
        });

        Schema::create('task_answers', function (Blueprint $table) {
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('assignment_id');
            $table->unsignedBigInteger('task_id');
            $table->text('answer_text')->nullable();
            $table->time('time_spent')->nullable();
            $table->decimal('points', 5, 2)->nullable();
            $table->text('teacher_comment')->nullable();
            $table->timestamps();

            $table->primary(['student_id', 'assignment_id', 'task_id']);
            $table->index(['assignment_id', 'task_id']);
            $table->foreign(['student_id', 'assignment_id'])
                ->references(['student_id', 'assignment_id'])
                ->on('submissions')
                ->cascadeOnDelete();
            $table->foreign(['assignment_id', 'task_id'])
                ->references(['assignment_id', 'task_id'])
                ->on('tasks')
                ->cascadeOnDelete();
        });

        Schema::create('answer_files', function (Blueprint $table) {
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('assignment_id');
            $table->unsignedBigInteger('task_id');
            $table->foreignId('file_id')
                ->constrained('files')
                ->cascadeOnDelete();

            $table->primary(['student_id', 'assignment_id', 'task_id', 'file_id']);
            $table->foreign(['student_id', 'assignment_id', 'task_id'])
                ->references(['student_id', 'assignment_id', 'task_id'])
                ->on('task_answers')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('answer_files');
        Schema::dropIfExists('task_answers');
        Schema::dropIfExists('submissions');
        Schema::dropIfExists('task_correct_answers');
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('topic_assignments');
        Schema::dropIfExists('assignments');
    }
};
