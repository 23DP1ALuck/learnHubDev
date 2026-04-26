export type TeacherSubmissionsFilters = {
    group_id: string;
};

export type TeacherSubmissionsGroupOption = {
    group_id: number;
    name: string;
};

export type TeacherSubmissionRow = {
    student_id: number;
    student_name: string;
    student_email: string | null;
    group_id: number | null;
    group_name: string | null;
    assignment_id: number;
    assignment_title: string;
    module_name: string | null;
    status: string;
    total_points: string | null;
    total_percent: string | null;
    submitted_on: string | null;
};
