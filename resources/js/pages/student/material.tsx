import StudentMaterialContext from '@/components/student/student-material-context';
import StudentMaterialFilesList from '@/components/student/student-material-files-list';
import type {
    StudentMaterialFileSummary,
    StudentMaterialSummary,
    StudentModuleSummary,
    StudentTopicSummary,
} from '@/components/student/student-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function StudentMaterialPage({
    module,
    topic,
    material,
    files,
}: {
    module: StudentModuleSummary;
    topic: StudentTopicSummary;
    material: StudentMaterialSummary;
    files: StudentMaterialFileSummary[];
}) {
    const { flash } = usePage<Flash>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Modules',
            href: route('student.modules'),
        },
        {
            title: module.name,
            href: route('student.modules.show', module.id),
        },
        {
            title: topic.name,
            href: route('student.topics.show', [module.id, topic.topic_id]),
        },
        {
            title: material.title,
            href: route('student.materials.show', [module.id, topic.topic_id, material.material_id]),
        },
    ];

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
                            {material.description || 'Open the linked files below to view the material resources.'}
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
                    <StudentMaterialFilesList files={files} />
                    <StudentMaterialContext module={module} topic={topic} />
                </div>
            </div>
        </AppLayout>
    );
}
