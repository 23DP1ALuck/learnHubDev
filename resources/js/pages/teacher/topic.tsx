import TopicAssignmentCreate from '@/components/teacher/topic-assignment-create';
import TopicAssignmentsList from '@/components/teacher/topic-assignments-list';
import TopicMaterialCreate from '@/components/teacher/topic-material-create';
import TopicMaterialsList from '@/components/teacher/topic-materials-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {DeleteTopic} from "@/components/teacher/delete-topic";

type ModuleSummary = {
    id: number;
    name: string;
    description: string | null;
};

type TopicSummary = {
    topic_id: number;
    module_id: number;
    name: string;
    description: string | null;
    created_at: string | null;
};

type TopicOption = {
    topic_id: number;
    module_id: number;
    name: string;
};

type MaterialSummary = {
    material_id: number;
    title: string;
    description: string | null;
    created_at: string | null;
};

type AssignmentSummary = {
    id: number;
    title: string;
    description: string | null;
    grading_policy: string | null;
    due_date: string | null;
    tasks_count: number;
    created_at: string | null;
};

export default function TeacherTopicPage({
    module,
    topic,
    materials,
    assignments,
    moduleTopics,
}: {
    module: ModuleSummary;
    topic: TopicSummary;
    materials: MaterialSummary[];
    assignments: AssignmentSummary[];
    moduleTopics: TopicOption[];
}) {
    const { flash } = usePage<Flash>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Modules',
            href: route('teacher.modules'),
        },
        {
            title: module.name,
            href: route('teacher.modules.show', module.id),
        },
        {
            title: topic.name,
            href: route('teacher.topics.show', [module.id, topic.topic_id]),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={topic.name} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <Card className="border-sidebar-border/70">
                    <CardHeader>
                        <CardTitle>{topic.name}</CardTitle>
                        <div className="flex justify-between">
                            <CardDescription>
                                {topic.description || 'This topic contains the learning materials and assignments students work through.'}
                            </CardDescription>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" asChild>
                                    <Link href={route('teacher.topics.edit', [module.id, topic.topic_id])}>Edit</Link>
                                </Button>
                                <DeleteTopic topic={{topic_id: topic.topic_id, module_id: module.id, name: topic.name}}/>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Materials</p>
                            <p className="mt-1 text-3xl font-semibold">{materials.length}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Assignments</p>
                            <p className="mt-1 text-3xl font-semibold">{assignments.length}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Module</p>
                            <p className="mt-1 text-sm font-medium">{module.name}</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 xl:grid-cols-2">
                    <TopicMaterialCreate moduleId={module.id} topicId={topic.topic_id} />
                    <TopicAssignmentCreate availableTopics={moduleTopics} moduleId={module.id} topicId={topic.topic_id} />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <TopicMaterialsList moduleId={module.id} topicId={topic.topic_id} materials={materials} />
                    <TopicAssignmentsList assignments={assignments} />
                </div>
            </div>
        </AppLayout>
    );
}
