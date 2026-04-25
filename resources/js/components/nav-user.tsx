import { JoinedOrg } from '@/components/shared/joined-org';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import {useTranslation} from "@/hooks/use-translation";

export function NavUser() {
    const {t} = useTranslation();
    console.log(t('common.Create'));
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    return (
        <SidebarMenu>
            {auth.organizations.length > 1 && (
                <JoinedOrg
                    organizations={auth.organizations}
                    showList={open}
                    onOpenChange={setOpen}
                    currentOrganization={auth.currentOrganization}
                />
            )}
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
                            data-test="sidebar-menu-button"
                        >
                            {auth.user.role === 'admin' ? (
                                <UserInfo user={auth.user} showEmail={true} />
                            ) : (
                                <UserInfo
                                    user={auth.user}
                                    showOrganization={true}
                                    organizationName={
                                        auth.currentOrganization
                                            ?.organization_name ?? undefined
                                    }
                                />
                            )}
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'left'
                                  : 'bottom'
                        }
                    >
                        {auth.organizations.length > 1 ? (
                            <UserMenuContent
                                user={auth.user}
                                setOpen={setOpen}
                                showChangeOption={true}
                            />
                        ) : (
                            <UserMenuContent
                                user={auth.user}
                                showChangeOption={false}
                            />
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
