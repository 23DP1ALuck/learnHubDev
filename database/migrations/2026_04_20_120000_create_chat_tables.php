<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chats', function (Blueprint $table) {
            $table->bigIncrements('chat_id');
            $table->string('name', 120);
            $table->enum('type', ['GROUP', 'MODULE', 'PRIVATE']);
            $table->foreignId('organization_id')
                ->constrained('organizations')
                ->cascadeOnDelete();
            $table->unsignedBigInteger('module_id')->nullable();
            $table->timestamps();

            $table->index('type');
            $table->foreign('module_id')
                ->references('id')
                ->on('modules')
                ->nullOnDelete();
        });

        Schema::create('chat_users', function (Blueprint $table) {
            $table->unsignedBigInteger('chat_id');
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->enum('role', ['OWNER', 'MEMBER'])->default('MEMBER');
            $table->timestamp('last_read_at')->nullable();

            $table->primary(['chat_id', 'user_id']);
            $table->index(['user_id', 'last_read_at']);
            $table->foreign('chat_id')
                ->references('chat_id')
                ->on('chats')
                ->cascadeOnDelete();
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->bigIncrements('message_id');
            $table->unsignedBigInteger('chat_id');
            $table->foreignId('sender_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->text('text');
            $table->timestamp('sent_at')->useCurrent();
            $table->boolean('is_seen')->default(false);

            $table->unique(['chat_id', 'message_id']);
            $table->index(['chat_id', 'sent_at']);
            $table->foreign('chat_id')
                ->references('chat_id')
                ->on('chats')
                ->cascadeOnDelete();
        });

        Schema::create('message_files', function (Blueprint $table) {
            $table->unsignedBigInteger('chat_id');
            $table->unsignedBigInteger('message_id');
            $table->foreignId('file_id')
                ->constrained('files')
                ->cascadeOnDelete();

            $table->primary(['chat_id', 'message_id', 'file_id']);
            $table->foreign(['chat_id', 'message_id'])
                ->references(['chat_id', 'message_id'])
                ->on('messages')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('message_files');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('chat_users');
        Schema::dropIfExists('chats');
    }
};
