export type TaskType = 'CHECKBOX' | 'TEXT' | 'FILE' | 'TRUE_FALSE' | 'NUMBER' | 'CUSTOM_SELECT';

export type AssignmentPreview = {
    id: number;
    title: string;
    due_date: string | null;
};

export type TaskOption = {
    option_id: number;
    option_text: string;
};

export type TaskPreview = {
    task_id: number;
    question_text: string;
    task_type: TaskType;
    max_points: string | number;
    correct_answers: string[];
    options?: TaskOption[];
    created_at: string | null;
};

export type TaskNavigationItem = {
    task_id: number;
    task_type: TaskType;
};
