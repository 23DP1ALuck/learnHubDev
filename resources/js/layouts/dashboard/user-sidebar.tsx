import { NavUser } from '@/components/nav-user';
import {
    Sidebar as UISidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useActiveUrl } from '@/hooks/use-active-url';
import { dashboard } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import Logo from '@/components/icons/Logo';
import {userNavItems} from "@/layouts/dashboard/navitems";
export function Sidebar() {
    const { urlIsActive } = useActiveUrl();

    return (
        <UISidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <div className="flex w-full items-center group-data-[collapsible=icon]:justify-center">
                                    <Logo className="h-12 w-auto group-data-[collapsible=icon]:h-5"/>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    {userNavItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={urlIsActive(item.href, undefined, true)}
                                tooltip={item.title}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </UISidebar>
    );
}
