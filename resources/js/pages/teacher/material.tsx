import MaterialContext from '@/components/teacher/material-context';
import MaterialFilesList from '@/components/teacher/material-files-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';
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
};

type MaterialSummary = {
    material_id: number;
    module_id: number;
    topic_id: number;
    title: string;
    description: string | null;
    created_at: string | null;
};

type MaterialFileSummary = {
    id: number;
    module_id: number;
    topic_id: number;
    material_id: number;
    file_id: number;
    file: {
        file_name: string;
        file_path: string | null;
    };
};

export default function TeacherMaterialPage({
    module,
    topic,
    material,
    files,
}: {
    module: ModuleSummary;
    topic: TopicSummary;
    material: MaterialSummary;
    files: MaterialFileSummary[];
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
            title: material.title,
            href: route('teacher.materials.show', [module.id, topic.topic_id, material.material_id]),
        },
    ];

    const materialContext: Record<string, number> = {
        module_id: topic.module_id,
        topic_id: topic.topic_id,
        material_id: material.material_id,
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={material.title} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <Card className="border-sidebar-border/70">
                    <CardHeader>
                        <CardTitle>{material.title}</CardTitle>
                        <CardDescription>
                            {material.description || 'Use this page to review the material details and the files linked to it.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-4">
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Files</p>
                            <p className="mt-1 text-3xl font-semibold">{files.length}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Material ID</p>
                            <p className="mt-1 text-sm font-medium">#{material.material_id}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Topic</p>
                            <p className="mt-1 text-sm font-medium">{topic.name}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Module</p>
                            <p className="mt-1 text-sm font-medium">{module.name}</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(22rem,1fr)]">
                    <MaterialFilesList files={files} materialContext={materialContext}/>
                    <MaterialContext module={module} topic={topic} />
                </div>
            </div>
        </AppLayout>
    );
}
