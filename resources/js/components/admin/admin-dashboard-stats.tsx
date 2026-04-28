import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Building2, Clock3, GraduationCap, Users } from 'lucide-react';
import { AdminDashboardStats } from './admin-dashboard-types';

type AdminDashboardStatsProps = {
    stats: AdminDashboardStats;
};

export function AdminDashboardStatsGrid({ stats }: AdminDashboardStatsProps) {
    const { t } = useTranslation();
    const metricCards = [
        {
            label: t('common.Users'),
            value: stats.users,
            icon: Users,
            description: t('admin.Total registered platform users.'),
        },
        {
            label: t('common.Organizations'),
            value: stats.organizations,
            icon: Building2,
            description: t('admin.Schools and individual course owners.'),
        },
        {
            label: t('common.Teachers'),
            value: stats.teachers,
            icon: GraduationCap,
            description: t('admin.Users with teacher permissions.'),
        },
        {
            label: t('common.Pending'),
            value: stats.pending_onboarding,
            icon: Clock3,
            description: t('admin.Onboarding requests waiting for review.'),
        },
    ];

    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((metric) => (
                <Card key={metric.label} className="border-sidebar-border/70">
                    <CardHeader className="flex flex-row items-start justify-between gap-3">
                        <div className="space-y-1">
                            <CardDescription>{metric.label}</CardDescription>
                            <CardTitle className="text-3xl">
                                {metric.value}
                            </CardTitle>
                        </div>
                        <span className="rounded-2xl bg-muted p-3">
                            <metric.icon className="size-5" />
                        </span>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {metric.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </section>
    );
}
