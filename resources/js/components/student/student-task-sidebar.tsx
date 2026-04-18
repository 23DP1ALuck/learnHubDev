import type { StudentTaskAssignment, StudentTaskNavigationItem, StudentTaskSummary } from '@/components/student/student-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Clock3, Hash } from 'lucide-react';
import { route } from 'ziggy-js';

type StudentTaskSidebarProps = {
    assignment: StudentTaskAssignment;
    task: StudentTaskSummary;
    taskNavigation: StudentTaskNavigationItem[];
    moduleId: number;
};

function dueStateLabel(dueDate: string | null): string {
    if (!dueDate) {
        return 'No limit';
    }

    const due = new Date(dueDate);
    if (Number.isNaN(due.getTime())) {
        return 'Invalid date';
    }

    const diffMs = due.getTime() - Date.now();
    if (diffMs <= 0) {
        return 'Closed';
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (days > 0) {
        return `${days}d ${remainingHours}h left`;
    }

    const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
    return `${Math.max(hours, 0)}h ${Math.max(minutes, 0)}m left`;
}

export default function StudentTaskSidebar({ assignment, task, taskNavigation, moduleId }: StudentTaskSidebarProps) {
    return (
        <div className="grid gap-4">
            <Card className="border-sidebar-border/70">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock3 className="size-4" />
                        Assignment status
                    </CardTitle>
                    <CardDescription>{assignment.title}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="rounded-2xl border bg-muted/30 p-4">
                        <p className="text-3xl font-semibold tracking-tight">{dueStateLabel(assignment.due_date)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-2xl border p-3">
                            <p className="text-muted-foreground">Status</p>
                            <p className="mt-1 font-medium">{assignment.status}</p>
                        </div>
                        <div className="rounded-2xl border p-3">
                            <p className="text-muted-foreground">Points</p>
                            <p className="mt-1 font-medium">{task.max_points}</p>
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
                    <CardDescription>Move between tasks in the same assignment.</CardDescription>
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
                                            ? 'border-primary bg-primary text-primary-foreground shadow-sm' :
                                            (item.is_completed ? 'bg-muted-foreground/20 hover:border-primary/40' : 'bg-background hover:border-primary/40 hover:bg-muted/40')
                                    }`}
                                    href={route('student.tasks.show', [assignment.id, item.task_id])}
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
