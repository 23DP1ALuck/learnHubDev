import StudentMarksTable from '@/components/student/student-marks-table';
import type { StudentAssignmentSummary, StudentMarksStats } from '@/components/student/student-types';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Marks',
        href: '/student/marks',
    },
];

export default function StudentMarksPage({
    marks,
    stats,
}: {
    marks: StudentAssignmentSummary[];
    stats: StudentMarksStats;
}) {
    const { flash } = usePage<Flash>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student marks" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Marks</h1>
                    <p className="text-sm text-muted-foreground">Submitted and graded results for the active organization.</p>
                </div>

                <StudentMarksTable marks={marks} stats={stats} />
            </div>
        </AppLayout>
    );
}
