import ErrorReportList from '@/components/error-reports/error-report-list';
import ErrorReportStatsGrid from '@/components/error-reports/error-report-stats';
import type {
    ErrorReportStats,
    ErrorReportSummary,
} from '@/components/error-reports/error-report-types';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Error reports',
        href: '/admin/error-reports',
    },
];

const emptyStats: ErrorReportStats = {
    total: 0,
    unresolved: 0,
    resolved: 0,
    with_files: 0,
};

type AdminErrorReportsPageProps = {
    stats?: ErrorReportStats;
    reports?: ErrorReportSummary[];
};

export default function AdminErrorReportsPage({
    stats = emptyStats,
    reports = [],
}: AdminErrorReportsPageProps) {
    const { t } = useTranslation();
    const { flash } = usePage<Flash>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('error_reports.Error reports')} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t('error_reports.Error reports')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t(
                            'error_reports.Track user-submitted system problems and screenshots.',
                        )}
                    </p>
                </div>

                <ErrorReportStatsGrid stats={stats} />
                <ErrorReportList reports={reports} />
            </div>
        </AppLayout>
    );
}
