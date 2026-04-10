import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';

const textareaClassName =
    'min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

type TopicMaterialCreateProps = {
    moduleId: number;
    topicId: number;
};

export default function TopicMaterialCreate({ moduleId, topicId }: TopicMaterialCreateProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Create material</CardTitle>
                <CardDescription>
                    Materials belong to a topic, so they stay inside this topic workspace rather than getting their own top-level route.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form action="/materials" method="post" resetOnSuccess={['title', 'description']} className="grid gap-4">
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="module_id" value={moduleId} />
                            <input type="hidden" name="topic_id" value={topicId} />
                            <div className="grid gap-2">
                                <Label htmlFor="title">Material title</Label>
                                <Input id="title" name="title" placeholder="Slides: introduction to variables" />
                                <InputError message={errors.title} />
                                <InputError message={errors.module_id} />
                                <InputError message={errors.topic_id} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className={textareaClassName}
                                    placeholder="Short summary or instructions for this material."
                                />
                                <InputError message={errors.description} />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Add material
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}
