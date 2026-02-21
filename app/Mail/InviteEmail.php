<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;

class InviteEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public readonly string $inviteUrl,
        public readonly ?string $recipientName = null,
        public readonly ?string $organizationName = null,
        public readonly ?Carbon $expiresAt = null,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $appName = config('app.name');
        $subject = $this->organizationName
            ? "You're invited to join {$this->organizationName} on {$appName}"
            : "You're invited to join {$appName}";

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.invite',
            with: [
                'inviteUrl' => $this->inviteUrl,
                'recipientName' => $this->recipientName,
                'organizationName' => $this->organizationName,
                'expiresAt' => $this->expiresAt,
                'appName' => config('app.name'),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
