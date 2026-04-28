import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { AdminDashboardActivity } from './admin-dashboard-types';
import { formatAdminDashboardDate } from './admin-dashboard-utils';

type AdminRecentActivityProps = {
    recentActivity: AdminDashboardActivity[];
};

export function AdminRecentActivity({
    recentActivity,
}: AdminRecentActivityProps) {
    const { t } = useTranslation();

    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{t('common.Recent Activity')}</CardTitle>
                <CardDescription>
                    {t('admin.Latest platform events.')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {recentActivity.length === 0 ? (
                    <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                        {t('admin.No recent activity yet.')}
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {recentActivity.map((activity) => (
                            <div
                                key={activity.id}
                                className="rounded-2xl border p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p className="font-medium">
                                        {activity.title}
                                    </p>
                                    <span className="shrink-0 text-xs text-muted-foreground">
                                        {formatAdminDashboardDate(
                                            activity.created_at,
                                        )}
                                    </span>
                                </div>
                                {activity.description ? (
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {activity.description}
                                    </p>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
