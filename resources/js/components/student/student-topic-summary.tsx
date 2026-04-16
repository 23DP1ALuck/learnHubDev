import type { StudentModuleSummary, StudentTopicSummary } from '@/components/student/student-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type StudentTopicSummaryProps = {
    module: StudentModuleSummary;
    topic: Pick<StudentTopicSummary, 'name' | 'description' | 'materials_count' | 'assignments_count'>;
};

export default function StudentTopicSummaryCard({ module, topic }: StudentTopicSummaryProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{topic.name}</CardTitle>
                <CardDescription>{topic.description || 'This topic contains the materials and assignments students work through.'}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Materials</p>
                    <p className="mt-1 text-3xl font-semibold">{topic.materials_count}</p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Assignments</p>
                    <p className="mt-1 text-3xl font-semibold">{topic.assignments_count}</p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Module</p>
                    <p className="mt-1 text-sm font-medium">{module.name}</p>
                </div>
            </CardContent>
        </Card>
    );
}
