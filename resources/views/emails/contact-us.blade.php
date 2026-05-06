<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New contact request</title>
</head>
<body style="margin: 0; padding: 0; background: #f6f9fc; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 32px 12px;">
    <tr>
        <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
                <tr>
                    <td style="background: #ffffff; border-radius: 12px; padding: 28px; box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);">
                        <h1 style="margin: 0 0 12px; font-size: 20px; line-height: 28px; color: #111827;">
                            New contact request
                        </h1>

                        <p style="margin: 0 0 18px; color: #374151; font-size: 15px; line-height: 22px;">
                            A new contact form message was submitted on {{ $appName }}.
                        </p>

                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 18px;">
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 13px; width: 120px;">
                                    First name
                                </td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">
                                    {{ $firstname }}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 13px; width: 120px;">
                                    Last name
                                </td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">
                                    {{ $lastname }}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 13px; width: 120px;">
                                    Email
                                </td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">
                                    <a href="mailto:{{ $email }}" style="color: #2563eb; text-decoration: none;">
                                        {{ $email }}
                                    </a>
                                </td>
                            </tr>
                        </table>

                        <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; line-height: 18px;">
                            Message
                        </p>

                        <div style="margin: 0 0 18px; padding: 14px 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; color: #111827; font-size: 14px; line-height: 22px; white-space: pre-line;">
                            {{ $messageText }}
                        </div>

                        <p style="margin: 0 0 18px;">
                            <a href="mailto:{{ $email }}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 10px; font-weight: 600; font-size: 14px;">
                                Reply to {{ $firstname }}
                            </a>
                        </p>

                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

                        <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 16px;">
                            This email was generated automatically from the {{ $appName }} contact form.
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
