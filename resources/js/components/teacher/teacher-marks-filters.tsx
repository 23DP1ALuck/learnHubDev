import type {
    TeacherMarksAssignmentOption,
    TeacherMarksFilters,
    TeacherMarksModuleOption,
    TeacherMarksStudentOption,
} from '@/components/teacher/teacher-marks-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

const selectClassName =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

type TeacherMarksFiltersProps = {
    filters: TeacherMarksFilters;
    students: TeacherMarksStudentOption[];
    modules: TeacherMarksModuleOption[];
    assignments: TeacherMarksAssignmentOption[];
};

export default function TeacherMarksFilters({
    filters,
    students,
    modules,
    assignments,
}: TeacherMarksFiltersProps) {
    console.log(assignments);
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>
                    Narrow the results by student, module, or assignment. Without filters, the page can show the most recent submitted work.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    action={route('teacher.marks')}
                    method="get"
                    className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
                >
                    <div className="grid gap-2">
                        <label htmlFor="student_id" className="text-sm font-medium">
                            Student
                        </label>
                        <select id="student_id" name="student_id" className={selectClassName} defaultValue={filters.student_id}>
                            <option value="">All students</option>
                            {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.name}
                                    {student.email ? ` (${student.email})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="module_id" className="text-sm font-medium">
                            Module
                        </label>
                        <select id="module_id" name="module_id" className={selectClassName} defaultValue={filters.module_id}>
                            <option value="">All modules</option>
                            {modules.map((module) => (
                                <option key={module.id} value={module.id}>
                                    {module.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="assignment_id" className="text-sm font-medium">
                            Assignment
                        </label>
                        <select id="assignment_id" name="assignment_id" className={selectClassName} defaultValue={filters.assignment_id}>
                            <option value="">All assignments</option>
                            {assignments.map((assignment) => (
                                <option key={assignment.id} value={assignment.id}>
                                    {assignment.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end gap-2">
                        <Button type="submit">Apply</Button>
                        <Button asChild type="button" variant="outline">
                            <Link href={route('teacher.marks')}>Reset</Link>
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
