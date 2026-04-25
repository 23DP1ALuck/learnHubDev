import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';
type InviteDetails = {
    invitation_type: 'join_org' | 'onboarding_request';
    recipient_name?: string | null;
    email?: string | null;
    organization_name?: string | null;
    role_in_org?: string | null;
    requires_password: boolean;
};
export default function Join({
    token,
    invite,
}: {
    token: string;
    invite: InviteDetails;
}) {
    const { t } = useTranslation();
    return (
        <AuthLayout
            title={
                invite.requires_password
                    ? 'Create password'
                    : t('auth_ui.Accept invitation')
            }
            description={
                invite.requires_password
                    ? 'Set your password to activate this invitation.'
                    : 'This email already has an account. Accept the invitation to join the organization.'
            }
        >
            <Head title={t('auth_ui.Accept invitation')} />

            <Form
                method="post"
                action={`/join/${encodeURIComponent(token)}`}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
                            <p className="font-medium text-foreground">
                                {invite.organization_name ??
                                    'LearnHub invitation'}
                            </p>
                            <p className="mt-1 text-muted-foreground">
                                {invite.recipient_name ?? 'Invited user'}
                                {invite.email ? ` • ${invite.email}` : ''}
                            </p>
                            {invite.role_in_org && (
                                <p className="mt-2 text-muted-foreground">
                                    Role:{' '}
                                    {invite.role_in_org === 'TEACHER'
                                        ? t('common.Teacher')
                                        : invite.role_in_org === 'STUDENT'
                                          ? t('common.Student')
                                          : invite.role_in_org}
                                </p>
                            )}
                        </div>

                        {invite.requires_password && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">
                                        {t('settings.Password')}
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        className="mt-1 block w-full"
                                        autoFocus
                                        placeholder={t('settings.Password')}
                                    />
                                    <InputError message={errors.password} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        {t('settings.Confirm password')}
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        className="mt-1 block w-full"
                                        placeholder={t(
                                            'settings.Confirm password',
                                        )}
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>
                            </>
                        )}

                        <Button
                            type="submit"
                            className="mt-4 w-full"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner />}
                            {invite.requires_password
                                ? 'Set password and join'
                                : t('auth_ui.Accept invitation')}
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
