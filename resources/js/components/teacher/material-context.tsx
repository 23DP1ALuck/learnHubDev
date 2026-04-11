import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

type ModuleSummary = {
    id: number;
    name: string;
    description: string | null;
};

type TopicSummary = {
    topic_id: number;
    module_id: number;
    name: string;
    description: string | null;
};

type MaterialContextProps = {
    module: ModuleSummary;
    topic: TopicSummary;
};

export default function MaterialContext({ module, topic }: MaterialContextProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Context</CardTitle>
                <CardDescription>This material belongs to the topic and module shown below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Link
                    href={`/teacher/modules/${module.id}`}
                    className="block rounded-lg border p-4 transition-colors hover:bg-muted/40"
                    prefetch
                >
                    <p className="font-medium">{module.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {module.description || 'No module description yet.'}
                    </p>
                </Link>
                <Link
                    href={`/teacher/modules/${module.id}/topics/${topic.topic_id}`}
                    className="block rounded-lg border p-4 transition-colors hover:bg-muted/40"
                    prefetch
                >
                    <p className="font-medium">{topic.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {topic.description || 'No topic description yet.'}
                    </p>
                </Link>
            </CardContent>
        </Card>
    );
}
