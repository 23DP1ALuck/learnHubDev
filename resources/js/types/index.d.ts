import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
    organizationRole?: OrganizationRole | null;
    currentOrganization?: Organization | null;
    canManageOrganization?: boolean;
    organizations: Organization[];
    activeOrganization?: Organization | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    badge?: number | string | null;
    embedItems?: NavItem[];
}

export interface SharedData {
    name: string;
    auth: Auth;
    session: Session;
    org: Organization | null;
    sidebarOpen: boolean;
    chatUnreadCount?: number;
    locale: 'lv' | 'en' | 'ru';
    translations: Record<string, Record<string, string>>;
    [key: string]: unknown;
}
export interface Session {
    activeOrganization?: Organization | null;
}
export type OrganizationRole = 'STUDENT' | 'TEACHER' | 'ORGANIZATION_OWNER';
export type Organization = {
    id: number;
    organization_type: 'individual' | 'school';
    organization_name: string;
    created_at: string;
    updated_at: string;
    pivot?: {
        joined_on: string | null;
        role_in_org: OrganizationRole;
        admin_privileges: boolean;
    };
};
export type Flash = {
    flash?: {
        success?: string;
        invite_url?: string;
        error?: string;
        afterLogin?: boolean;
    };
};

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    role: 'admin' | 'user';
    [key: string]: unknown; // This allows for additional properties...
}
export type OrganizationMember = {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'invited' | 'disabled';
    role_in_org: OrganizationRole;
    admin_privileges: boolean;
    joined_on: string | null;
    created_at: string;
};
export type OrganizationInvite = {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    role_in_org: OrganizationRole | null;
    created_at: string | null;
    expires_at: string | null;
    used_at: string | null;
    status: 'pending' | 'used' | 'expired';
    inviter_name: string | null;
};
export type OrganizationStats = {
    members: number;
    teachers: number;
    students: number;
    school_groups: number;
    pending_invites: number;
};
export type OrganizationGroup = {
    school_id: number;
    group_id: number;
    name: string;
    students_count: number;
    teachers_count: number;
    modules_count: number;
    created_at: string | null;
};
export type OrganizationModule = {
    id: number;
    name: string;
    created_at: string | null;
    updated_at: string | null;
    organization_id: number;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    creator_id: number;
};
export type OnboardingRequest = {
    id: number;
    created_at: Date;
    updated_at: Date;
    first_name: string;
    last_name: string;
    email: string;
    organization_name: string;
    organization_type: 'individual' | 'school';
    status: 'pending' | 'approved' | 'rejected';
};
export interface PaginatedData {
    current_page: number;
    last_page: number;
    total: number;
    next_page_url?: string;
    prev_page_url?: string;
    links: [{ active: boolean; url?: string; label: string; page?: number }];
}
export type TaskType =
    | 'CHECKBOX'
    | 'TEXT'
    | 'FILE'
    | 'TRUE_FALSE'
    | 'NUMBER'
    | 'CUSTOM_SELECT';
export type TaskOption = {
    assignment_id: number;
    task_id: number;
    option_id: number;
    option_text: string;
};
type MarksTablePreview = {
    marks: {
        module_name: string;
        percent: number;
        grade: number;
        grading_policy: 'SUMMATIVE' | 'FORMATIVE';
        submitted_on: string;
    }[];
    enrolledModules: string[];
};
