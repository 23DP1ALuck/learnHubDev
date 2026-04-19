import TeacherMarksFilters from '@/components/teacher/teacher-marks-filters';
import TeacherMarksTable from '@/components/teacher/teacher-marks-table';
import type {
    TeacherMarkRow,
    TeacherMarksAssignmentOption,
    TeacherMarksFilters as TeacherMarksFilterValues,
    TeacherMarksModuleOption,
    TeacherMarksStudentOption,
} from '@/components/teacher/teacher-marks-types';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Marks',
        href: route('teacher.marks'),
    },
];

const emptyFilters: TeacherMarksFilterValues = {
    student_id: '',
    module_id: '',
    assignment_id: '',
};

export default function TeacherMarksPage({
    marks = [],
    filters = emptyFilters,
    students = [],
    modules = [],
    assignments = [],
}: {
    marks?: TeacherMarkRow[];
    filters?: TeacherMarksFilterValues;
    students?: TeacherMarksStudentOption[];
    modules?: TeacherMarksModuleOption[];
    assignments?: TeacherMarksAssignmentOption[];
}) {
    const { flash } = usePage<Flash>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teacher marks" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Marks</h1>
                    <p className="text-sm text-muted-foreground">
                        Review submitted work and filter the results by student, module, or assignment.
                    </p>
                </div>

                <TeacherMarksFilters
                    filters={filters}
                    students={students}
                    modules={modules}
                    assignments={assignments}
                />

                <TeacherMarksTable marks={marks} />
            </div>
        </AppLayout>
    );
}
