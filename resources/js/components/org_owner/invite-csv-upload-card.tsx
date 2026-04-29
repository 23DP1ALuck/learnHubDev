import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import type { Organization } from '@/types';
import { Form } from '@inertiajs/react';
import {inviteCsv} from "@/routes/invitations";
import {route} from "ziggy-js";
import {PhotoProvider, PhotoView} from "react-photo-view";
import 'react-photo-view/dist/react-photo-view.css';

type InviteCsvUploadCardProps = {
    organization: Organization;
};
import csvExample from "@/images/csv-example.jpg"
export function InviteCsvUploadCard({
    organization,
}: InviteCsvUploadCardProps) {
    const { t } = useTranslation();

    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>
                    {t('owner.Import users to')}{' '}
                    {organization.organization_name}
                </CardTitle>
                <CardDescription>
                    {t(
                        'owner.Upload a CSV file, review parsed users, then edit wrong values before saving.',
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form
                    action={route('invitations.invite-csv-parse')}
                    method="post"
                    encType="multipart/form-data"
                    className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="csv_file">
                                    {t('owner.CSV file')}
                                </Label>
                                <Input
                                    id="csv_file"
                                    name="csv_file"
                                    type="file"
                                    accept=".csv,text/csv"
                                />
                                <InputError message={errors.csv_file} />
                            </div>

                            <div className="flex items-end">
                                <Button type="submit" disabled={processing}>
                                    {t('owner.Parse CSV')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
                <Card className="mt-6 flex flex-col items-center gap-4 border-dashed p-4">
                    <CardHeader className="p-0 text-center">
                        <CardDescription>
                            {t('owner.Please ensure your CSV file is formatted correctly. Here is an example of a valid CSV file:')}
                        </CardDescription>
                    </CardHeader>
                    <PhotoProvider>
                        <PhotoView src={csvExample}>
                            <img
                                src={csvExample}
                                alt={t('owner.CSV file example')}
                                className="max-h-64 cursor-zoom-in rounded-xl border object-contain"
                            />
                        </PhotoView>
                    </PhotoProvider>
                </Card>

            </CardContent>
        </Card>
    );
}
