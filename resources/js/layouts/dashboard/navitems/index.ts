import {NavItem} from "@/types";
import {dashboard, onboardingRequests, organizations} from "@/routes";
import {Building, Calendar, LayoutGrid, Settings} from "lucide-react";
import {edit as editProfile} from "@/routes/profile";

export const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Settings',
        href: editProfile(),
        icon: Settings,
    },
    {
        title: 'Onboarding requests',
        href: onboardingRequests(),
        icon: Calendar
    },
    {
        title: 'Organizations',
        href: organizations(),
        icon: Building
    }
]
export const userNavItems: NavItem[] = [
    {
        title: 'Dashboard',
            href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Settings',
            href: editProfile(),
        icon: Settings,
    },
]
export const studentNavItems: NavItem[] = [
    ...userNavItems,
    {
        title: 'Modules',
        href: onboardingRequests(),
        icon: Calendar
    }
]

