import type { StudentTopicSummary } from '@/components/student/student-types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

type StudentModuleTopicsListProps = {
    moduleId: number;
    topics: StudentTopicSummary[];
};

export default function StudentModuleTopicsList({ moduleId, topics }: StudentModuleTopicsListProps) {
    console.log('Topics:', topics);
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Topics</CardTitle>
                <CardDescription>Topics available inside this module.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {topics.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No topics are available yet.
                    </div>
                ) : (
                    topics.map((topic) => (
                        <Link
                            key={topic.topic_id}
                            href={`/module/${moduleId}/topic/${topic.topic_id}`}
                            className="block rounded-xl border p-4 transition-colors hover:bg-muted/40"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                    <p className="font-semibold">{topic.name}</p>
                                    <p className="text-sm text-muted-foreground">{topic.description || 'No topic description yet.'}</p>
                                </div>
                                <Badge variant="outline">{topic.materials_count} materials</Badge>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span>{topic.assignments_count} assignments</span>
                                <span>Topic #{topic.topic_id}</span>
                            </div>
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
