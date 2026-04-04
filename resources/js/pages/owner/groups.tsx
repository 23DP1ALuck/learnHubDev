import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type {BreadcrumbItem, Organization, OrganizationGroup, OrganizationStats, SharedData, User} from '@/types';
import {Head, usePage} from '@inertiajs/react';
import {CreateGroups} from "@/components/org_owner/create-groups";
import {Button} from "@/components/ui/button";
import {AssignStudents} from "@/components/org_owner/assign-students";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organization',
        href: '/organization',
    },
    {
        title: 'Groups',
        href: '/organization/groups',
    },
];

export default function OwnerGroupsPage({
    organization,
    stats,
    groups,
    students
}: {
    organization: Organization;
    stats: OrganizationStats;
    groups: OrganizationGroup[];
    students: User[]
}) {
    const totalAssignedStudents = groups.reduce((sum, group) => sum + group.students_count, 0);
    const totalAssignedTeachers = groups.reduce((sum, group) => sum + group.teachers_count, 0);
    const {auth, session} = usePage<SharedData>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Organization groups" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="border-sidebar-border/70">
                    <CardHeader>
                        <CardTitle>{organization.organization_name} groups</CardTitle>
                        <CardDescription>
                            School groups available for assigning students, teachers, and modules.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-4">
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Total groups</p>
                            <p className="mt-1 text-3xl font-semibold">{stats.school_groups}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Assigned students</p>
                            <p className="mt-1 text-3xl font-semibold">{totalAssignedStudents}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Assigned teachers</p>
                            <p className="mt-1 text-3xl font-semibold">{totalAssignedTeachers}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Pending invites</p>
                            <p className="mt-1 text-3xl font-semibold">{stats.pending_invites}</p>
                        </div>
                    </CardContent>
                </Card>
                <CreateGroups org={session.activeOrganization}/>
                <Card className="border-sidebar-border/70">
                    <CardHeader>
                        <CardTitle>Group list</CardTitle>
                        <CardDescription>A simple overview of your current school groups.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {groups.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                                No groups yet. Add your first school group from the backend flow when ready.
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border">
                                <table className="min-w-full divide-y">
                                    <thead className="bg-muted/50 text-left text-sm">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Group</th>
                                            <th className="px-4 py-3 font-medium">Students</th>
                                            <th className="px-4 py-3 font-medium">Teachers</th>
                                            <th className="px-4 py-3 font-medium">Modules</th>
                                            <th className="px-4 py-3 font-medium">Created</th>
                                            <th className="py-3 font-medium"></th>{/*placeholder*/}

                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-sm">
                                        {groups.map((group) => (
                                            <tr key={group.group_id}>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <p className="font-medium">{group.name}</p>
                                                        <Badge variant="secondary">#{group.group_id}</Badge>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">{group.students_count}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{group.teachers_count}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{group.modules_count}</td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {group.created_at ? new Date(group.created_at).toLocaleDateString() : 'Unknown'}
                                                </td>
                                                <td className="text-center py-3 text-muted-foreground">
                                                    <AssignStudents group={group} students={students}/>
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
