import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { organization as ownerOrganization } from '@/routes';
import type { BreadcrumbItem, Organization, OrganizationStats } from '@/types';
import { Head } from '@inertiajs/react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organization',
        href: ownerOrganization().url,
    },
];
export default function OrganizationPage({
    organization,
    stats,
}: {
    organization: Organization;
    stats: OrganizationStats;
}) {
    const { t } = useTranslation();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('owner.Organization')} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="border-sidebar-border/70">
                    <CardHeader>
                        <CardTitle>{organization.organization_name}</CardTitle>
                        <CardDescription>
                            {t(
                                'owner.Core information about your organization workspace.',
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">
                                {t('common.Type')}
                            </p>
                            <p className="mt-1 font-medium capitalize">
                                {organization.organization_type}
                            </p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">
                                {t('common.Created')}
                            </p>
                            <p className="mt-1 font-medium">
                                {organization.created_at
                                    ? new Date(
                                          organization.created_at,
                                      ).toLocaleDateString()
                                    : 'Unknown'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {Object.entries(stats).map(([label, value]) => (
                        <Card key={label} className="border-sidebar-border/70">
                            <CardHeader>
                                <CardDescription>
                                    {label.replace('_', ' ')}
                                </CardDescription>
                                <CardTitle className="text-3xl">
                                    {value}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
