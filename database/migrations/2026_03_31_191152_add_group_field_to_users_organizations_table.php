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
        Schema::table('users_organizations', function (Blueprint $table) {
            $table->unsignedBigInteger('group_id')->nullable();
            $table->index(['group_id', 'organization_id']);
            $table->foreign(['group_id', 'organization_id'])
                ->references(['group_id', 'school_id'])
                ->on('school_groups');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users_organizations', function (Blueprint $table) {
            $table->dropForeign(['group_id', 'organization_id']);
            $table->dropIndex(['group_id', 'organization_id']);
            $table->dropColumn('group_id');
        });
    }
};
