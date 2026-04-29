import { InviteCsvReviewCard } from '@/components/org_owner/invite-csv-review-card';
import type { ParsedCsvUser } from '@/components/org_owner/invite-csv-types';
import { InviteCsvUploadCard } from '@/components/org_owner/invite-csv-upload-card';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import {
    invitations as ownerInvitations,
    organization as ownerOrganization,
} from '@/routes';
import { inviteCsv } from '@/routes/invitations';
import type { BreadcrumbItem, Organization } from '@/types';
import { Head } from '@inertiajs/react';

type InviteCsvPageProps = {
    organization: Organization;
    users?: ParsedCsvUser[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organization',
        href: ownerOrganization().url,
    },
    {
        title: 'Invitations',
        href: ownerInvitations().url,
    },
    {
        title: 'CSV import',
        href: inviteCsv().url,
    },
];

const roleOptions = ['STUDENT', 'TEACHER'];
const statusOptions = ['active', 'pending', 'disabled'];

export default function OwnerInviteCsvPage({
    organization,
    users = [],
}: InviteCsvPageProps) {
    const { t } = useTranslation();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('owner.Import users from CSV')} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <InviteCsvUploadCard
                    organization={organization}
                />
                <InviteCsvReviewCard
                    roleOptions={roleOptions}
                    statusOptions={statusOptions}
                    users={users}
                />
            </div>
        </AppLayout>
    );
}
