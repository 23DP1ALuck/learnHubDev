import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { Sidebar as DashboardSidebar } from '@/layouts/app/user-sidebar';
import {type BreadcrumbItem, SharedData, User} from '@/types';
import { type PropsWithChildren } from 'react';
import {usePage} from "@inertiajs/react";
import {Sidebar} from "@/layouts/app/admin-sidebar";

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const {auth} = usePage<SharedData>().props;
    return (
        <AppShell variant="sidebar">
            {auth?.user.role === 'admin' ? <Sidebar/> : <DashboardSidebar/>}
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div className="flex flex-1 flex-col">
                    {children}
                </div>
            </AppContent>
        </AppShell>
    );
}
