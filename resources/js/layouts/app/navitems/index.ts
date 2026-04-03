import {NavItem} from "@/types";
import {dashboard, onboardingRequests, organizations} from "@/routes";
import {Building, Calendar, LayoutGrid, Settings, Users} from "lucide-react";
import {edit as editProfile} from "@/routes/profile";
import {dashboard as ownerDashboard, invitations as ownerInvitations, organization as ownerOrganization, users as ownerUsers} from "@/routes";

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
export const schoolOwnerNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: ownerDashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Organization',
        href: ownerOrganization(),
        icon: Building,
        embedItems: [
            {
                title: 'Groups',
                href: '/organization/groups',
                icon: Users,
            },
            {
                title: 'Users',
                href: ownerUsers(),
                icon: Calendar,
            },
            {
                title: 'Invitations',
                href: ownerInvitations(),
                icon: Calendar,
            },
        ]
    },
    {
        title: 'Settings',
        href: editProfile(),
        icon: Settings,
    },
]
export const individualOwnerNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: ownerDashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Organization',
        href: ownerOrganization(),
        icon: Building,
        embedItems: [
            {
                title: 'Users',
                href: ownerUsers(),
                icon: Calendar,
            },
            {
                title: 'Invitations',
                href: ownerInvitations(),
                icon: Calendar,
            },
        ]
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
