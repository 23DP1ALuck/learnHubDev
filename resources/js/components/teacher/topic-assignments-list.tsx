import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
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
export default function TopicAssignmentsList({
    assignments,
}: TopicAssignmentsListProps) {
    const { t } = useTranslation();
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{t('learning.Assignments')}</CardTitle>
                <CardDescription>
                    {t(
                        'teacher.These are the assignments linked to this topic. One assignment can belong to multiple topics.',
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {assignments.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        {t(
                            'teacher.No assignments are linked to this topic yet.',
                        )}
                    </div>
                ) : (
                    assignments.map((assignment) => (
                        <Link
                            key={assignment.id}
                            href={route(
                                'teacher.assignments.show',
                                assignment.id,
                            )}
                            className="block rounded-xl border p-4 transition-colors hover:bg-muted/40"
                            prefetch
                        >
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-semibold">
                                            {assignment.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {assignment.description ||
                                                'No assignment description yet.'}
                                        </p>
                                    </div>
                                    <span className="text-sm font-medium text-primary">
                                        {t('common.Open')}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                    <span>Tasks: {assignment.tasks_count}</span>
                                    <span>
                                        Policy:{' '}
                                        {assignment.grading_policy ||
                                            t('common.Not set')}
                                    </span>
                                    <span>
                                        Due:{' '}
                                        {assignment.due_date ||
                                            t('common.Not set')}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
