import StudentAssignmentSummary from '@/components/teacher/student-assignment-summary';
import type {
    TeacherStudentAssignment,
    TeacherStudentInfo,
    TeacherStudentSubmission,
    TeacherStudentTaskReview,
} from '@/components/teacher/student-assignment-types';
import StudentTaskReviewCard from '@/components/teacher/student-task-review-card';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

type TeacherStudentAssignmentPageProps = {
    assignment: TeacherStudentAssignment;
    student: TeacherStudentInfo;
    submission: TeacherStudentSubmission;
    tasks: TeacherStudentTaskReview[];
};

export default function TeacherStudentAssignmentPage({
    assignment,
    student,
    submission,
    tasks,
}: TeacherStudentAssignmentPageProps) {
    const { t } = useTranslation();
    const { flash } = usePage<Flash>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Marks',
            href: route('teacher.marks'),
        },
        {
            title: assignment.title,
            href: route('teacher.assignments.students.show', [
                assignment.id,
                student.id,
            ]),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${assignment.title} · ${student.name ?? ''}`} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {flash.error}
                    </div>
                )}

                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t('teacher.Student assignment review')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t(
                            'teacher.Review each submitted task and choose how many points the student received.',
                        )}
                    </p>
                </div>

                <StudentAssignmentSummary
                    assignment={assignment}
                    student={student}
                    submission={submission}
                />

                <div className="grid gap-4">
                    {tasks.map((task) => (
                        <StudentTaskReviewCard
                            key={task.task_id}
                            task={task}
                            studentId={student.id}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
