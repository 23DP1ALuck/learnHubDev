import EditModuleForm from '@/components/teacher/edit-module-form';
import EditModuleOverview from '@/components/teacher/edit-module-overview';
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
    start_date: string | null;
    end_date: string | null;
    created_at: string | null;
};

type ModuleStats = {
    topics: number;
    materials: number;
    topic_assignments: number;
};

export default function TeacherEditModulePage({
    module,
    stats,
}: {
    module: ModuleSummary;
    stats: ModuleStats;
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
            title: 'Edit',
            href: route('teacher.modules.edit', module.id),
        },
    ];

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash?.success]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${module.name}`} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <EditModuleOverview module={module} stats={stats} />
                <EditModuleForm module={module} />
            </div>
        </AppLayout>
    );
}
