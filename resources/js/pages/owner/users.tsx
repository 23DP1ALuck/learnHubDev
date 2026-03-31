import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import {organization as ownerOrganization, organizations, users as ownerUsers} from '@/routes';
import type { BreadcrumbItem, Organization, OrganizationMember, OrganizationStats } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organization',
        href: ownerOrganization().url,
    },
    {
        title: 'Users',
        href: ownerUsers().url,
    },
];

const memberStatusTone: Record<OrganizationMember['status'], 'default' | 'secondary' | 'outline'> = {
    active: 'default',
    invited: 'secondary',
    disabled: 'outline',
};

export default function OwnerUsersPage({
    organization,
    stats,
    members,
}: {
    organization: Organization;
    stats: OrganizationStats;
    members: OrganizationMember[];
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Organization users" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="border-sidebar-border/70">
                    <CardHeader>
                        <CardTitle>{organization.organization_name} users</CardTitle>
                        <CardDescription>
                            Teachers, students, and owners currently attached to this organization.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-4">
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Total members</p>
                            <p className="mt-1 text-3xl font-semibold">{stats.members}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Teachers</p>
                            <p className="mt-1 text-3xl font-semibold">{stats.teachers}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Students</p>
                            <p className="mt-1 text-3xl font-semibold">{stats.students}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Pending invites</p>
                            <p className="mt-1 text-3xl font-semibold">{stats.pending_invites}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-sidebar-border/70">
                    <CardHeader>
                        <CardTitle>Members</CardTitle>
                        <CardDescription>Current organization roster.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border">
                            <table className="min-w-full divide-y">
                                <thead className="bg-muted/50 text-left text-sm">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Name</th>
                                        <th className="px-4 py-3 font-medium">Email</th>
                                        <th className="px-4 py-3 font-medium">Role</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-sm">
                                    {members.map((member) => (
                                        <tr key={member.id}>
                                            <td className="px-4 py-3 font-medium">{member.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{member.email}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant="secondary">{member.role_in_org}</Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={memberStatusTone[member.status]}>{member.status}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {member.joined_on ? new Date(member.joined_on).toLocaleDateString() : 'Not set'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
