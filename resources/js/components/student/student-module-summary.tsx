import type { StudentModuleSummary } from '@/components/student/student-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type StudentModuleSummaryProps = {
    module: StudentModuleSummary;
};

export default function StudentModuleSummaryCard({ module }: StudentModuleSummaryProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{module.name}</CardTitle>
                <CardDescription>{module.description || 'No module description yet.'}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-4">
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Topics</p>
                    <p className="mt-1 text-3xl font-semibold">{module.topics_count}</p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Assignments</p>
                    <p className="mt-1 text-3xl font-semibold">{module.assignments_count}</p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Start</p>
                    <p className="mt-1 text-sm font-medium">{module.start_date || 'Not set'}</p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">End</p>
                    <p className="mt-1 text-sm font-medium">{module.end_date || 'Not set'}</p>
                </div>
            </CardContent>
        </Card>
    );
}
