@php
    $expiresText = $expiresAt ? $expiresAt->timezone(config('app.timezone'))->format('F j, Y g:i A') : null;
@endphp

<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{{ $appName }} Invitation</title>
    </head>
    <body style="margin: 0; padding: 0; background: #f6f9fc; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 32px 12px;">
            <tr>
                <td align="center">
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
                        <tr>
                            <td style="background: #ffffff; border-radius: 12px; padding: 28px; box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);">
                                <h1 style="margin: 0 0 12px; font-size: 20px; line-height: 28px; color: #111827;">You're invited</h1>

                                <p style="margin: 0 0 12px; color: #374151; font-size: 15px; line-height: 22px;">
                                    Hi {{ $recipientName ?: 'there' }},
                                </p>

                                <p style="margin: 0 0 18px; color: #374151; font-size: 15px; line-height: 22px;">
                                    You’ve been invited{{ $organizationName ? ' to join ' . $organizationName : '' }} on {{ $appName }}.
                                    Click the button below to accept your invite and set your password.
                                </p>

                                <p style="margin: 0 0 18px;">
                                    <a href="{{ $inviteUrl }}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 10px; font-weight: 600; font-size: 14px;">
                                        Accept invite
                                    </a>
                                </p>

                                <p style="margin: 0 0 18px; color: #6b7280; font-size: 13px; line-height: 18px;">
                                    If the button doesn’t work, copy and paste this link into your browser:<br />
                                    <a href="{{ $inviteUrl }}" style="color: #2563eb; word-break: break-all;">{{ $inviteUrl }}</a>
                                </p>

                                @if ($expiresAt)
                                    <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 18px;">
                                        This invite expires {{ $expiresAt->diffForHumans() }} ({{ $expiresText }}).
                                    </p>
                                @endif

                                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

                                <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 16px;">
                                    If you weren’t expecting this email, you can safely ignore it.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>
