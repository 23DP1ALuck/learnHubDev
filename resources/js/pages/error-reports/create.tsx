import ErrorReportCreateForm from '@/components/error-reports/error-report-create-form';
import ErrorReportHelpCard from '@/components/error-reports/error-report-help-card';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Report issue',
        href: '/error-reports/create',
    },
];

export default function ErrorReportCreatePage() {
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
            <Head title={t('error_reports.Report issue')} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t('error_reports.Report issue')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t(
                            'error_reports.Send a system problem report to the platform administrator.',
                        )}
                    </p>
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
                    <ErrorReportCreateForm />
                    <ErrorReportHelpCard />
                </div>
            </div>
        </AppLayout>
    );
}
