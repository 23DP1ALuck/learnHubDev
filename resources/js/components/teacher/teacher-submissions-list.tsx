import type { TeacherSubmissionRow } from '@/components/teacher/teacher-submissions-types';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

type TeacherSubmissionsListProps = {
    submissions: TeacherSubmissionRow[];
};

function formatDate(value: string | null): string {
    if (!value) {
        return '-';
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    return parsed.toLocaleDateString();
}

export default function TeacherSubmissionsList({
    submissions,
}: TeacherSubmissionsListProps) {
    const { t } = useTranslation();

    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{t('teacher.Assignment submissions')}</CardTitle>
                <CardDescription>
                    {t('teacher.Submitted student assignments for review.')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {submissions.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        {t('teacher.No submissions found.')}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="text-left text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        {t('common.Student')}
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        {t('common.Group')}
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        {t('learning.Assignment')}
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        {t('learning.Module')}
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        {t('common.Status')}
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        {t('learning.Points')}
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        {t('common.Submitted')}
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        {t('common.Actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((submission) => (
                                    <tr
                                        key={`${submission.assignment_id}-${submission.student_id}`}
                                        className="border-t"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="font-medium">
                                                {submission.student_name}
                                            </div>
                                            {submission.student_email ? (
                                                <div className="text-xs text-muted-foreground">
                                                    {submission.student_email}
                                                </div>
                                            ) : null}
                                        </td>
                                        <td className="px-4 py-3">
                                            {submission.group_name || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {submission.assignment_title}
                                        </td>
                                        <td className="px-4 py-3">
                                            {submission.module_name || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {submission.status}
                                        </td>
                                        <td className="px-4 py-3">
                                            {submission.total_points || '-'}
                                            {submission.total_percent
                                                ? ` (${submission.total_percent}%)`
                                                : ''}
                                        </td>
                                        <td className="px-4 py-3">
                                            {formatDate(
                                                submission.submitted_on,
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button asChild variant="outline">
                                                <Link
                                                    href={route(
                                                        'teacher.assignments.students.show',
                                                        [
                                                            submission.assignment_id,
                                                            submission.student_id,
                                                        ],
                                                    )}
                                                >
                                                    {t(
                                                        'teacher.View submission',
                                                    )}
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
