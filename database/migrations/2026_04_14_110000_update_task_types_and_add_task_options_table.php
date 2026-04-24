<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->enum('task_type', [
                'TEST',
                'CHECKBOX',
                'TEXT',
                'FILE',
                'YES_NO',
                'TRUE_FALSE',
                'NUMBER',
                'CUSTOM_SELECT',
            ])->change();
        });

        DB::table('tasks')
            ->where('task_type', 'YES_NO')
            ->update(['task_type' => 'TRUE_FALSE']);

        DB::table('tasks')
            ->where('task_type', 'TEST')
            ->update(['task_type' => 'CHECKBOX']);

        Schema::table('tasks', function (Blueprint $table) {
            $table->enum('task_type', [
                'CHECKBOX',
                'TEXT',
                'FILE',
                'TRUE_FALSE',
                'NUMBER',
                'CUSTOM_SELECT',
            ])->change();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_options');

        Schema::table('tasks', function (Blueprint $table) {
            $table->enum('task_type', [
                'TEST',
                'TEXT',
                'FILE',
                'YES_NO',
                'NUMBER',
            ])->change();
        });
    }
};
