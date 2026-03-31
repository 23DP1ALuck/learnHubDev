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
import {JoinedOrg} from "@/components/dashboard/shared/joined-org";
import {useState} from "react";

export function NavUser() {
    const { auth, session } = usePage<SharedData>().props;
    console.log(session);
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    return (
        <SidebarMenu>
            <JoinedOrg organizations={auth.organizations} showList={open} onOpenChange={setOpen}/>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
                            data-test="sidebar-menu-button"
                        >
                            {auth.user.role === 'admin' ?
                                <UserInfo user={auth.user} showEmail={true}/> :
                                <UserInfo user={auth.user} showOrganization={true}  organization={session.activeOrganization ?? undefined}/>
                            }
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
                        <UserMenuContent user={auth.user} setOpen={setOpen} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
