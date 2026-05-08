import type { ErrorReportSummary } from '@/components/error-reports/error-report-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Form, Link } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { route } from 'ziggy-js';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';


type ErrorReportListProps = {
    reports: ErrorReportSummary[];
};

function formatDate(value: string | null): string {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
}

export default function ErrorReportList({ reports }: ErrorReportListProps) {
    const { t } = useTranslation();
    console.log('reports', reports);
    const [open, setOpen] = useState(false);
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{t('error_reports.Submitted reports')}</CardTitle>
                <CardDescription>
                    {t(
                        'error_reports.Review user reports and open attached files when needed.',
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {reports.length === 0 ? (
                    <div className="rounded-2xl border border-dashed p-10 text-center">
                        <FileText className="mx-auto size-8 text-muted-foreground" />
                        <h3 className="mt-4 font-semibold">
                            {t('error_reports.No reports found')}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {t(
                                'error_reports.When users submit system issues, they will appear here.',
                            )}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {reports.map((report) => (
                            <article
                                key={report.error_id}
                                className="rounded-2xl border p-4"
                            >
                                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold">
                                                #{report.error_id}
                                            </h3>
                                            <Badge
                                                variant={
                                                    report.resolved_at
                                                        ? 'secondary'
                                                        : 'destructive'
                                                }
                                            >
                                                {report.resolved_at
                                                    ? t(
                                                          'error_reports.Resolved',
                                                      )
                                                    : t(
                                                          'error_reports.Unresolved',
                                                      )}
                                            </Badge>
                                            {report.files.length > 0 ? (
                                                <Badge variant="outline">
                                                    {report.files.length}{' '}
                                                    {t('error_reports.files')}
                                                </Badge>
                                            ) : null}
                                        </div>
                                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                                            {report.report_text}
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-sm text-muted-foreground lg:text-right">
                                        <p className="font-medium text-foreground">
                                            {report.user.name}
                                        </p>
                                        <p>{report.user.email}</p>
                                        <p className="mt-2">
                                            {formatDate(report.created_at)}
                                        </p>
                                    </div>
                                </div>

                                {report.files.length > 0 ? (
                                    <div className="mt-4 flex flex-wrap gap-2 justify-between">
                                        {report.files.map((file) => (
                                            <Button
                                                key={file.id}
                                                asChild
                                                size="sm"
                                                variant="outline"
                                            >
                                                <a
                                                    href={route('download-error-file', [
                                                        report.error_id,
                                                        report.user.id,
                                                        file.id,
                                                    ])}
                                                >
                                                    {file.file_name}
                                                </a>
                                            </Button>
                                        ))}
                                        {!report.resolved_at &&
                                        <Dialog open={open} onOpenChange={setOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="default" className="bg-green-400 hover:bg-green-400/70">
                                                    Mark as completed
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>

                                                    <Form action={route('admin.error-reports.update-status', report.error_id)} method={"PATCH"} onSubmit={() => setOpen(false)}>
                                                        {({processing}) => {
                                                            return <>
                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        {t('error_reports.Mark report as completed?')}
                                                                    </DialogTitle>
                                                                    <DialogDescription>
                                                                        {t(
                                                                            'error_reports.This will mark the report as resolved. You can use this after the issue has been checked or fixed.',
                                                                        )}
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter>
                                                                    <Button variant="outline" disabled={processing}>
                                                                        {t('common.Cancel')}
                                                                    </Button>
                                                                    <Button>
                                                                        {t('error_reports.Mark as completed')}
                                                                    </Button>
                                                                </DialogFooter>
                                                            </>
                                                        }}
                                                    </Form>
                                            </DialogContent>
                                        </Dialog>
                                        }
                                    </div>
                                ) : null}
                            </article>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
