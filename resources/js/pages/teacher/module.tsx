import ModuleTopicsCreate from '@/components/teacher/module-topics-create';
import ModuleTopicsList from '@/components/teacher/module-topics-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';

type ModuleSummary = {
    id: number;
    name: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    created_at: string | null;
};

type TopicSummary = {
    topic_id: number;
    module_id: number;
    name: string;
    description: string | null;
    materials_count: number;
    assignments_count: number;
    created_at: string | null;
};

type ModuleStats = {
    topics: number;
    materials: number;
    topic_assignments: number;
};

export default function TeacherModulePage({
    module,
    stats,
    topics,
}: {
    module: ModuleSummary;
    stats: ModuleStats;
    topics: TopicSummary[];
}) {
    const { flash } = usePage<Flash>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Modules',
            href: '/modules',
        },
        {
            title: module.name,
            href: `/modules/${module.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={module.name} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <Card className="border-sidebar-border/70 h-[30dvh]">
                    <CardHeader>
                        <CardTitle>{module.name}</CardTitle>
                        <CardDescription>
                            {module.description || 'Add topics to break this module into concrete learning units.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-5">
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Topics</p>
                            <p className="mt-1 text-3xl font-semibold">{stats.topics}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Materials</p>
                            <p className="mt-1 text-3xl font-semibold">{stats.materials}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Assignments</p>
                            <p className="mt-1 text-3xl font-semibold">{stats.topic_assignments}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Start</p>
                            <p className="mt-1 text-sm font-medium">{module.start_date || 'Not set'}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">End</p>
                            <p className="mt-1 text-sm font-medium">{module.end_date || 'Not set'}</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(22rem,0.9fr)] h-[50dvh]">
                    <ModuleTopicsList moduleId={module.id} topics={topics} />
                    <ModuleTopicsCreate moduleId={module.id} />
                </div>
            </div>
        </AppLayout>
    );
}
