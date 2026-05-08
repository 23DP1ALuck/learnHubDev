import type { ErrorReportStats } from '@/components/error-reports/error-report-types';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { CheckCircle2, FileImage, Inbox, TriangleAlert } from 'lucide-react';

type ErrorReportStatsProps = {
    stats: ErrorReportStats;
};

export default function ErrorReportStatsGrid({ stats }: ErrorReportStatsProps) {
    const { t } = useTranslation();
    const items = [
        {
            label: t('common.Total'),
            value: stats.total,
            icon: Inbox,
        },
        {
            label: t('error_reports.Unresolved'),
            value: stats.unresolved,
            icon: TriangleAlert,
        },
        {
            label: t('error_reports.Resolved'),
            value: stats.resolved,
            icon: CheckCircle2,
        },
        {
            label: t('error_reports.With files'),
            value: stats.with_files,
            icon: FileImage,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
                <Card key={item.label} className="border-sidebar-border/70">
                    <CardContent className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {item.label}
                            </p>
                            <p className="mt-2 text-3xl font-semibold">
                                {item.value}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-muted p-3">
                            <item.icon className="size-5 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
