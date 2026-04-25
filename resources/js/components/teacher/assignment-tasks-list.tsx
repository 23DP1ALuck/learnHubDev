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
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
type TaskSummary = {
    assignment_id: number;
    task_id: number;
    question_text: string;
    task_type: string;
    max_points: string | number;
    correct_answers: string[];
    created_at: string | null;
};
type AssignmentTasksListProps = {
    tasks: TaskSummary[];
};
export default function AssignmentTasksList({
    tasks,
}: AssignmentTasksListProps) {
    const { t } = useTranslation();
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{t('learning.Tasks')}</CardTitle>
                <CardDescription>
                    {t(
                        'teacher.Tasks are managed only inside the assignment workspace, which matches the documentation hierarchy.',
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {tasks.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        {t(
                            'teacher.No tasks yet. Add the first question or submission requirement for this assignment.',
                        )}
                    </div>
                ) : (
                    tasks.map((task, index) => (
                        <div
                            key={task.task_id}
                            className="rounded-xl border p-4"
                        >
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-semibold">
                                            {t('teacher.Task #')}
                                            {index + 1}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {task.question_text}
                                        </p>
                                    </div>
                                    <Badge variant="secondary">
                                        {task.task_type}
                                    </Badge>
                                </div>
                                {task.correct_answers.length > 0 && (
                                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                        <span>
                                            {t('teacher.Max points:')}{' '}
                                            {task.max_points}
                                        </span>
                                        <span>
                                            Grading:{' '}
                                            {task.correct_answers.length > 0
                                                ? t('teacher.Auto-check ready')
                                                : t('teacher.Manual review')}
                                        </span>
                                    </div>
                                )}

                                {task.correct_answers.length > 0 ? (
                                    <div className="flex items-end justify-between">
                                        <div className="flex flex-wrap gap-2">
                                            {task.correct_answers.map(
                                                (answer, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="outline"
                                                        className="h-6"
                                                    >
                                                        {answer}
                                                    </Badge>
                                                ),
                                            )}
                                        </div>

                                        <Link
                                            href={route(
                                                'teacher.tasks.editTask',
                                                [
                                                    task.assignment_id,
                                                    task.task_id,
                                                ],
                                            )}
                                        >
                                            <Button variant={'outline'}>
                                                {t('common.Edit')}
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-end justify-between">
                                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                            <span>
                                                {t('teacher.Max points:')}{' '}
                                                {task.max_points}
                                            </span>
                                            <span>
                                                Grading:{' '}
                                                {task.correct_answers.length > 0
                                                    ? t(
                                                          'teacher.Auto-check ready',
                                                      )
                                                    : t(
                                                          'teacher.Manual review',
                                                      )}
                                            </span>
                                        </div>
                                        <Link
                                            href={route(
                                                'teacher.tasks.editTask',
                                                [
                                                    task.assignment_id,
                                                    task.task_id,
                                                ],
                                            )}
                                        >
                                            <Button variant={'outline'}>
                                                {t('common.Edit')}
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
