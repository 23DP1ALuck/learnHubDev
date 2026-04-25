// Components
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Form, Head } from '@inertiajs/react';
export default function VerifyEmail({ status }: { status?: string }) {
    const { t } = useTranslation();
    return (
        <AuthLayout
            title={t('auth_ui.Verify email')}
            description={t(
                'auth_ui.Please verify your email address by clicking on the link we just emailed to you.',
            )}
        >
            <Head title={t('auth_ui.Email verification')} />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {t(
                        'auth_ui.A new verification link has been sent to the email address you provided during registration.',
                    )}
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}{' '}
                            {t('auth_ui.Resend verification email')}
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm"
                        >
                            {t('common.Log out')}
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
