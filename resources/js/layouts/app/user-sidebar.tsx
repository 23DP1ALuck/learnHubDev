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
import { Auth, NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import Logo from '@/components/icons/Logo';
import { dashboard as ownerDashboard } from '@/routes';
import { individualOwnerNavItems, schoolOwnerNavItems, studentNavItems, teacherNavItems, userNavItems } from '@/layouts/app/navitems';

function setNavItems(auth: Auth) {
    if (auth.canManageOrganization) {
        if (auth.currentOrganization?.organization_type === 'individual') {
            return individualOwnerNavItems;
        }
        return schoolOwnerNavItems;
    }

    if (auth.organizationRole === 'TEACHER') {
        return teacherNavItems;
    }

    if (auth.organizationRole === 'STUDENT') {
        return studentNavItems;
    }

    return userNavItems;
}

export function Sidebar() {
    const { urlIsActive } = useActiveUrl();
    const { auth } = usePage<SharedData>().props;
    const navItems = setNavItems(auth);
    const homeHref = auth.canManageOrganization
        ? ownerDashboard()
        : auth.organizationRole === 'STUDENT'
          ? '/student/dashboard'
          : dashboard();

    return (
        <UISidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeHref} prefetch>
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
                    {navItems.map((item) => {
                        if(!item.embedItems){
                            return(
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
                            );
                        }
                        return <div className="flex flex-col" key={item.title}>
                            <SidebarMenuItem>
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
                            {item.embedItems.map((innerItem: NavItem) =>(
                                <SidebarMenuItem key={innerItem.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={urlIsActive(innerItem.href, undefined, false)}
                                        tooltip={innerItem.title}
                                        className="px-4"
                                    >
                                        <Link href={innerItem.href} prefetch>
                                            {innerItem.icon && <innerItem.icon />}
                                            <span>{innerItem.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </div>



                })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </UISidebar>
    );
}
