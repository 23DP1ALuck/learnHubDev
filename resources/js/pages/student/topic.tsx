import StudentAssignmentsList from '@/components/student/student-assignments-list';
import StudentTopicMaterialsList from '@/components/student/student-topic-materials-list';
import StudentTopicSummaryCard from '@/components/student/student-topic-summary';
import type { StudentAssignmentSummary, StudentMaterialSummary, StudentModuleSummary, StudentTopicSummary } from '@/components/student/student-types';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function StudentTopicPage({
    module,
    topic,
    materials,
    assignments,
}: {
    module: StudentModuleSummary;
    topic: StudentTopicSummary;
    materials: StudentMaterialSummary[];
    assignments: StudentAssignmentSummary[];
}) {
    const { flash } = usePage<Flash>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Modules',
            href: '/student/modules',
        },
        {
            title: module.name,
            href: `/module/${module.id}`,
        },
        {
            title: topic.name,
            href: `/module/${module.id}/topic/${topic.topic_id}`,
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

                <StudentTopicSummaryCard module={module} topic={topic} />

                <div className="grid gap-4 xl:grid-cols-2">
                    <StudentTopicMaterialsList materials={materials} />
                    <StudentAssignmentsList
                        assignments={assignments}
                        title="Assignments"
                        description="Assignments linked to this topic."
                    />
                </div>
            </div>
        </AppLayout>
    );
}
