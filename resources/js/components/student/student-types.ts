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

export type StudentTopicSummary = {
    topic_id: number;
    module_id: number;
    name: string;
    description: string | null;
    materials_count: number;
    assignments_count: number;
    created_at: string | null;
};

export type StudentMaterialSummary = {
    material_id: number;
    module_id: number;
    topic_id: number;
    title: string;
    description: string | null;
    created_at: string | null;
};

export type StudentMaterialFileSummary = {
    module_id: number;
    topic_id: number;
    material_id: number;
    file_id: number;
    file: {
        file_name: string;
        file_path: string | null;
    };
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

export type StudentAssignmentDetail = {
    id: number;
    title: string;
    description: string | null;
    grading_policy: string | null;
    due_date: string | null;
    status: string;
    tasks_count: number;
    topics_count: number;
    total_max_points: string | number | null;
    first_task_id: number | null;
    created_at: string | null;
    last_incompleted_task: number | null;
};

export type StudentAssignmentTopic = {
    module_id: number;
    module_name: string | null;
    topic_id: number;
    topic_name: string | null;
};

export type StudentAssignmentTaskSummary = {
    task_id: number;
    task_type: TaskType;
    max_points: string | number;
    question_text: string;
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
    answer: string[];
    answer_files: {
        file_name: string;
        file_path: string | null;
    }[];
};

export type StudentTaskNavigationItem = {
    task_id: number;
    task_type: TaskType;
    max_points: string | number;
    is_completed: boolean;
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
