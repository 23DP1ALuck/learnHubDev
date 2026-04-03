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
        Schema::create('school_groups', function (Blueprint $table) {
            $table->unsignedBigInteger('group_id');
            $table->unsignedBigInteger('school_id');
            $table->foreign('school_id')
                ->references('id')
                ->on('organizations')
                ->cascadeOnDelete();

            $table->timestamps();
            $table->string('name');

            $table->primary(['group_id', 'school_id']);
            $table->unique(['group_id', 'school_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_groups');
    }
};
