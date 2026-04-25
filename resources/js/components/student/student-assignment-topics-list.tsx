import type { StudentAssignmentTopic } from '@/components/student/student-types';
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
type StudentAssignmentTopicsListProps = {
    topics: StudentAssignmentTopic[];
};
export default function StudentAssignmentTopicsList({
    topics,
}: StudentAssignmentTopicsListProps) {
    const { t } = useTranslation();
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{t('learning.Topics')}</CardTitle>
                <CardDescription>
                    {t('learning.Topics this assignment belongs to.')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {topics.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        {t('student.No topics are linked yet.')}
                    </div>
                ) : (
                    topics.map((topic) => (
                        <Link
                            key={`${topic.module_id}-${topic.topic_id}`}
                            href={route('student.topics.show', [
                                topic.module_id,
                                topic.topic_id,
                            ])}
                            className="block rounded-xl border p-4 transition-colors hover:bg-muted/40"
                        >
                            <p className="font-semibold">
                                {topic.topic_name || `Topic ${topic.topic_id}`}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {topic.module_name ||
                                    `Module ${topic.module_id}`}
                            </p>
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
