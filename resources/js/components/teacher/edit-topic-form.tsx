import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {DeleteModule} from "@/components/teacher/delete-module";
import {DeleteTopic} from "@/components/teacher/delete-topic";

const textareaClassName =
    'min-h-32 max-h-[50dvh] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

type EditTopicFormProps = {
    topic: {
        topic_id: number;
        module_id: number;
        name: string;
        description: string | null;
    };
};

export default function EditTopicForm({ topic }: EditTopicFormProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Topic details</CardTitle>
                <CardDescription>
                    Change the topic title and summary shown inside the module workspace.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form action={route('topics.update', [topic.module_id, topic.topic_id])} method="patch" className="grid gap-4">
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="module_id" value={topic.module_id} />
                            <div className="grid gap-2">
                                <Label htmlFor="name">Topic name</Label>
                                <Input id="name" name="name" defaultValue={topic.name} />
                                <InputError message={errors.name} />
                                <InputError message={errors.module_id} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    defaultValue={topic.description ?? ''}
                                    className={textareaClassName}
                                    placeholder="Short explanation of what students will learn in this topic."
                                />
                                <InputError message={errors.description} />
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <Button variant="outline" asChild>
                                    <Link href={route('teacher.topics.show', [topic.module_id, topic.topic_id])}>Back to topic</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Save changes
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
            <div className="w-full px-4">
                <DeleteTopic topic={{topic_id: topic.topic_id, name: topic.name, module_id: topic.module_id}} onFullWidth={true}/>
            </div>
        </Card>
    );
}
