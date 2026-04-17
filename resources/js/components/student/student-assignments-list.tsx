import type { StudentAssignmentSummary } from '@/components/student/student-types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

type StudentAssignmentsListProps = {
    assignments: StudentAssignmentSummary[];
    title?: string;
    description?: string;
};

function statusLabel(status: string): string {
    switch (status) {
        case 'DRAFT':
            return 'In progress';
        case 'SUBMITTED':
            return 'Submitted';
        case 'GRADED':
            return 'Graded';
        default:
            return 'Not started';
    }
}

export default function StudentAssignmentsList({
    assignments,
    title = 'Assignments',
    description = 'Assignments available in the active organization.',
}: StudentAssignmentsListProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {assignments.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No assignments are available yet.
                    </div>
                ) : (
                    assignments.map((assignment, index) => {
                        const href = `/student/assignments/${assignment.id}`;

                        return (
                            <Link key={index} href={href} className="block rounded-xl border p-4 transition-colors hover:bg-muted/40">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="space-y-1">
                                        <p className="font-semibold">{assignment.title}</p>
                                        <p className="text-sm text-muted-foreground">{assignment.description || 'No assignment description yet.'}</p>
                                    </div>
                                    <Badge variant="secondary">{statusLabel(assignment.status)}</Badge>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                    <span>{assignment.tasks_count} tasks</span>
                                    <span>Due: {assignment.due_date || 'Not set'}</span>
                                    {assignment.module_names.length > 0 && <span>{assignment.module_names.join(', ')}</span>}
                                    {assignment.total_percent && <span>{assignment.total_percent}%</span>}
                                </div>
                            </Link>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
}
