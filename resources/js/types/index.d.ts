import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
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
}

export interface SharedData {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}
type Flash = {
    flash?: {
        success?: string;
    };
}

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
export type OnboardingRequest = {
    id: number;
    created_at: Date;
    updated_at: Date;
    first_name: string;
    last_name: string;
    email: string;
    organization_name: string;
    organization_type: 'individual' | 'organization';
    status: 'pending' | 'approved' | 'rejected';
}
export interface PaginatedData {
    current_page: number,
    last_page: number,
    total: number,
    next_page_url?: string,
    prev_page_url?: string,
    links: [
        {active: boolean,url?: string,label: string,page?: number}
    ]
}
