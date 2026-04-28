import TeacherSubmissionsFilters from '@/components/teacher/teacher-submissions-filters';
import TeacherSubmissionsList from '@/components/teacher/teacher-submissions-list';
import type {
    TeacherSubmissionRow,
    TeacherSubmissionsFilters as TeacherSubmissionsFilterValues,
    TeacherSubmissionsGroupOption,
} from '@/components/teacher/teacher-submissions-types';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';

const emptyFilters: TeacherSubmissionsFilterValues = {
    group_id: '',
};
export default function TeacherSubmissionsPage({
    filters = emptyFilters,
    organizationType = null,
    groups = [],
    submissions = [],
    assignmentId = 1,
}: {
    filters?: TeacherSubmissionsFilterValues;
    organizationType?: 'school' | 'individual' | null;
    groups?: TeacherSubmissionsGroupOption[];
    submissions?: TeacherSubmissionRow[];
    assignmentId?: number;
}) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Submissions',
            href: route('teacher.assignments.submissions', assignmentId),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('teacher.Assignment submissions')} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t('teacher.Assignment submissions')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t(
                            'teacher.Open a student submission and review every task answer.',
                        )}
                    </p>
                </div>

                <TeacherSubmissionsFilters
                    filters={filters}
                    groups={groups}
                    organizationType={organizationType}
                    assignmentId={assignmentId}
                />

                <TeacherSubmissionsList submissions={submissions} />
            </div>
        </AppLayout>
    );
}
