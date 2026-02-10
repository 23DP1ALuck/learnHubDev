import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import {type BreadcrumbItem, OnboardingRequest, type SharedData} from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {RecentActivity} from "@/components/dashboard/admin/RecentActivity";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function AdminDashboard({onboardingRequests}: {onboardingRequests: OnboardingRequest[]}) {
    const { auth } = usePage<SharedData>().props;
    console.log(onboardingRequests);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <h2 className="text-lg font-semibold">Admin dashboard</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Welcome back, {auth.user.name}. You have admin access.
                    </p>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
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
                <div className="grid gap-4 md:grid-cols-6 ">
                    <div className="flex col-span-4 rounded-xl border border-sidebar-border/70">
                        <RecentActivity />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
