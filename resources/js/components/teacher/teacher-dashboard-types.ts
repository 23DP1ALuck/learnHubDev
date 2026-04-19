export type TeacherDashboardStats = {
    modules: number;
    topics: number;
    materials: number;
    assignments: number;
    tasks: number;
};

export type TeacherDashboardModule = {
    id: number;
    name: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    topics_count: number;
    assignments_count: number;
    created_at: string | null;
};

export type TeacherDashboardAssignment = {
    id: number;
    title: string;
    description: string | null;
    due_date: string | null;
    tasks_count: number;
    topics_count: number;
    topic_names: string[];
    created_at: string | null;
};
