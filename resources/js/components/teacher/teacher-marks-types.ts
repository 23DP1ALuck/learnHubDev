export type TeacherMarksFilters = {
    student_id: string;
    module_id: string;
    assignment_id: string;
};

export type TeacherMarksStudentOption = {
    id: number;
    name: string;
    email: string | null;
};

export type TeacherMarksModuleOption = {
    id: number;
    name: string;
};

export type TeacherMarksAssignmentOption = {
    id: number;
    title: string;
};

export type TeacherMarkRow = {
    assignment_id: number;
    assignment_title: string;
    student_id: number;
    student_name: string;
    module_id: number | null;
    module_name: string | null;
    status: string;
    total_points: string | null;
    total_percent: string | null;
    submitted_on: string | null;
};
