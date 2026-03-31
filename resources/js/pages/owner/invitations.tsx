import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useClipboard } from '@/hooks/use-clipboard';
import AppLayout from '@/layouts/app-layout';
import {invitations as ownerInvitations, organization as ownerOrganization} from '@/routes';
import { store as storeInvitation } from '@/routes/invitations';
import type { BreadcrumbItem, Flash, Organization, OrganizationInvite, OrganizationStats, OrganizationRole, SharedData } from '@/types';
import { Form, Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organization',
        href: ownerOrganization().url,
    },
    {
        title: 'Invitations',
        href: ownerInvitations().url,
    },
];

const inviteStatusTone: Record<OrganizationInvite['status'], 'default' | 'secondary' | 'outline'> = {
    pending: 'default',
    used: 'secondary',
    expired: 'outline',
};

export default function OwnerInvitationsPage({
    organization,
    stats,
    invites,
    roleOptions,
}: {
    organization: Organization;
    stats: OrganizationStats;
    invites: OrganizationInvite[];
    roleOptions: Array<{ value: Extract<OrganizationRole, 'TEACHER' | 'STUDENT'>; label: string }>;
}) {
    const { flash } = usePage<Flash & SharedData>().props;
    const [, copy] = useClipboard();
    const [roleInOrg, setRoleInOrg] = useState<Extract<OrganizationRole, 'TEACHER' | 'STUDENT'> | ''>('');
    const lastInviteUrlRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (!flash?.invite_url || flash.invite_url === lastInviteUrlRef.current) {
            return;
        }

        lastInviteUrlRef.current = flash.invite_url;

        toast('Invite link created', {
            description: flash.invite_url,
            action: {
                label: 'Copy',
                onClick: () => copy(flash.invite_url as string),
            },
        });
    }, [copy, flash?.invite_url]);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.error, flash?.success]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Organization invitations" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="border-sidebar-border/70">
                    <CardHeader>
                        <CardTitle>Invite members to {organization.organization_name}</CardTitle>
                        <CardDescription>
                            Send a secure invite link to a teacher or student. The recipient can join with the email you specify here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...storeInvitation.form()} resetOnSuccess={['first_name', 'last_name', 'email']} className="grid gap-4 md:grid-cols-2">
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="first_name">First name</Label>
                                        <Input id="first_name" name="first_name" placeholder="Jane" />
                                        <InputError message={errors.first_name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="last_name">Last name</Label>
                                        <Input id="last_name" name="last_name" placeholder="Doe" />
                                        <InputError message={errors.last_name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" name="email" type="email" placeholder="teacher@example.com" />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="role_in_org">Role</Label>
                                        <input type="hidden" name="role_in_org" value={roleInOrg} />
                                        <Select value={roleInOrg} onValueChange={(value) => setRoleInOrg(value as Extract<OrganizationRole, 'TEACHER' | 'STUDENT'>)}>
                                            <SelectTrigger id="role_in_org">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roleOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.role_in_org} />
                                    </div>
                                    <div className="md:col-span-2 flex items-center justify-between rounded-lg border bg-muted/20 p-4">
                                        <div>
                                            <p className="font-medium">Pending invites</p>
                                            <p className="text-sm text-muted-foreground">
                                                {stats.pending_invites} invite{stats.pending_invites === 1 ? '' : 's'} still waiting for acceptance.
                                            </p>
                                        </div>
                                        <Button type="submit" disabled={processing}>
                                            {processing && <Spinner />}
                                            Send invite
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                <Card className="border-sidebar-border/70">
                    <CardHeader>
                        <CardTitle>Invite history</CardTitle>
                        <CardDescription>Every teacher/student invite sent from this organization owner workspace.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border">
                            <table className="min-w-full divide-y">
                                <thead className="bg-muted/50 text-left text-sm">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Recipient</th>
                                        <th className="px-4 py-3 font-medium">Role</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Expires</th>
                                        <th className="px-4 py-3 font-medium">Invited by</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-sm">
                                    {invites.map((invite) => (
                                        <tr key={invite.id}>
                                            <td className="px-4 py-3">
                                                <p className="font-medium">
                                                    {[invite.first_name, invite.last_name].filter(Boolean).join(' ') || invite.email}
                                                </p>
                                                <p className="text-muted-foreground">{invite.email}</p>
                                            </td>
                                            <td className="px-4 py-3">{invite.role_in_org ?? 'Unknown'}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant={inviteStatusTone[invite.status]}>{invite.status}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {invite.expires_at ? new Date(invite.expires_at).toLocaleString() : 'No expiry'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{invite.inviter_name ?? 'Unknown'}</td>
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
