import type { StudentAssignmentTopic } from '@/components/student/student-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

type StudentAssignmentTopicsListProps = {
    topics: StudentAssignmentTopic[];
};

export default function StudentAssignmentTopicsList({ topics }: StudentAssignmentTopicsListProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Topics</CardTitle>
                <CardDescription>Topics this assignment belongs to.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {topics.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No topics are linked yet.
                    </div>
                ) : (
                    topics.map((topic) => (
                        <Link
                            key={`${topic.module_id}-${topic.topic_id}`}
                            href={`/module/${topic.module_id}/topic/${topic.topic_id}`}
                            className="block rounded-xl border p-4 transition-colors hover:bg-muted/40"
                        >
                            <p className="font-semibold">{topic.topic_name || `Topic ${topic.topic_id}`}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {topic.module_name || `Module ${topic.module_id}`}
                            </p>
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
