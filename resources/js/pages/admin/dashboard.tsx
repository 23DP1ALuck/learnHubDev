import { AdminDashboardHero } from '@/components/admin/admin-dashboard-hero';
import { AdminDashboardStatsGrid } from '@/components/admin/admin-dashboard-stats';
import {
    AdminDashboardActivity,
    AdminDashboardOrganization,
    emptyAdminDashboardStats,
    type AdminDashboardStats,
} from '@/components/admin/admin-dashboard-types';
import { AdminOnboardingQueue } from '@/components/admin/admin-onboarding-queue';
import { AdminPlatformSplit } from '@/components/admin/admin-platform-split';
import { AdminRecentActivity } from '@/components/admin/admin-recent-activity';
import { AdminRecentOrganizations } from '@/components/admin/admin-recent-organizations';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import {
    OnboardingRequest,
    type BreadcrumbItem,
    type SharedData,
} from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type AdminDashboardProps = {
    stats?: AdminDashboardStats;
    onboardingRequests?: OnboardingRequest[];
    recentOrganizations?: AdminDashboardOrganization[];
    recentActivity?: AdminDashboardActivity[];
};

export default function AdminDashboard({
    stats = emptyAdminDashboardStats,
    onboardingRequests = [],
    recentOrganizations = [],
    recentActivity = [],
}: AdminDashboardProps) {
    const { t } = useTranslation();
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('common.Admin Dashboard')} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <AdminDashboardHero userName={auth.user.name} />
                <AdminDashboardStatsGrid stats={stats} />

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(22rem,1fr)]">
                    <AdminOnboardingQueue
                        onboardingRequests={onboardingRequests}
                    />
                    <AdminPlatformSplit stats={stats} />
                </section>

                <section className="grid gap-4 xl:grid-cols-2">
                    <AdminRecentOrganizations
                        recentOrganizations={recentOrganizations}
                    />
                    <AdminRecentActivity recentActivity={recentActivity} />
                </section>
            </div>
        </AppLayout>
    );
}
