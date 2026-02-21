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
        Schema::create('users_organizations', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('organization_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->date('joined_on')->nullable();
            $table->enum('role_in_org', ['STUDENT', 'TEACHER', 'ORGANIZATION_OWNER'])->default('STUDENT');
            $table->boolean('admin_privileges')->default(false);

            $table->primary(['organization_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users_organizations');
    }
};
