import TaskInputPreview from '@/components/teacher/task-input-preview';
import type {
    TaskPreview,
    TaskType,
} from '@/components/teacher/task-preview-types';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { FileText, ListChecks, Sigma, Type } from 'lucide-react';
type TaskPreviewContentProps = {
    task: TaskPreview;
};
function TaskTypeIcon({
    taskType,
    className,
}: {
    taskType: TaskType;
    className?: string;
}) {
    switch (taskType) {
        case 'TEXT':
            return <Type className={className} />;
        case 'NUMBER':
            return <Sigma className={className} />;
        case 'FILE':
            return <FileText className={className} />;
        default:
            return <ListChecks className={className} />;
    }
}
export default function TaskPreviewContent({ task }: TaskPreviewContentProps) {
    const { t } = useTranslation();
    return (
        <Card className="min-h-[28rem] border-sidebar-border/70">
            <CardHeader className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-2xl border bg-muted/40">
                            <TaskTypeIcon
                                taskType={task.task_type}
                                className="size-5"
                            />
                        </span>
                        <div>
                            <CardTitle className="text-xl">
                                {t('teacher.Task #')}
                                {task.task_id}
                            </CardTitle>
                            <CardDescription>
                                {task.task_type.replace('_', ' ')}
                            </CardDescription>
                        </div>
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

                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                            {t('common.Student input preview')}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {task.correct_answers.length > 0
                                ? t('teacher.Auto-check ready')
                                : t('teacher.Manual review')}
                        </p>
                    </div>
                    <TaskInputPreview task={task} />
                </div>
            </CardContent>
        </Card>
    );
}
