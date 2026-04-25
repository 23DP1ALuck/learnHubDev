import {
    dashboard,
    onboardingRequests,
    organizations,
    dashboard as ownerDashboard,
    invitations as ownerInvitations,
    organization as ownerOrganization,
    users as ownerUsers,
} from '@/routes';
import { chats } from '@/routes/';
import { edit as editProfile } from '@/routes/profile';
import {
    marks as teacherMarks,
    modules as teacherModules,
} from '@/routes/teacher';
import type { NavItem } from '@/types';
import {
    BookOpen,
    Building,
    Calendar,
    FileText,
    LayoutGrid,
    MessageSquare,
    Settings,
    Users,
} from 'lucide-react';
import { route } from 'ziggy-js';

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
];

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
        icon: Calendar,
    },
    {
        title: 'Organizations',
        href: organizations(),
        icon: Building,
    },
];

export const teacherNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Modules',
        href: teacherModules(),
        icon: BookOpen,
    },
    {
        title: 'Chats',
        href: chats(),
        icon: MessageSquare,
    },
    {
        title: 'Marks',
        href: teacherMarks(),
        icon: FileText,
    },
    {
        title: 'Settings',
        href: editProfile(),
        icon: Settings,
    },
];

export const schoolOwnerNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: ownerDashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Chats',
        href: chats(),
        icon: MessageSquare,
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
        ],
    },
    {
        title: 'Settings',
        href: editProfile(),
        icon: Settings,
    },
];

export const individualOwnerNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: ownerDashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Modules',
        href: teacherModules(),
        icon: BookOpen,
    },
    {
        title: 'Chats',
        href: chats(),
        icon: MessageSquare,
    },
    {
        title: 'Marks',
        href: route('teacher.marks'),
        icon: FileText,
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
        ],
    },
    {
        title: 'Settings',
        href: editProfile(),
        icon: Settings,
    },
];

export const studentNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Modules',
        href: '/student/modules',
        icon: BookOpen,
    },
    {
        title: 'Assignments',
        href: '/student/assignments',
        icon: Calendar,
    },
    {
        title: 'Chats',
        href: chats(),
        icon: MessageSquare,
    },
    {
        title: 'Marks',
        href: '/student/marks',
        icon: FileText,
    },
    {
        title: 'Settings',
        href: editProfile(),
        icon: Settings,
    },
];
