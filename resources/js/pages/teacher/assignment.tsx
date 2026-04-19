import AssignmentTaskCreate from '@/components/teacher/assignment-task-create';
import AssignmentTasksList from '@/components/teacher/assignment-tasks-list';
import AssignmentTopicsList from '@/components/teacher/assignment-topics-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import {Head, Link, usePage} from '@inertiajs/react';
import {preview} from "@/routes/teacher/tasks";
import {Button} from "@/components/ui/button";
import { route } from 'ziggy-js';

type AssignmentSummary = {
    id: number;
    title: string;
    description: string | null;
    grading_policy: string | null;
    due_date: string | null;
    created_at: string | null;
};

type AssignmentTopic = {
    module_id: number;
    module_name: string | null;
    topic_id: number;
    topic_name: string | null;
};

type TaskSummary = {
    assignment_id: number;
    task_id: number;
    question_text: string;
    task_type: string;
    max_points: string | number;
    correct_answers: string[];
    created_at: string | null;
};

export default function TeacherAssignmentPage({
    assignment,
    topics,
    tasks,
}: {
    assignment: AssignmentSummary;
    topics: AssignmentTopic[];
    tasks: TaskSummary[];
}) {
    const { flash } = usePage<Flash>().props;
    const primaryTopic = topics[0];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Modules',
            href: route('teacher.modules'),
        },
        ...(primaryTopic
            ? [
                  {
                      title: primaryTopic.module_name || `Module ${primaryTopic.module_id}`,
                      href: route('teacher.modules.show', primaryTopic.module_id),
                  },
                  {
                      title: primaryTopic.topic_name || `Topic ${primaryTopic.topic_id}`,
                      href: route('teacher.topics.show', [primaryTopic.module_id, primaryTopic.topic_id]),
                  },
              ]
            : []),
        {
            title: assignment.title,
            href: route('teacher.assignments.show', assignment.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={assignment.title} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <Card className="border-sidebar-border/70">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex flex-col gap-2">
                            <CardTitle>{assignment.title}</CardTitle>
                            <CardDescription>
                                {assignment.description || 'Add tasks to define the questions or submission requirements for this assignment.'}
                            </CardDescription>
                        </div>
                        <Link
                            href={preview([assignment.id, 1])}
                            className="flex items-center gap-2 self-center font-medium"
                        >
                            <Button variant="outline">Preview</Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-4">
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Tasks</p>
                            <p className="mt-1 text-3xl font-semibold">{tasks.length}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Grading policy</p>
                            <p className="mt-1 text-sm font-medium">{assignment.grading_policy || 'Not set'}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Due date</p>
                            <p className="mt-1 text-sm font-medium">{assignment.due_date || 'Not set'}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Topics</p>
                            <p className="mt-1 text-sm font-medium">{topics.length}</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(22rem,1fr)]">
                    <AssignmentTasksList tasks={tasks} />

                    <div className="space-y-4">
                        <AssignmentTaskCreate assignmentId={assignment.id} />
                        <AssignmentTopicsList topics={topics} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
