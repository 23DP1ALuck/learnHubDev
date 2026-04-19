import TeacherDashboardAssignments from '@/components/teacher/teacher-dashboard-assignments';
import TeacherDashboardModules from '@/components/teacher/teacher-dashboard-modules';
import TeacherDashboardOverview from '@/components/teacher/teacher-dashboard-overview';
import type {
    TeacherDashboardAssignment,
    TeacherDashboardModule,
    TeacherDashboardStats,
} from '@/components/teacher/teacher-dashboard-types';
import { JoinedOrg } from '@/components/shared/joined-org';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, Flash, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const emptyStats: TeacherDashboardStats = {
    modules: 0,
    topics: 0,
    materials: 0,
    assignments: 0,
    tasks: 0,
};

export default function TeacherDashboardPage({
    stats = emptyStats,
    recentModules = [],
    upcomingAssignments = [],
}: {
    stats?: TeacherDashboardStats;
    recentModules?: TeacherDashboardModule[];
    upcomingAssignments?: TeacherDashboardAssignment[];
}) {
    const { flash } = usePage<Flash>().props;
    const { auth } = usePage<SharedData>().props;
    const [open, onOpenChange] = useState<boolean>(flash?.afterLogin ?? false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teacher dashboard" />

            {flash?.afterLogin && auth.organizations.length > 1 && (
                <JoinedOrg
                    organizations={auth.organizations}
                    showList={open}
                    onOpenChange={onOpenChange}
                    currentOrganization={auth.currentOrganization}
                />
            )}

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <Card className="border-sidebar-border/70">
                    <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                            <CardTitle>Teacher dashboard</CardTitle>
                            <CardDescription>
                                Overview of modules, topics, materials, assignments, and tasks in the active organization.
                            </CardDescription>
                        </div>
                        <Button asChild>
                            <Link href={route('teacher.modules')}>Open workspace</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Use this page as the entry point into your teaching workspace. The detail pages still handle the actual
                        content creation and editing flow.
                    </CardContent>
                </Card>

                <TeacherDashboardOverview stats={stats} />

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                    <TeacherDashboardModules modules={recentModules} />
                    <TeacherDashboardAssignments assignments={upcomingAssignments} />
                </div>
            </div>
        </AppLayout>
    );
}
