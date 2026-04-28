import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { AdminDashboardOrganization } from './admin-dashboard-types';
import { formatAdminDashboardDate } from './admin-dashboard-utils';

type AdminRecentOrganizationsProps = {
    recentOrganizations: AdminDashboardOrganization[];
};

export function AdminRecentOrganizations({
    recentOrganizations,
}: AdminRecentOrganizationsProps) {
    const { t } = useTranslation();

    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{t('admin.Recent organizations')}</CardTitle>
                <CardDescription>
                    {t('admin.Newest created organizations.')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {recentOrganizations.length === 0 ? (
                    <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                        {t('admin.No organizations yet.')}
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {recentOrganizations.map((organization) => (
                            <div
                                key={organization.id}
                                className="flex items-center justify-between gap-3 rounded-2xl border p-4"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium">
                                        {organization.organization_name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {organization.organization_type} ·{' '}
                                        {organization.users_count}{' '}
                                        {t('common.Members')}
                                    </p>
                                </div>
                                <span className="shrink-0 text-sm text-muted-foreground">
                                    {formatAdminDashboardDate(
                                        organization.created_at,
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
