import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

type AssignmentSummary = {
    id: number;
    title: string;
    description: string | null;
    grading_policy: string | null;
    due_date: string | null;
    tasks_count: number;
};

type TopicAssignmentsListProps = {
    assignments: AssignmentSummary[];
};

export default function TopicAssignmentsList({ assignments }: TopicAssignmentsListProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Assignments</CardTitle>
                <CardDescription>
                    Open an assignment to manage its tasks. Tasks intentionally do not have their own top-level list route.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {assignments.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No assignments yet for this topic.
                    </div>
                ) : (
                    assignments.map((assignment) => (
                        <Link
                            key={assignment.id}
                            href={`/teacher/assignments/${assignment.id}`}
                            className="block rounded-xl border p-4 transition-colors hover:bg-muted/40"
                            prefetch
                        >
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-semibold">{assignment.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {assignment.description || 'No assignment description yet.'}
                                        </p>
                                    </div>
                                    <span className="text-sm font-medium text-primary">Open</span>
                                </div>
                                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                    <span>Tasks: {assignment.tasks_count}</span>
                                    <span>Policy: {assignment.grading_policy || 'Not set'}</span>
                                    <span>Due: {assignment.due_date || 'Not set'}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
