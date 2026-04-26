import type { TeacherStudentTaskReview } from '@/components/teacher/student-assignment-types';
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
import { route } from 'ziggy-js';

type StudentTaskReviewCardProps = {
    task: TeacherStudentTaskReview;
    studentId: number;
};

function answerToText(answerText: string[]): string {
    if (answerText.length === 0) {
        return '-';
    }

    return answerText.join('\n');
}

export default function StudentTaskReviewCard({
    task,
    studentId,
}: StudentTaskReviewCardProps) {
    const { t } = useTranslation();

    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>
                    {t('teacher.Task #')}
                    {task.task_id}
                </CardTitle>
                <CardDescription>
                    {task.task_type.replace('_', ' ')} ·{' '}
                    {t('learning.Max points')} {task.max_points}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="space-y-4">
                    <div className="rounded-2xl border bg-muted/20 p-4">
                        <p className="text-sm font-medium text-muted-foreground">
                            {t('learning.Question')}
                        </p>
                        <p className="mt-2 whitespace-pre-wrap">
                            {task.question_text}
                        </p>
                    </div>

                    <div className="rounded-2xl border p-4">
                        <p className="text-sm font-medium text-muted-foreground">
                            {t('teacher.Student answer')}
                        </p>
                        <p className="mt-2 whitespace-pre-wrap">
                            {task.answer
                                ? answerToText(task.answer.answer_text)
                                : '-'}
                        </p>
                    </div>

                    {task.answer && task.answer.files.length > 0 ? (
                        <div className="rounded-2xl border p-4">
                            <p className="text-sm font-medium text-muted-foreground">
                                {t('learning.Linked files')}
                            </p>
                            <div className="mt-3 grid gap-2">
                                {task.answer.files.map((file) => (
                                    <span
                                        key={file.id}
                                        className="rounded-lg border px-3 py-2 text-sm"
                                    >
                                        {file.file_name || `#${file.id}`}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>

                <Form
                    action={route('teacher.assignments.students.tasks.grade', [
                        task.assignment_id,
                        studentId,
                        task.task_id,
                    ])}
                    method="patch"
                    className="grid content-start gap-4 rounded-2xl border p-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor={`points-${task.task_id}`}>
                                    {t('learning.Points')}
                                </Label>
                                <Input
                                    id={`points-${task.task_id}`}
                                    name="points"
                                    type="number"
                                    min="0"
                                    max={Number(task.max_points)}
                                    step="0.01"
                                    defaultValue={task.answer?.points ?? ''}
                                />
                                {errors.points ? (
                                    <p className="text-sm text-destructive">
                                        {errors.points}
                                    </p>
                                ) : null}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor={`comment-${task.task_id}`}>
                                    {t('teacher.Teacher comment')}
                                </Label>
                                <textarea
                                    id={`comment-${task.task_id}`}
                                    name="teacher_comment"
                                    defaultValue={
                                        task.answer?.teacher_comment ?? ''
                                    }
                                    rows={5}
                                    className="min-h-28 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                />
                                {errors.teacher_comment ? (
                                    <p className="text-sm text-destructive">
                                        {errors.teacher_comment}
                                    </p>
                                ) : null}
                            </div>

                            <Button
                                type="submit"
                                disabled={processing || !task.answer}
                            >
                                {t('teacher.Save grade')}
                            </Button>
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}
