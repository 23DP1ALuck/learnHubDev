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
        Schema::create('account_invites', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->string('selector',64)->unique();
            $table->string('verifier_hash',64);

            $table->enum('invitation_type', ['onboarding_request', 'join_org']);
            $table->timestamp('expires_at')->index();
            $table->timestamp('used_at')->nullable();

            // FK -> users.id
            $table->foreignId('invited_by')
                ->constrained('users')
                ->cascadeOnDelete();
            // FK -> onboarding_requests.id
            $table->foreignId('onboarding_request_id')
                ->nullable()
                ->constrained('onboarding_requests')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_invites');
    }
};
