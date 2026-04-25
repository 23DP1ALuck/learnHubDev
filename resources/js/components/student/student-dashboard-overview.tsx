import type { StudentDashboardStats } from '@/components/student/student-types';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
type StudentDashboardOverviewProps = {
    stats: StudentDashboardStats;
};
function formatAverage(value: number | null): string {
    if (value === null || Number.isNaN(value)) {
        return 'No grades';
    }
    return `${Math.round(value)}%`;
}
export default function StudentDashboardOverview({
    stats,
}: StudentDashboardOverviewProps) {
    const { t } = useTranslation();
    return (
        <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>{t('learning.Modules')}</CardDescription>
                    <CardTitle className="text-3xl">{stats.modules}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    {t(
                        'student.Learning spaces currently available in the active organization.',
                    )}
                </CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>
                        {t('learning.Assignments')}
                    </CardDescription>
                    <CardTitle className="text-3xl">
                        {stats.assignments}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    {t(
                        'student.Assignments connected to the modules you can work through now.',
                    )}
                </CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>{t('common.Pending')}</CardDescription>
                    <CardTitle className="text-3xl">{stats.pending}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    {t(
                        'student.Assignments that are not submitted or graded yet.',
                    )}
                </CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>
                        {t('student.Average mark')}
                    </CardDescription>
                    <CardTitle className="text-3xl">
                        {formatAverage(stats.averagePercent)}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    {t(
                        'student.Average percent across graded work in this organization.',
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
