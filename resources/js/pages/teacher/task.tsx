import TaskPreviewContent from '@/components/teacher/task-preview-content';
import TaskPreviewSidebar from '@/components/teacher/task-preview-sidebar';
import type {
    AssignmentPreview,
    TaskNavigationItem,
    TaskPreview,
} from '@/components/teacher/task-preview-types';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
export default function TeacherTaskPreviewPage({
    assignment,
    task,
    taskNavigation,
}: {
    assignment: AssignmentPreview;
    task: TaskPreview;
    taskNavigation: TaskNavigationItem[];
}) {
    const { t } = useTranslation();
    const { flash } = usePage<Flash>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Modules',
            href: route('teacher.modules'),
        },
        {
            title: assignment.title,
            href: route('teacher.assignments.show', assignment.id),
        },
        {
            title: `Preview task #${task.task_id}`,
            href: route('teacher.tasks.preview', [assignment.id, task.task_id]),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Preview task #${task.task_id}`} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <div className="flex justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {t('teacher.Preview task')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t('teacher.Teacher preview for')}{' '}
                            {assignment.title}
                            {t(
                                'teacher.. This page shows how the task is positioned inside the assignment flow.',
                            )}
                        </p>
                    </div>
                </div>

                <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,22rem)]">
                    <TaskPreviewContent task={task} />
                    <TaskPreviewSidebar
                        assignment={assignment}
                        task={task}
                        taskNavigation={taskNavigation}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
