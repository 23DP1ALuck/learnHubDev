import type { StudentAssignmentDetail } from '@/components/student/student-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, Form } from '@inertiajs/react';
import { FC } from "react";
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
function AssignmentStartButton({assignment}: { assignment : StudentAssignmentDetail }) {
    if(assignment.first_task_id && assignment.status === 'NOT STARTED'){
        return  (
            <Form
            action={route('student.submission.store', [assignment.id])}
            method="POST"
            className="flex-shrink-0"
            >
            <Button type="submit">
                Start Assignment
            </Button>
            </Form>
        )
    } else if(assignment.first_task_id && assignment.status === 'DRAFT'){
        return (
            <Link href={route('student.tasks.show', [assignment.id, assignment.last_incompleted_task])} className="flex-shrink-0">
                <Button>
                    Continue
                </Button>
            </Link>
        )
    } else if(assignment.first_task_id && assignment.status === 'SUBMITTED'){
        return (
            <div className="flex p-4 rounded bg-muted-foreground text-white">Submission completed</div>
        )
    } else {
        return (
            <div className="flex p-4 rounded bg-muted-foreground text-white">No tasks yet</div>
        )
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
                <AssignmentStartButton assignment={assignment} />
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
