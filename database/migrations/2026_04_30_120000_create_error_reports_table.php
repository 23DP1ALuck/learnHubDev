<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('error_reports', function (Blueprint $table) {
            $table->bigIncrements('error_id');
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->text('report_text');
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('resolved_at')->nullable();

            $table->unique(['error_id', 'user_id']);
        });

        Schema::create('error_images', function (Blueprint $table) {
            $table->unsignedBigInteger('error_id');
            $table->unsignedBigInteger('user_id');
            $table->foreignId('file_id')
                ->constrained('files')
                ->cascadeOnDelete();

            $table->primary(['error_id', 'user_id', 'file_id']);
            $table->foreign(['error_id', 'user_id'])
                ->references(['error_id', 'user_id'])
                ->on('error_reports')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('error_images');
        Schema::dropIfExists('error_reports');
    }
};
