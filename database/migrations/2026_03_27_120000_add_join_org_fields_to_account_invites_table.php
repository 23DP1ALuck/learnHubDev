<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('account_invites', function (Blueprint $table) {
            $table->foreignId('organization_id')
                ->nullable()
                ->after('onboarding_request_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('email')->nullable()->after('organization_id');
            $table->string('first_name')->nullable()->after('email');
            $table->string('last_name')->nullable()->after('first_name');
            $table->enum('role_in_org', ['STUDENT', 'TEACHER', 'ORGANIZATION_OWNER'])
                ->nullable()
                ->after('last_name');
        });
    }

    public function down(): void
    {
        Schema::table('account_invites', function (Blueprint $table) {
            $table->dropConstrainedForeignId('organization_id');
            $table->dropColumn(['email', 'first_name', 'last_name', 'role_in_org']);
        });
    }
};
