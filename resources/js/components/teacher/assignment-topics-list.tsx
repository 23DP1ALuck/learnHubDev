import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

type AssignmentTopic = {
    module_id: number;
    module_name: string | null;
    topic_id: number;
    topic_name: string | null;
};

type AssignmentTopicsListProps = {
    topics: AssignmentTopic[];
};

export default function AssignmentTopicsList({ topics }: AssignmentTopicsListProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Linked topics</CardTitle>
                <CardDescription>This assignment is attached to the following topics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {topics.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                        No linked topics found.
                    </div>
                ) : (
                    topics.map((topic) => (
                        <Link
                            key={`${topic.module_id}-${topic.topic_id}`}
                            href={`/teacher/modules/${topic.module_id}/topics/${topic.topic_id}`}
                            className="block rounded-lg border p-3 text-sm transition-colors hover:bg-muted/40"
                            prefetch
                        >
                            <p className="font-medium">{topic.topic_name || `Topic ${topic.topic_id}`}</p>
                            <p className="text-muted-foreground">{topic.module_name || `Module ${topic.module_id}`}</p>
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
