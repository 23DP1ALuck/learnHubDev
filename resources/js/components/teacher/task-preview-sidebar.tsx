import type { AssignmentPreview, TaskNavigationItem, TaskPreview } from '@/components/teacher/task-preview-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Clock3, Hash } from 'lucide-react';

type TaskPreviewSidebarProps = {
    assignment: AssignmentPreview;
    task: TaskPreview;
    taskNavigation: TaskNavigationItem[];
};

function getDueState(dueDate: string | null): { label: string; description: string } {
    if (!dueDate) {
        return {
            label: 'No limit',
            description: 'This preview has no configured due date.',
        };
    }

    const due = new Date(dueDate);

    if (Number.isNaN(due.getTime())) {
        return {
            label: 'Invalid date',
            description: 'The assignment due date could not be parsed.',
        };
    }

    const diffMs = due.getTime() - Date.now();

    if (diffMs <= 0) {
        return {
            label: 'Closed',
            description: `Due on ${due.toLocaleString()}`,
        };
    }

    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalDays = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;

    if (totalDays > 0) {
        return {
            label: `${totalDays}d ${remainingHours}h left`,
            description: `Due on ${due.toLocaleString()}`,
        };
    }

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const remainingMinutes = totalMinutes % 60;

    return {
        label: `${Math.max(totalHours, 0)}h ${Math.max(remainingMinutes, 0)}m left`,
        description: `Due on ${due.toLocaleString()}`,
    };
}

export default function TaskPreviewSidebar({ assignment, task, taskNavigation }: TaskPreviewSidebarProps) {
    const dueState = getDueState(assignment.due_date);

    return (
        <div className="grid gap-4">
            <Card className="border-sidebar-border/70">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock3 className="size-4" />
                        Time left
                    </CardTitle>
                    <CardDescription>{dueState.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="rounded-2xl border bg-muted/30 p-4">
                        <p className="text-3xl font-semibold tracking-tight">{dueState.label}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-2xl border p-3">
                            <p className="text-muted-foreground">Task type</p>
                            <p className="mt-1 font-medium">{task.task_type.replace('_', ' ')}</p>
                        </div>
                        <div className="rounded-2xl border p-3">
                            <p className="text-muted-foreground">Checks</p>
                            <p className="mt-1 font-medium">{task.correct_answers.length > 0 ? task.correct_answers.length : 'Manual'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-sidebar-border/70">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Hash className="size-4" />
                        Task navigation
                    </CardTitle>
                    <CardDescription>Preview the rest of the assignment from this task grid.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-3">
                        {taskNavigation.map((item) => {
                            const isCurrent = item.task_id === task.task_id;

                            return (
                                <Link
                                    key={item.task_id}
                                    className={`flex aspect-square items-center justify-center rounded-2xl border text-base font-semibold transition ${
                                        isCurrent
                                            ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                            : 'bg-background hover:border-primary/40 hover:bg-muted/40'
                                    }`}
                                    href={`/preview/${assignment.id}/task/${item.task_id}`}
                                >
                                    {item.task_id}
                                </Link>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
