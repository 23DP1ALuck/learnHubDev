import Logo from '@/components/icons/Logo';
import { NavUser } from '@/components/nav-user';
import {
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    Sidebar as UISidebar,
} from '@/components/ui/sidebar';
import { useActiveUrl } from '@/hooks/use-active-url';
import { adminNavItems } from '@/layouts/app/navitems';
import { dashboard } from '@/routes';
import { Link } from '@inertiajs/react';
import { useTranslation } from '@/hooks/use-translation';
export function Sidebar() {
    const { urlIsActive } = useActiveUrl();
    const { t } = useTranslation();
    return (
        <UISidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <div className="flex w-full items-center group-data-[collapsible=icon]:justify-center">
                                    <Logo className="h-12 w-auto group-data-[collapsible=icon]:h-5" />
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    {adminNavItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={urlIsActive(
                                    item.href,
                                    undefined,
                                    true,
                                )}
                                tooltip={item.title}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span> {t(`common.${item.title}`)}</span>
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
