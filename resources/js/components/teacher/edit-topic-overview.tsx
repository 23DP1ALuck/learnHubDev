import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type EditTopicOverviewProps = {
    stats: {
        materials: number;
        assignments: number;
        module_name: string;
    };
};

export default function EditTopicOverview({ stats }: EditTopicOverviewProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Edit topic</CardTitle>
                <CardDescription>
                    Update the topic details while keeping its materials and assignments intact.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Materials</p>
                    <p className="mt-1 text-3xl font-semibold">{stats.materials}</p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Assignments</p>
                    <p className="mt-1 text-3xl font-semibold">{stats.assignments}</p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Module</p>
                    <p className="mt-1 text-sm font-medium">{stats.module_name}</p>
                </div>
            </CardContent>
        </Card>
    );
}
