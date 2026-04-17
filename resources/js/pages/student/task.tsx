import StudentTaskContent from '@/components/student/student-task-content';
import StudentTaskSidebar from '@/components/student/student-task-sidebar';
import type { StudentTaskAssignment, StudentTaskNavigationItem, StudentTaskSummary } from '@/components/student/student-types';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function StudentTaskPage({
    moduleId,
    assignment,
    task,
    taskNavigation,
}: {
    moduleId: number;
    assignment: StudentTaskAssignment;
    task: StudentTaskSummary;
    taskNavigation: StudentTaskNavigationItem[];
}) {
    const { flash } = usePage<Flash>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Assignments',
            href: '/student/assignments',
        },
        {
            title: assignment.title,
            href: `/student/assignments/${assignment.id}/tasks/${task.task_id}`,
        },
        {
            title: `Task #${task.task_id}`,
            href: `/student/assignments/${assignment.id}/tasks/${task.task_id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Task #${task.task_id}`} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">{assignment.title}</h1>
                    <p className="text-sm text-muted-foreground">Task workspace for the student view.</p>
                </div>

                <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,22rem)]">
                    <StudentTaskContent task={task} />
                    <StudentTaskSidebar assignment={assignment} task={task} taskNavigation={taskNavigation} moduleId={moduleId}/>
                </div>
            </div>
        </AppLayout>
    );
}
