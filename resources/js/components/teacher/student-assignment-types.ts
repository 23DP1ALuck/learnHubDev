export type TeacherStudentAssignment = {
    id: number;
    title: string;
    description: string | null;
    grading_policy: string | null;
    due_date: string | null;
    max_points: number | string;
    module: {
        id: number;
        name: string;
    };
};

export type TeacherStudentInfo = {
    id: number;
    name: string | null;
    email: string | null;
};

export type TeacherStudentSubmission = {
    student_id: number;
    assignment_id: number;
    status: string;
    submitted_on: string | null;
    total_points: string | null;
    total_percent: string | null;
};

export type TeacherStudentTaskReview = {
    assignment_id: number;
    task_id: number;
    question_text: string;
    task_type: string;
    max_points: string | number;
    answer: {
        answer_text: string[];
        points: string | null;
        teacher_comment: string | null;
        files: Array<{
            id: number;
            file_name: string | null;
            file_path: string | null;
        }>;
    } | null;
};
