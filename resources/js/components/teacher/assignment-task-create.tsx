import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';

const textareaClassName =
    'min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

const nativeSelectClassName =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

type AssignmentTaskCreateProps = {
    assignmentId: number;
};

export default function AssignmentTaskCreate({ assignmentId }: AssignmentTaskCreateProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Create task</CardTitle>
                <CardDescription>
                    Use auto-gradable types for quiz-like tasks, or manual types for essays and file submissions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form action="/tasks" method="post" resetOnSuccess={['question_text', 'task_type', 'max_points', 'correct_answers']} className="grid gap-4">
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="assignment_id" value={assignmentId} />
                            <div className="grid gap-2">
                                <Label htmlFor="question_text">Task question</Label>
                                <textarea
                                    id="question_text"
                                    name="question_text"
                                    className={textareaClassName}
                                    placeholder="Write the question, prompt, or submission instructions."
                                />
                                <InputError message={errors.question_text} />
                                <InputError message={errors.assignment_id} />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="task_type">Task type</Label>
                                    <select id="task_type" name="task_type" className={nativeSelectClassName} defaultValue="TEST">
                                        <option value="TEST">Test</option>
                                        <option value="TEXT">Text answer</option>
                                        <option value="FILE">File upload</option>
                                        <option value="YES_NO">Yes / No</option>
                                        <option value="NUMBER">Number</option>
                                    </select>
                                    <InputError message={errors.task_type} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="max_points">Max points</Label>
                                    <Input id="max_points" name="max_points" type="number" min="0" step="0.5" defaultValue="10" />
                                    <InputError message={errors.max_points} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Correct answers</Label>
                                <p className="text-sm text-muted-foreground">
                                    Fill these for auto-gradable task types. Leave them empty for manual grading tasks.
                                </p>
                                <div className="grid gap-2">
                                    {[1, 2, 3, 4].map((index) => (
                                        <Input key={index} name="correct_answers[]" placeholder={`Correct answer ${index}`} />
                                    ))}
                                </div>
                                <InputError message={errors.correct_answers} />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Create task
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}
