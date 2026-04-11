import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import {store as storeTopics} from "@/routes/topics"

const textareaClassName =
    'min-h-24 max-h-[50dvh] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

type ModuleTopicsCreateProps = {
    moduleId: number;
};

export default function ModuleTopicsCreate({ moduleId }: ModuleTopicsCreateProps) {
    return (
        <Card className="overflow-y-auto border-sidebar-border/70 py-5">
            <CardHeader>
                <CardTitle>Create topic</CardTitle>
                <CardDescription>
                    Topics are the second level in the documentation hierarchy, directly inside a module.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...storeTopics.form()} method="post" resetOnSuccess={['name', 'description']} className="grid gap-4">
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="module_id" value={moduleId} />
                            <div className="grid gap-2">
                                <Label htmlFor="name">Topic name</Label>
                                <Input id="name" name="name" placeholder="Variables and data types" />
                                <InputError message={errors.name} />
                                <InputError message={errors.module_id} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className={textareaClassName}
                                    placeholder="Short explanation of what students will learn in this topic."
                                />
                                <InputError message={errors.description} />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Create topic
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}
