import type { TeacherMarkRow } from '@/components/teacher/teacher-marks-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

type TeacherMarksTableProps = {
    marks: TeacherMarkRow[];
};

function formatDate(value: string | null): string {
    if (!value) {
        return '-';
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    return parsed.toLocaleDateString();
}

export default function TeacherMarksTable({ marks }: TeacherMarksTableProps) {
    console.log(marks);
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Marks</CardTitle>
                <CardDescription>Recent student submissions and grading results.</CardDescription>
            </CardHeader>
            <CardContent>
                {marks.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No marks match the current filters.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="text-left text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Student</th>
                                    <th className="px-4 py-3 font-medium">Module</th>
                                    <th className="px-4 py-3 font-medium">Assignment</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Points</th>
                                    <th className="px-4 py-3 font-medium">Percent</th>
                                    <th className="px-4 py-3 font-medium">Submitted</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marks.map((mark, index) => (
                                    <tr key={`${mark.student_id}-${mark.assignment_id}-${index}`} className="border-t">
                                        <td className="px-4 py-3">{mark.student_name}</td>
                                        <td className="px-4 py-3">{mark.module_name || '-'}</td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={route('teacher.assignments.show', mark.assignment_id)}
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {mark.assignment_title}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3">{mark.status}</td>
                                        <td className="px-4 py-3">{mark.total_points || '-'}</td>
                                        <td className="px-4 py-3">{mark.total_percent ? `${mark.total_percent}%` : '-'}</td>
                                        <td className="px-4 py-3">{formatDate(mark.submitted_on)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
