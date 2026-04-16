import StudentAssignmentsList from '@/components/student/student-assignments-list';
import StudentDashboardModules from '@/components/student/student-dashboard-modules';
import StudentDashboardOverview from '@/components/student/student-dashboard-overview';
import type { StudentAssignmentSummary, StudentDashboardStats, StudentModuleSummary } from '@/components/student/student-types';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Student dashboard',
        href: '/student/dashboard',
    },
];

export default function StudentDashboardPage({
    stats,
    modules,
    upcomingAssignments,
}: {
    stats: StudentDashboardStats;
    modules: StudentModuleSummary[];
    upcomingAssignments: StudentAssignmentSummary[];
}) {
    const { flash } = usePage<Flash>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student dashboard" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Student dashboard</h1>
                    <p className="text-sm text-muted-foreground">Overview of modules, assignments, and current progress in the active organization.</p>
                </div>

                <StudentDashboardOverview stats={stats} />

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,1fr)]">
                    <StudentAssignmentsList
                        assignments={upcomingAssignments}
                        title="Upcoming assignments"
                        description="Assignments ordered by due date so the student can see what is coming next."
                    />
                    <StudentDashboardModules modules={modules} />
                </div>
            </div>
        </AppLayout>
    );
}
