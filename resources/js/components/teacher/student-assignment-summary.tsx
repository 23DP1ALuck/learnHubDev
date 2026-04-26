import type {
    TeacherStudentAssignment,
    TeacherStudentInfo,
    TeacherStudentSubmission,
} from '@/components/teacher/student-assignment-types';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';

type StudentAssignmentSummaryProps = {
    assignment: TeacherStudentAssignment;
    student: TeacherStudentInfo;
    submission: TeacherStudentSubmission;
};

function formatValue(value: string | number | null): string {
    if (value === null || value === '') {
        return '-';
    }

    return String(value);
}

export default function StudentAssignmentSummary({
    assignment,
    student,
    submission,
}: StudentAssignmentSummaryProps) {
    const { t } = useTranslation();

    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{assignment.title}</CardTitle>
                <CardDescription>
                    {assignment.description || t('common.No description')}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl border p-4">
                    <p className="text-sm text-muted-foreground">
                        {t('common.Student')}
                    </p>
                    <p className="mt-1 font-medium">
                        {student.name || student.email || '-'}
                    </p>
                </div>
                <div className="rounded-2xl border p-4">
                    <p className="text-sm text-muted-foreground">
                        {t('learning.Module')}
                    </p>
                    <p className="mt-1 font-medium">{assignment.module.name}</p>
                </div>
                <div className="rounded-2xl border p-4">
                    <p className="text-sm text-muted-foreground">
                        {t('common.Status')}
                    </p>
                    <p className="mt-1 font-medium">{submission.status}</p>
                </div>
                <div className="rounded-2xl border p-4">
                    <p className="text-sm text-muted-foreground">
                        {t('learning.Points')}
                    </p>
                    <p className="mt-1 font-medium">
                        {formatValue(submission.total_points)} /{' '}
                        {assignment.max_points}
                    </p>
                </div>
                <div className="rounded-2xl border p-4">
                    <p className="text-sm text-muted-foreground">
                        {t('common.Percent')}
                    </p>
                    <p className="mt-1 font-medium">
                        {submission.total_percent
                            ? `${submission.total_percent}%`
                            : '-'}
                    </p>
                </div>
                <div className="rounded-2xl border p-4">
                    <p className="text-sm text-muted-foreground">
                        {t('common.Submitted')}
                    </p>
                    <p className="mt-1 font-medium">
                        {submission.submitted_on || '-'}
                    </p>
                </div>
                <div className="rounded-2xl border p-4 md:col-span-2">
                    <p className="text-sm text-muted-foreground">
                        {t('learning.Grading policy')}
                    </p>
                    <p className="mt-1 font-medium">
                        {assignment.grading_policy || t('common.Not set')}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
