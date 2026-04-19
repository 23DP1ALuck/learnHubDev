import type { TeacherDashboardAssignment } from '@/components/teacher/teacher-dashboard-types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

type TeacherDashboardAssignmentsProps = {
    assignments: TeacherDashboardAssignment[];
};

export default function TeacherDashboardAssignments({ assignments }: TeacherDashboardAssignmentsProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Upcoming assignments</CardTitle>
                <CardDescription>Assignments ordered for quick access from the dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {assignments.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No assignments are available yet.
                    </div>
                ) : (
                    assignments.map((assignment) => (
                        <Link
                            key={assignment.id}
                            href={route('teacher.assignments.show', assignment.id)}
                            className="block rounded-xl border p-4 transition-colors hover:bg-muted/40"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                    <p className="font-semibold">{assignment.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {assignment.description || 'No assignment description yet.'}
                                    </p>
                                </div>
                                <Badge variant="secondary">{assignment.tasks_count} tasks</Badge>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span>Due: {assignment.due_date || 'Not set'}</span>
                                <span>{assignment.topics_count} topics</span>
                                {assignment.topic_names.length > 0 && <span>{assignment.topic_names.join(', ')}</span>}
                            </div>
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
