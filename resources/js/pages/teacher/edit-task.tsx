import EditTaskForm from '@/components/teacher/edit-task-form';
import type { AssignmentSummary, TaskSummary } from '@/components/teacher/edit-task-types';
import AppLayout from '@/layouts/app-layout';
import { modules } from '@/routes/teacher';
import { editTask } from '@/routes/teacher/tasks';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

function EditTask({ assignment, task }: { assignment: AssignmentSummary; task: TaskSummary }) {
    const primaryTopic = assignment.topics[0];
    console.log(primaryTopic)
    const { flash } = usePage<Flash>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Modules',
            href: modules().url,
        },
        ...(primaryTopic
            ? [
                  {
                      title: primaryTopic.module_name || `Module ${primaryTopic.module_id}`,
                      href: route('teacher.modules.show', primaryTopic.module_id),
                  },
                  {
                      title: primaryTopic.name || `Topic ${primaryTopic.topic_id}`,
                      href: route('teacher.topics.show', [primaryTopic.module_id, primaryTopic.topic_id]),
                  },
              ]
            : []),
        {
            title: assignment.title,
            href: route('teacher.assignments.show', assignment.id),
        },
        {
            title: 'Edit task',
            href: editTask([assignment.id, task.task_id]).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit task" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <EditTaskForm assignment={assignment} task={task} />
            </div>
        </AppLayout>
    );
}

export default EditTask;
