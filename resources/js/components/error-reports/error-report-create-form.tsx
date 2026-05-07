import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { Form } from '@inertiajs/react';
import { Bug, Upload } from 'lucide-react';
import { route } from 'ziggy-js';

export default function ErrorReportCreateForm() {
    const { t } = useTranslation();

    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Bug className="size-5" />
                    {t('error_reports.Report a system issue')}
                </CardTitle>
                <CardDescription>
                    {t(
                        'error_reports.Describe what happened and attach screenshots if they help explain the problem.',
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form
                    action={route('error-reports.store')}
                    method="post"
                    encType="multipart/form-data"
                    resetOnSuccess={['report_text', 'file']}
                    className="grid gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="report_text">
                                    {t('error_reports.Problem description')}
                                </Label>
                                <textarea
                                    id="report_text"
                                    name="report_text"
                                    rows={8}
                                    placeholder={t(
                                        'error_reports.Explain where the issue happened, what you expected, and what happened instead.',
                                    )}
                                    className="min-h-44 w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm transition outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                />
                                <InputError message={errors.report_text} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="file">
                                    {t('error_reports.Attach screenshots')}
                                </Label>
                                <div className="rounded-xl border border-dashed bg-muted/20 p-4">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <Upload className="size-4" />
                                            <span>
                                                {t(
                                                    'error_reports.PNG, JPG, PDF or other useful files.',
                                                )}
                                            </span>
                                        </div>
                                        <Input
                                            id="file"
                                            name="file"
                                            type="file"
                                            multiple
                                            className="sm:max-w-xs"
                                        />
                                    </div>
                                </div>
                                <InputError
                                    message={errors.file}
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? t('common.Sending...')
                                        : t('error_reports.Send report')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}
