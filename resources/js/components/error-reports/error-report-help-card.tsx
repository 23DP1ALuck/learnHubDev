import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { CheckCircle2 } from 'lucide-react';

export default function ErrorReportHelpCard() {
    const { t } = useTranslation();

    return (
        <Card className="border-sidebar-border/70 bg-muted/20">
            <CardHeader>
                <CardTitle className="text-lg">
                    {t('error_reports.What to include')}
                </CardTitle>
                <CardDescription>
                    {t(
                        'error_reports.A good report helps the administrator reproduce the issue faster.',
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-3 text-sm">
                    {[
                        t('error_reports.Page or module where it happened.'),
                        t('error_reports.What you clicked or submitted.'),
                        t(
                            'error_reports.What error message or wrong behavior you saw.',
                        ),
                        t('error_reports.Attach a screenshot when possible.'),
                    ].map((item) => (
                        <div key={item} className="flex gap-3">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                            <span className="text-muted-foreground">
                                {item}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
