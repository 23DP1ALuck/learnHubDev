export type AdminDashboardStats = {
    users: number;
    organizations: number;
    schools: number;
    individual_courses: number;
    teachers: number;
    students: number;
    pending_onboarding: number;
    approved_onboarding: number;
};

export type AdminDashboardOrganization = {
    id: number;
    organization_name: string;
    organization_type: 'school' | 'individual';
    users_count: number;
    created_at: string | null;
};

export type AdminDashboardActivity = {
    id: number;
    title: string;
    description: string | null;
    created_at: string | null;
};

export const emptyAdminDashboardStats: AdminDashboardStats = {
    users: 0,
    organizations: 0,
    schools: 0,
    individual_courses: 0,
    teachers: 0,
    students: 0,
    pending_onboarding: 0,
    approved_onboarding: 0,
};
