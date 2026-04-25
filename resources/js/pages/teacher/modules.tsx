import ModulesCreate from '@/components/teacher/modules-create';
import ModulesList from '@/components/teacher/modules-list';
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
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
type TeacherModule = {
    id: number;
    name: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    topics_count: number;
    created_at: string | null;
};
type ContentStats = {
    modules: number;
    topics: number;
    materials: number;
    assignments: number;
    tasks: number;
};
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Modules',
        href: route('teacher.modules'),
    },
];
export default function TeacherModulesPage({
    stats,
    modules,
}: {
    stats: ContentStats;
    modules: TeacherModule[];
}) {
    const { t } = useTranslation();
    const { flash } = usePage<Flash>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('teacher.Teacher modules')} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <Card className="border-sidebar-border/70">
                    <CardHeader>
                        <CardTitle>
                            {t('learning.Learning workspace')}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                'teacher.Start with modules, then build topics inside them. Materials and assignments live on the topic level, and tasks live inside assignments.',
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-5">
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">
                                {t('learning.Modules')}
                            </p>
                            <p className="mt-1 text-3xl font-semibold">
                                {stats.modules}
                            </p>
                        </div>
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
                                {stats.assignments}
                            </p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">
                                {t('learning.Tasks')}
                            </p>
                            <p className="mt-1 text-3xl font-semibold">
                                {stats.tasks}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid h-[60dvh] gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(22rem,0.9fr)]">
                    <ModulesList modules={modules} />
                    <ModulesCreate />
                </div>
            </div>
        </AppLayout>
    );
}
