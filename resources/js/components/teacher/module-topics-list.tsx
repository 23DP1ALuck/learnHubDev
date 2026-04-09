import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

type TopicSummary = {
    topic_id: number;
    module_id: number;
    name: string;
    description: string | null;
    materials_count: number;
    assignments_count: number;
};

type ModuleTopicsListProps = {
    moduleId: number;
    topics: TopicSummary[];
};

export default function ModuleTopicsList({ moduleId, topics }: ModuleTopicsListProps) {
    console.log(topics);
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Topics</CardTitle>
                <CardDescription>
                    Each topic leads to its own workspace where you manage materials and assignments.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {topics.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No topics yet. Create the first topic for this module.
                    </div>
                ) : (
                    topics.map((topic) => (
                        <Link
                            key={topic.topic_id}
                            href={`/teacher/modules/${moduleId}/topics/${topic.topic_id}`}
                            className="block rounded-xl border p-4 transition-colors hover:bg-muted/40"
                            prefetch
                        >
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-lg font-semibold">{topic.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {topic.description || 'No topic description yet.'}
                                        </p>
                                    </div>
                                    <span className="text-sm font-medium text-primary">Open</span>
                                </div>
                                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                    <span>Materials: {topic.materials_count}</span>
                                    <span>Assignments: {topic.assignments_count}</span>
                                    <span>Topic #{topic.topic_id}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
