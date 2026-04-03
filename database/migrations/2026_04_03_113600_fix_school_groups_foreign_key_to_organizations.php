<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->rebuildSchoolGroupsTable('organizations');
    }

    public function down(): void
    {
        $this->rebuildSchoolGroupsTable('schools');
    }

    private function rebuildSchoolGroupsTable(string $referencedTable): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('school_groups_tmp');

        Schema::create('school_groups_tmp', function (Blueprint $table) use ($referencedTable) {
            $table->unsignedBigInteger('group_id');
            $table->unsignedBigInteger('school_id');
            $table->timestamps();
            $table->string('name');

            $table->primary(['group_id', 'school_id']);
            $table->unique(['group_id', 'school_id']);
            $table->foreign('school_id')
                ->references('id')
                ->on($referencedTable)
                ->cascadeOnDelete();
        });

        DB::statement('
            INSERT INTO school_groups_tmp (group_id, school_id, created_at, updated_at, name)
            SELECT group_id, school_id, created_at, updated_at, name
            FROM school_groups
        ');

        Schema::drop('school_groups');
        Schema::rename('school_groups_tmp', 'school_groups');
        Schema::enableForeignKeyConstraints();
    }
};
