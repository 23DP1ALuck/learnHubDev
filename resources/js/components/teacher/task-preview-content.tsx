import TaskInputPreview from '@/components/teacher/task-input-preview';
import type { TaskPreview, TaskType } from '@/components/teacher/task-preview-types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ListChecks, Sigma, Type } from 'lucide-react';

type TaskPreviewContentProps = {
    task: TaskPreview;
};

function getTaskTypeIcon(taskType: TaskType) {
    switch (taskType) {
        case 'TEXT':
            return Type;
        case 'NUMBER':
            return Sigma;
        case 'FILE':
            return FileText;
        default:
            return ListChecks;
    }
}

export default function TaskPreviewContent({ task }: TaskPreviewContentProps) {
    const TaskTypeIcon = getTaskTypeIcon(task.task_type);

    return (
        <Card className="border-sidebar-border/70 min-h-[28rem]">
            <CardHeader className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-2xl border bg-muted/40">
                            <TaskTypeIcon className="size-5" />
                        </span>
                        <div>
                            <CardTitle className="text-xl">Task #{task.task_id}</CardTitle>
                            <CardDescription>{task.task_type.replace('_', ' ')}</CardDescription>
                        </div>
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
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Student input preview</h2>
                        <p className="text-sm text-muted-foreground">{task.correct_answers.length > 0 ? 'Auto-check ready' : 'Manual review'}</p>
                    </div>
                    <TaskInputPreview task={task} />
                </div>
            </CardContent>
        </Card>
    );
}
