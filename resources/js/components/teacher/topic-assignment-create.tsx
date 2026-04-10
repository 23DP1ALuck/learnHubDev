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

type TopicAssignmentCreateProps = {
    moduleId: number;
    topicId: number;
};

export default function TopicAssignmentCreate({ moduleId, topicId }: TopicAssignmentCreateProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Create assignment</CardTitle>
                <CardDescription>
                    Assignments live on the topic level. Tasks are added later on the assignment page.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form action="/assignments" method="post" resetOnSuccess={['title', 'description', 'grading_policy', 'due_date']} className="grid gap-4">
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="topics[0][module_id]" value={moduleId} />
                            <input type="hidden" name="topics[0][topic_id]" value={topicId} />
                            <div className="grid gap-2">
                                <Label htmlFor="assignment-title">Assignment title</Label>
                                <Input id="assignment-title" name="title" placeholder="Homework 1" />
                                <InputError message={errors.title} />
                                <InputError message={errors.topics} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="assignment-description">Description</Label>
                                <textarea
                                    id="assignment-description"
                                    name="description"
                                    className={textareaClassName}
                                    placeholder="Explain what students need to submit or answer."
                                />
                                <InputError message={errors.description} />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="grading_policy">Grading policy</Label>
                                    <select id="grading_policy" name="grading_policy" className={nativeSelectClassName} defaultValue="FORMATIVE">
                                        <option value="FORMATIVE">Formative</option>
                                        <option value="SUMMATIVE">Summative</option>
                                    </select>
                                    <InputError message={errors.grading_policy} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="due_date">Due date</Label>
                                    <Input id="due_date" name="due_date" type="date" />
                                    <InputError message={errors.due_date} />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Add assignment
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}
