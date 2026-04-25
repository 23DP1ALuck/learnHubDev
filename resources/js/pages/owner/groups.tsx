import { AssignModules } from '@/components/org_owner/assign-modules';
import { AssignStudents } from '@/components/org_owner/assign-students';
import { CreateGroups } from '@/components/org_owner/create-groups';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import type {
    BreadcrumbItem,
    Organization,
    OrganizationGroup,
    OrganizationModule,
    OrganizationStats,
    User,
} from '@/types';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organization',
        href: route('organization'),
    },
    {
        title: 'Groups',
        href: route('groups'),
    },
];
type OrganizationSummary = OrganizationModule & {
    teacher_name: string;
};
export default function OwnerGroupsPage({
    organization,
    stats,
    groups,
    students,
    modules,
}: {
    organization: Organization;
    stats: OrganizationStats;
    groups: OrganizationGroup[];
    students: User[];
    modules: OrganizationSummary[];
}) {
    const { t } = useTranslation();
    const totalAssignedStudents = groups.reduce(
        (sum, group) => sum + group.students_count,
        0,
    );
    const totalAssignedTeachers = groups.reduce(
        (sum, group) => sum + group.teachers_count,
        0,
    );
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('owner.Organization groups')} />

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden rounded-xl p-4">
                <Card className="shrink-0 border-sidebar-border/70">
                    <CardHeader>
                        <CardTitle>
                            {organization.organization_name} groups
                        </CardTitle>
                        <CardDescription>
                            {t(
                                'owner.School groups available for assigning students, teachers, and modules.',
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-4">
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">
                                {t('owner.Total groups')}
                            </p>
                            <p className="mt-1 text-3xl font-semibold">
                                {stats.school_groups}
                            </p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">
                                {t('owner.Assigned students')}
                            </p>
                            <p className="mt-1 text-3xl font-semibold">
                                {totalAssignedStudents}
                            </p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">
                                {t('owner.Assigned teachers')}
                            </p>
                            <p className="mt-1 text-3xl font-semibold">
                                {totalAssignedTeachers}
                            </p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">
                                {t('owner.Pending invites')}
                            </p>
                            <p className="mt-1 text-3xl font-semibold">
                                {stats.pending_invites}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <div className="shrink-0">
                    <CreateGroups org={organization} />
                </div>
                <Card className="flex min-h-0 flex-1 flex-col border-sidebar-border/70">
                    <CardHeader className="shrink-0">
                        <CardTitle>{t('owner.Group list')}</CardTitle>
                        <CardDescription>
                            {t(
                                'owner.A simple overview of your current school groups.',
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex min-h-0 flex-1 flex-col">
                        {groups.length === 0 ? (
                            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                                {t(
                                    'owner.No groups yet. Add your first school group from the backend flow when ready.',
                                )}
                            </div>
                        ) : (
                            <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto rounded-lg border">
                                <table className="min-w-full divide-y">
                                    <thead className="sticky top-0 z-10 bg-gray-100 text-left text-sm">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">
                                                {t('owner.Group')}
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                {t('common.Students')}
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                {t('common.Teachers')}
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                {t('learning.Modules')}
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                {t('common.Created')}
                                            </th>
                                            <th
                                                colSpan={2}
                                                className="border-l border-black/20 py-3 text-center font-medium"
                                            >
                                                {t('common.Actions')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-sm">
                                        {groups.map((group) => (
                                            <tr key={group.group_id}>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <p className="font-medium">
                                                            {group.name}
                                                        </p>
                                                        <Badge variant="secondary">
                                                            #{group.group_id}
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {group.students_count}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {group.teachers_count}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {group.modules_count}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {group.created_at
                                                        ? new Date(
                                                              group.created_at,
                                                          ).toLocaleDateString()
                                                        : 'Unknown'}
                                                </td>
                                                <td className="border-l border-black/20 py-3 text-center text-muted-foreground">
                                                    <AssignStudents
                                                        group={group}
                                                        students={students}
                                                    />
                                                </td>
                                                <td className="py-3 text-center text-muted-foreground">
                                                    <AssignModules
                                                        group={group}
                                                        modules={modules}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
