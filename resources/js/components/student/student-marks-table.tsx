import type {
    StudentAssignmentSummary,
    StudentMarksStats,
} from '@/components/student/student-types';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import moment from 'moment';
type StudentMarksTableProps = {
    marks: StudentAssignmentSummary[];
    stats: StudentMarksStats;
};
function formatAverage(value: number | null): string {
    if (value === null || Number.isNaN(value)) {
        return 'No grades';
    }
    return `${Math.round(value)}%`;
}
export default function StudentMarksTable({
    marks,
    stats,
}: StudentMarksTableProps) {
    const { t } = useTranslation();

    return (
        <div className="grid min-w-0 gap-4">
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-sidebar-border/70">
                    <CardHeader className="pb-2">
                        <CardDescription>{t('common.Graded')}</CardDescription>
                        <CardTitle className="text-3xl">
                            {stats.graded}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-sidebar-border/70">
                    <CardHeader className="pb-2">
                        <CardDescription>
                            {t('common.Submitted')}
                        </CardDescription>
                        <CardTitle className="text-3xl">
                            {stats.submitted}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-sidebar-border/70">
                    <CardHeader className="pb-2">
                        <CardDescription>{t('common.Average')}</CardDescription>
                        <CardTitle className="text-3xl">
                            {formatAverage(stats.averagePercent)}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card className="min-w-0 border-sidebar-border/70">
                <CardHeader>
                    <CardTitle>{t('common.Marks')}</CardTitle>
                    <CardDescription>
                        {t('learning.Assignment results and grading status.')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="min-w-0">
                    {marks.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                            {t('student.No marks are available yet.')}
                        </div>
                    ) : (
                        <div className="w-full max-w-full touch-pan-x overflow-x-auto overscroll-x-contain">
                            <table className="min-w-max w-full text-sm">
                                <thead className="text-left text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            {t('learning.Assignment')}
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            {t('common.Status')}
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            {t('learning.Points')}
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            {t('common.Percent')}
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            {t('common.Submitted')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {marks.map((mark) => (
                                        <tr key={mark.id} className="border-t">
                                            <td className="px-4 py-3">
                                                {mark.title}
                                            </td>
                                            <td className="px-4 py-3">
                                                {mark.status}
                                            </td>
                                            <td className="px-4 py-3">
                                                {mark.total_points || '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {mark.total_percent
                                                    ? `${mark.total_percent}%`
                                                    : '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {mark.submitted_on
                                                    ? moment(
                                                          mark.submitted_on,
                                                      ).format('YYYY-MM-DD')
                                                    : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
