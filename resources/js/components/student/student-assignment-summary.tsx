import type { StudentAssignmentDetail } from '@/components/student/student-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

type StudentAssignmentSummaryProps = {
    assignment: StudentAssignmentDetail;
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

export default function StudentAssignmentSummaryCard({ assignment }: StudentAssignmentSummaryProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-2">
                    <CardTitle>{assignment.title}</CardTitle>
                    <CardDescription>
                        {assignment.description || 'This assignment contains the tasks the student needs to complete.'}
                    </CardDescription>
                </div>

                {assignment.first_task_id ? (
                    <Link href={route('student.tasks.show', [assignment.id, assignment.first_task_id])}>
                        <Button>Start assignment</Button>
                    </Link>
                ) : (
                    <Button disabled>No tasks yet</Button>
                )}
            </CardHeader>

            <CardContent className="grid gap-3 md:grid-cols-5">
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="mt-1 text-sm font-medium">{statusLabel(assignment.status)}</p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Tasks</p>
                    <p className="mt-1 text-3xl font-semibold">{assignment.tasks_count}</p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Max points</p>
                    <p className="mt-1 text-3xl font-semibold">{assignment.total_max_points ?? '-'}</p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Due date</p>
                    <p className="mt-1 text-sm font-medium">{assignment.due_date || 'Not set'}</p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Grading policy</p>
                    <p className="mt-1 text-sm font-medium">{assignment.grading_policy || 'Not set'}</p>
                </div>
            </CardContent>
        </Card>
    );
}
