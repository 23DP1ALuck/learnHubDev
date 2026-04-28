import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Building2, CheckCircle2, School, Users } from 'lucide-react';
import { AdminDashboardStats } from './admin-dashboard-types';

type AdminPlatformSplitProps = {
    stats: AdminDashboardStats;
};

export function AdminPlatformSplit({ stats }: AdminPlatformSplitProps) {
    const { t } = useTranslation();

    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{t('admin.Platform split')}</CardTitle>
                <CardDescription>
                    {t('admin.Organization and user composition.')}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
                <div className="flex items-center justify-between rounded-2xl border p-4">
                    <div className="flex items-center gap-3">
                        <School className="size-5 text-muted-foreground" />
                        <span>{t('common.School groups')}</span>
                    </div>
                    <span className="font-semibold">{stats.schools}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border p-4">
                    <div className="flex items-center gap-3">
                        <Building2 className="size-5 text-muted-foreground" />
                        <span>{t('admin.Individual courses')}</span>
                    </div>
                    <span className="font-semibold">
                        {stats.individual_courses}
                    </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border p-4">
                    <div className="flex items-center gap-3">
                        <Users className="size-5 text-muted-foreground" />
                        <span>{t('common.Students')}</span>
                    </div>
                    <span className="font-semibold">{stats.students}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border p-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="size-5 text-muted-foreground" />
                        <span>{t('admin.Approved requests')}</span>
                    </div>
                    <span className="font-semibold">
                        {stats.approved_onboarding}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
