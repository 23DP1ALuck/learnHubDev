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
import { store as storeGroups } from '@/routes/groups';
import type { Flash, Organization } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
export const CreateGroups = ({
    org,
}: {
    org: Organization | null | undefined;
}) => {
    const { t } = useTranslation();
    const { flash } = usePage<Flash>().props;
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash?.success]);
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>
                    {t('owner.Create study groups for')}{' '}
                    {org?.organization_name}
                </CardTitle>
                <CardDescription>
                    {t(
                        'owner.Create study groups for your organization to organize students by class, course, or level. These groups can later be used for assigning materials, managing access, and keeping the learning process structured.',
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form
                    {...storeGroups.form()}
                    resetOnSuccess={['name']}
                    className="grid gap-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">
                                    {t('owner.Group name')}
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="11A"
                                />
                                <InputError message={errors.name} />
                                <InputError message={errors.school_id} />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={processing || !org}
                                >
                                    {t('owner.Create group')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
};
