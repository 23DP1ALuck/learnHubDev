import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type TaskSummary = {
    task_id: number;
    question_text: string;
    task_type: string;
    max_points: string | number;
    correct_answers: string[];
    created_at: string | null;
};

type AssignmentTasksListProps = {
    tasks: TaskSummary[];
};

export default function AssignmentTasksList({ tasks }: AssignmentTasksListProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                    Tasks are managed only inside the assignment workspace, which matches the documentation hierarchy.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {tasks.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No tasks yet. Add the first question or submission requirement for this assignment.
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task.task_id} className="rounded-xl border p-4">
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-semibold">Task #{task.task_id}</p>
                                        <p className="text-sm text-muted-foreground">{task.question_text}</p>
                                    </div>
                                    <Badge variant="secondary">{task.task_type}</Badge>
                                </div>
                                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                    <span>Max points: {task.max_points}</span>
                                    <span>Grading: {task.correct_answers.length > 0 ? 'Auto-check ready' : 'Manual review'}</span>
                                </div>
                                {task.correct_answers.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {task.correct_answers.map((answer, index) => (
                                            <Badge key={index} variant="outline">
                                                {answer}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
