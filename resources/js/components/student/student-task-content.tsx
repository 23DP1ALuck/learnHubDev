import type { StudentTaskSummary } from '@/components/student/student-types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type StudentTaskContentProps = {
    task: StudentTaskSummary;
};

export default function StudentTaskContent({ task }: StudentTaskContentProps) {
    return (
        <Card className="border-sidebar-border/70 min-h-[28rem]">
            <CardHeader className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <CardTitle className="text-xl">Task #{task.task_id}</CardTitle>
                        <CardDescription>{task.task_type.replace('_', ' ')}</CardDescription>
                    </div>
                    <Badge variant="secondary">{task.max_points} pts</Badge>
                </div>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="rounded-3xl border bg-card p-6">
                    <p className="whitespace-pre-wrap text-base leading-7 text-foreground/90">
                        {task.question_text || 'Task content is empty.'}
                    </p>
                </div>

                <div className="space-y-3">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Answer preview</h2>

                    {task.task_type === 'TEXT' && (
                        <textarea
                            className="min-h-40 w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none"
                            disabled
                            placeholder="Students type their answer here."
                        />
                    )}

                    {task.task_type === 'NUMBER' && (
                        <Input disabled placeholder="Students enter a numeric answer here." type="number" />
                    )}

                    {task.task_type === 'TRUE_FALSE' && (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {['TRUE', 'FALSE'].map((value) => (
                                <label key={value} className="flex items-center gap-3 rounded-2xl border p-4 opacity-80">
                                    <input disabled name="student-true-false" readOnly type="radio" />
                                    <span className="font-medium">{value}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {(task.task_type === 'CHECKBOX' || task.task_type === 'CUSTOM_SELECT') && (
                        <div className="space-y-3">
                            {task.options.length === 0 ? (
                                <div className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">No options configured yet.</div>
                            ) : (
                                task.options.map((option) => (
                                    <label key={option.option_id} className="flex items-center gap-3 rounded-2xl border p-4 opacity-80">
                                        <input
                                            disabled
                                            name={`student-option-${task.task_type}`}
                                            readOnly
                                            type={task.task_type === 'CHECKBOX' ? 'checkbox' : 'radio'}
                                        />
                                        <span>{option.option_text}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    )}

                    {task.task_type === 'FILE' && (
                        <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                            File upload tasks are reviewed manually. The student upload area will be shown here later.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
