import {NavItem} from "@/types";
import {dashboard, onboardingRequests} from "@/routes";
import {Calendar, LayoutGrid, Settings} from "lucide-react";
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
