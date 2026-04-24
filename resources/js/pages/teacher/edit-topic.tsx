import EditTopicForm from '@/components/teacher/edit-topic-form';
import EditTopicOverview from '@/components/teacher/edit-topic-overview';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

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

type TopicStats = {
    materials: number;
    assignments: number;
    module_name: string;
};

export default function TeacherEditTopicPage({
    module,
    topic,
    stats,
}: {
    module: ModuleSummary;
    topic: TopicSummary;
    stats: TopicStats;
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
        {
            title: 'Edit',
            href: route('teacher.topics.edit', [module.id, topic.topic_id]),
        },
    ];

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash?.success]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${topic.name}`} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <EditTopicOverview stats={stats} />
                <EditTopicForm topic={topic} />
            </div>
        </AppLayout>
    );
}
