import { DeleteModule } from '@/components/teacher/delete-module';
import ModuleTopicsCreate from '@/components/teacher/module-topics-create';
import ModuleTopicsList from '@/components/teacher/module-topics-list';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
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
    const { t } = useTranslation();
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
    ];
    const deleteModuleInfo = {
        id: module.id,
        name: module.name,
    };
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash?.success]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={module.name} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <Card className="h-[30dvh] border-sidebar-border/70">
                    <CardHeader>
                        <CardTitle>{module.name}</CardTitle>
                        <div className="flex justify-between">
                            <CardDescription>
                                {module.description ||
                                    'Add topics to break this module into concrete learning units.'}
                            </CardDescription>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" asChild>
                                    <Link
                                        href={route(
                                            'teacher.modules.edit',
                                            module.id,
                                        )}
                                    >
                                        {t('common.Edit')}
                                    </Link>
                                </Button>
                                <DeleteModule module={deleteModuleInfo} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-5">
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">
                                {t('learning.Topics')}
                            </p>
                            <p className="mt-1 text-3xl font-semibold">
                                {stats.topics}
                            </p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">
                                {t('learning.Materials')}
                            </p>
                            <p className="mt-1 text-3xl font-semibold">
                                {stats.materials}
                            </p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">
                                {t('learning.Assignments')}
                            </p>
                            <p className="mt-1 text-3xl font-semibold">
                                {stats.topic_assignments}
                            </p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">
                                Start
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {module.start_date || t('common.Not set')}
                            </p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">End</p>
                            <p className="mt-1 text-sm font-medium">
                                {module.end_date || t('common.Not set')}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid h-[50dvh] gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(22rem,0.9fr)]">
                    <ModuleTopicsList moduleId={module.id} topics={topics} />
                    <ModuleTopicsCreate moduleId={module.id} />
                </div>
            </div>
        </AppLayout>
    );
}
