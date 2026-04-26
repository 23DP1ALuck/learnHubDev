import Logo from '@/components/icons/Logo';
import { NavUser } from '@/components/nav-user';
import {
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    Sidebar as UISidebar,
} from '@/components/ui/sidebar';
import { useActiveUrl } from '@/hooks/use-active-url';
import { useTranslation } from '@/hooks/use-translation';
import {
    individualOwnerNavItems,
    schoolOwnerNavItems,
    studentNavItems,
    teacherNavItems,
    userNavItems,
} from '@/layouts/app/navitems';
import { dashboard, dashboard as ownerDashboard } from '@/routes';
import { Auth, NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

function withChatBadge(items: NavItem[], unreadCount: number): NavItem[] {
    return items.map((item) =>
        item.title === 'Chats'
            ? {
                  ...item,
                  badge:
                      unreadCount > 99
                          ? '99+'
                          : unreadCount > 0
                            ? unreadCount
                            : null,
              }
            : item,
    );
}

function setNavItems(auth: Auth, unreadCount: number) {
    if (auth.canManageOrganization) {
        if (auth.currentOrganization?.organization_type === 'individual') {
            return withChatBadge(individualOwnerNavItems, unreadCount);
        }
        return withChatBadge(schoolOwnerNavItems, unreadCount);
    }

    if (auth.organizationRole === 'TEACHER') {
        return withChatBadge(teacherNavItems, unreadCount);
    }

    if (auth.organizationRole === 'STUDENT') {
        return withChatBadge(studentNavItems, unreadCount);
    }

    return userNavItems;
}

export function Sidebar() {
    const { t } = useTranslation();
    const { urlIsActive } = useActiveUrl();
    const { auth, chatUnreadCount = 0 } = usePage<SharedData>().props;
    const navItems = setNavItems(auth, chatUnreadCount);
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
                                    <Logo className="h-12 w-auto group-data-[collapsible=icon]:h-5" />
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    {navItems.map((item) => {
                        if (!item.embedItems) {
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={urlIsActive(
                                            item.href,
                                            undefined,
                                            false,
                                        )}
                                        tooltip={t(item.title)}
                                    >
                                        <Link href={item.href}>
                                            {item.icon && <item.icon />}
                                            <span>
                                                {t(`common.${item.title}`)}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                    {item.badge ? (
                                        <SidebarMenuBadge>
                                            {item.badge}
                                        </SidebarMenuBadge>
                                    ) : null}
                                </SidebarMenuItem>
                            );
                        }
                        return (
                            <div className="flex flex-col" key={item.title}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={urlIsActive(
                                            item.href,
                                            undefined,
                                            true,
                                        )}
                                        tooltip={t(`common.${item.title}`)}
                                    >
                                        <Link href={item.href}>
                                            {item.icon && <item.icon />}
                                            <span>
                                                {t(`common.${item.title}`)}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                {item.embedItems.map((innerItem: NavItem) => (
                                    <SidebarMenuItem key={innerItem.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={urlIsActive(
                                                innerItem.href,
                                                undefined,
                                                false,
                                            )}
                                            tooltip={t(innerItem.title)}
                                            className="px-4"
                                        >
                                            <Link href={innerItem.href}>
                                                {innerItem.icon && (
                                                    <innerItem.icon />
                                                )}
                                                <span>
                                                    {t(
                                                        `common.${innerItem.title}`,
                                                    )}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </div>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </UISidebar>
    );
}
