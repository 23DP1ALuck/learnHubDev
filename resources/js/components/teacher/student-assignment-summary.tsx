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
import {
    Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader,
    DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@inertiajs/react';
import { route } from 'ziggy-js';

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
                <div className="flex justify-between">
                    <div className="flex flex-col gap-1">
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription>
                            {assignment.description || t('common.No description')}
                        </CardDescription>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                                <Button variant={"outline"}>
                                    {t('common.Mark as graded')}
                                </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {t('common.Mark submission as graded?')}
                                </DialogTitle>
                                <DialogDescription>
                                    {t(
                                        'common.This will mark the student submission as graded. Make sure all task points have been checked before continuing.',
                                    )}
                                </DialogDescription>
                            </DialogHeader>
                            <Form action="/" method="patch">
                                {({ processing }) => (
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline">
                                                {t('common.Cancel')}
                                            </Button>
                                        </DialogClose>
                                        <Button type="submit" disabled={processing}>
                                            {processing
                                                ? t('common.Saving...')
                                                : t('common.Confirm grading')}
                                        </Button>
                                    </DialogFooter>
                                )}
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

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
