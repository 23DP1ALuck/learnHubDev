import StudentAssignmentsList from '@/components/student/student-assignments-list';
import type { StudentAssignmentSummary } from '@/components/student/student-types';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Assignments',
        href: route('student.assignments'),
    },
];

export default function StudentAssignmentsPage({ assignments }: { assignments: StudentAssignmentSummary[] }) {
    const { flash } = usePage<Flash>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student assignments" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Assignments</h1>
                    <p className="text-sm text-muted-foreground">Open an assignment to review its details and then start the task flow.</p>
                </div>

                <StudentAssignmentsList assignments={assignments} />
            </div>
        </AppLayout>
    );
}
