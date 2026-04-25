import { JoinedOrg } from '@/components/shared/joined-org';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import {
    dashboard as ownerDashboard,
    invitations as ownerInvitations,
    organization as ownerOrganization,
    users as ownerUsers,
} from '@/routes';
import type {
    BreadcrumbItem,
    Flash,
    Organization,
    OrganizationInvite,
    OrganizationMember,
    OrganizationStats,
    SharedData,
} from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organization dashboard',
        href: ownerDashboard().url,
    },
];
const statLabels: Record<keyof OrganizationStats, string> = {
    members: 'Members',
    teachers: 'Teachers',
    students: 'Students',
    school_groups: 'Groups',
    pending_invites: 'Pending invites',
};
const inviteStatusTone: Record<
    OrganizationInvite['status'],
    'default' | 'secondary' | 'outline'
> = {
    pending: 'default',
    used: 'secondary',
    expired: 'outline',
};
export default function OwnerDashboard({
    organization,
    stats,
    latestMembers,
    latestInvites,
}: {
    organization: Organization;
    stats: OrganizationStats;
    latestMembers: OrganizationMember[];
    latestInvites: OrganizationInvite[];
}) {
    const { t } = useTranslation();
    const { flash } = usePage<Flash>().props;
    const { auth } = usePage<SharedData>().props;
    if (flash?.afterLogin) {
        console.log(auth.organizations);
    }
    console.log(auth.currentOrganization);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('owner.Organization dashboard')} />
            {flash?.afterLogin && auth.organizations.length > 1 && (
                <JoinedOrg
                    organizations={auth.organizations}
                    showList={true}
                    currentOrganization={auth.currentOrganization}
                />
            )}
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="border-sidebar-border/70">
                    <CardHeader>
                        <CardTitle>{organization.organization_name}</CardTitle>
                        <CardDescription>
                            {t('owner.Owner workspace for your')}{' '}
                            {organization.organization_type === 'school'
                                ?  t('owner.'+'For school')
                                : t('owner.'+'For org')}
                            .
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3">
                        <Button asChild>
                            <Link href={ownerUsers()}>
                                {t('common.Manage users')}
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={ownerInvitations()}>
                                {t('owner.Send invitations')}
                            </Link>
                        </Button>
                        <Button asChild variant="secondary">
                            <Link href={ownerOrganization()}>
                                {t('owner.View organization')}
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-5">
                    {Object.entries(stats).map(([key, value]) => (
                        <Card key={key} className="border-sidebar-border/70">
                            <CardHeader className="gap-3">
                                <CardDescription>
                                    {statLabels[key as keyof OrganizationStats]}
                                </CardDescription>
                                <CardTitle className="text-3xl">
                                    {value}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <Card className="border-sidebar-border/70">
                        <CardHeader>
                            <CardTitle>{t('owner.Latest members')}</CardTitle>
                            <CardDescription>
                                {t(
                                    'owner.Recent people added to your organization.',
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {latestMembers.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    {t('owner.No members yet.')}
                                </p>
                            ) : (
                                latestMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {member.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {member.email}
                                            </p>
                                        </div>
                                        <Badge variant="secondary">
                                            {member.role_in_org}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border/70">
                        <CardHeader>
                            <CardTitle>
                                {t('owner.Recent invitations')}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'owner.Track whether teacher and student invites were accepted.',
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {latestInvites.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    {t('owner.No invitations sent yet.')}
                                </p>
                            ) : (
                                latestInvites.map((invite) => (
                                    <div
                                        key={invite.id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {[
                                                    invite.first_name,
                                                    invite.last_name,
                                                ]
                                                    .filter(Boolean)
                                                    .join(' ') || invite.email}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {invite.email}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                inviteStatusTone[invite.status]
                                            }
                                        >
                                            {invite.status}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
