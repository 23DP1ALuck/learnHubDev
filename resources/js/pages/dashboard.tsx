import { JoinedOrg } from '@/components/shared/joined-org';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Flash, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];
export default function Dashboard() {
    const { t } = useTranslation();
    const { flash } = usePage<Flash>().props;
    const { auth } = usePage<SharedData>().props;
    console.log('QQ', auth.currentOrganization);
    const [open, onOpenChange] = useState<boolean>(flash?.afterLogin ?? false);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('common.Dashboard')} />
            {flash?.afterLogin && auth.organizations.length > 1 && (
                <JoinedOrg
                    organizations={auth.organizations}
                    showList={open}
                    onOpenChange={onOpenChange}
                    currentOrganization={auth.currentOrganization}
                />
            )}
            <div className="flex min-h-0 flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[24rem] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-0 dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
