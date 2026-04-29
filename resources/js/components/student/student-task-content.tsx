import type { StudentTaskSummary } from '@/components/student/student-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/use-translation';
import { Form } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {AddAnswerFile} from "@/components/student/student-add-answer-file";
type StudentTaskContentProps = {
    assignmentId: number;
    task: StudentTaskSummary;
};
export default function StudentTaskContent({
    assignmentId,
    task,
}: StudentTaskContentProps) {
    const { t } = useTranslation();
    const isAnswered = task.answer !== null && task.answer !== undefined;
    const selectedAnswers = Array.isArray(task.answer) // for next comparing logic
        ? task.answer
        : [task.answer];
    return (
        <Card className="min-h-[28rem] border-sidebar-border/70">
            <CardHeader className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <CardTitle className="text-xl">
                            {t('student.Task #')}
                            {task.task_id}
                        </CardTitle>
                        <CardDescription>
                            {task.task_type.replace('_', ' ')}
                        </CardDescription>
                    </div>
                    <Badge variant="secondary">{task.max_points} pts</Badge>
                </div>
            </CardHeader>

            <CardContent className="grid gap-6">
                <div className="rounded-3xl border bg-card p-6">
                    <p className="text-base leading-7 whitespace-pre-wrap text-foreground/90">
                        {task.question_text || 'Task content is empty.'}
                    </p>
                </div>

                <Form
                    key={task.task_id}
                    action={route('student.answers.store', [
                        assignmentId,
                        task.task_id,
                    ])}
                    method="post"
                    className="space-y-4"
                >
                    <input
                        type="hidden"
                        name="task_type"
                        value={task.task_type}
                    />

                    <h2 className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                        {t('student.Your answer')}
                    </h2>

                    {task.task_type === 'TEXT' && (
                        <textarea
                            name="answer_text[]"
                            className="min-h-40 w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none"
                            placeholder={t(
                                'student.Students type their answer here.',
                            )}
                            defaultValue={selectedAnswers[0] ?? ''}
                            disabled={isAnswered}
                        />
                    )}

                    {task.task_type === 'NUMBER' && (
                        <Input
                            name="answer_text[]"
                            placeholder={t(
                                'student.Students enter a numeric answer here.',
                            )}
                            type="number"
                            defaultValue={selectedAnswers[0] ?? ''}
                            disabled={isAnswered}
                        />
                    )}

                    {task.task_type === 'TRUE_FALSE' && (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {['TRUE', 'FALSE'].map((value) => (
                                <label
                                    key={value}
                                    className="flex items-center gap-3 rounded-2xl border p-4"
                                >
                                    <input
                                        name="answer_text[]"
                                        value={value}
                                        type="radio"
                                        defaultChecked={
                                            selectedAnswers[0] === value
                                        }
                                        disabled={isAnswered}
                                    />
                                    <span className="font-medium">{value}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {(task.task_type === 'CHECKBOX' ||
                        task.task_type === 'CUSTOM_SELECT') && (
                        <div className="space-y-3">
                            {task.options.length === 0 ? (
                                <div className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
                                    {t('common.No options configured yet.')}
                                </div>
                            ) : (
                                task.options.map((option) => (
                                    <label
                                        key={option.option_id}
                                        className="flex items-center gap-3 rounded-2xl border p-4"
                                    >
                                        <input
                                            name={'answer_text[]'}
                                            value={option.option_text}
                                            type={
                                                task.task_type === 'CHECKBOX'
                                                    ? 'checkbox'
                                                    : 'radio'
                                            }
                                            defaultChecked={selectedAnswers.includes(
                                                option.option_text,
                                            )}
                                            disabled={isAnswered}
                                        />
                                        <span>{option.option_text}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    )}

                    {task.task_type === 'FILE' && (
                        <AddAnswerFile assignmentId={assignmentId} taskId={task.task_id}/>
                    )}

                    {!task.answer && (
                        <div className="flex justify-end">
                            <Button type="submit">
                                {t('student.Submit answer')}
                            </Button>
                        </div>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}
