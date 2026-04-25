import StudentModuleSummaryCard from '@/components/student/student-module-summary';
import StudentModuleTopicsList from '@/components/student/student-module-topics-list';
import type {
    StudentModuleSummary,
    StudentTopicSummary,
} from '@/components/student/student-types';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function StudentModulePage({
    module,
    topics,
}: {
    module: StudentModuleSummary;
    topics: StudentTopicSummary[];
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

                <StudentModuleSummaryCard module={module} />
                <StudentModuleTopicsList moduleId={module.id} topics={topics} />
            </div>
        </AppLayout>
    );
}
