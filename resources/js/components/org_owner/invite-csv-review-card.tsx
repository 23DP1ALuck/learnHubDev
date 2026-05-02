import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Form } from '@inertiajs/react';
import type { ParsedCsvUser } from './invite-csv-types';
import { InviteCsvUserRow } from './invite-csv-user-row';
import {route} from "ziggy-js";

type InviteCsvReviewCardProps = {
    roleOptions: string[];
    submitAction?: string;
    users: ParsedCsvUser[];
};

export function InviteCsvReviewCard({
    roleOptions,
    users,
}: InviteCsvReviewCardProps) {
    const { t } = useTranslation();
    const hasParsedUsers = users.length > 0;
    console.log(users);
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{t('owner.Review parsed users')}</CardTitle>
                <CardDescription>
                    {t(
                        'owner.Every parsed user is editable before final import.',
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!hasParsedUsers ? (
                    <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                        {t('owner.Upload a CSV file to preview users here.')}
                    </div>
                ) : (
                    <Form
                        action={route('invitations.invite-csv-parse.invite-users') ?? '#'}
                        method="post"
                        className="grid gap-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="overflow-x-auto rounded-lg border">
                                    <table className="min-w-[56rem] divide-y">
                                        <thead className="bg-muted/50 text-left text-sm">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">
                                                    {t('common.First name')}
                                                </th>
                                                <th className="px-4 py-3 font-medium">
                                                    {t('common.Last name')}
                                                </th>
                                                <th className="px-4 py-3 font-medium">
                                                    {t('common.Email')}
                                                </th>
                                                <th className="px-4 py-3 font-medium">
                                                    {t('common.Role')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y text-sm">
                                            {users.map((user, index) => (
                                                <InviteCsvUserRow
                                                    key={`${user.email}-${index}`}
                                                    errors={errors}
                                                    index={index}
                                                    roleOptions={roleOptions}
                                                    user={user}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {t('owner.Save imported users')}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                )}
            </CardContent>
        </Card>
    );
}
