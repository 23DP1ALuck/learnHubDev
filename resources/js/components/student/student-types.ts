import type { TaskType } from '@/types';

export type StudentDashboardStats = {
    modules: number;
    assignments: number;
    pending: number;
    averagePercent: number | null;
};

export type StudentModuleSummary = {
    id: number;
    name: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    topics_count: number;
    assignments_count: number;
};

export type StudentAssignmentSummary = {
    id: number;
    title: string;
    description: string | null;
    due_date: string | null;
    tasks_count: number;
    status: string;
    first_task_id: number | null;
    module_names: string[];
    total_points: string | null;
    total_percent: string | null;
    submitted_on: string | null;
};

export type StudentTaskOption = {
    option_id: number;
    option_text: string;
};

export type StudentTaskSummary = {
    task_id: number;
    question_text: string;
    task_type: TaskType;
    max_points: string | number;
    options: StudentTaskOption[];
    answer_text: string | null;
    points: string | null;
    teacher_comment: string | null;
    created_at: string | null;
};

export type StudentTaskNavigationItem = {
    task_id: number;
    task_type: TaskType;
    max_points: string | number;
};

export type StudentTaskAssignment = {
    id: number;
    title: string;
    description: string | null;
    due_date: string | null;
    status: string;
    tasks_count: number;
};

export type StudentMarksStats = {
    graded: number;
    submitted: number;
    averagePercent: number | null;
};
