import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import {route} from "ziggy-js";

const textareaClassName =
    'min-h-24 max-h-[50dvh] w-full resize-y overflow-auto rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

export default function ModulesCreate() {
    return (
        <Card className="border-sidebar-border/70 overflow-y-auto h-full max-h-[60dvh]">
            <CardHeader>
                <CardTitle>Create module</CardTitle>
                <CardDescription>
                    Modules are the first level in the structure described in your documentation.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form action={route('modules.store')} method="post" resetOnSuccess={['name', 'description', 'start_date', 'end_date']} className="grid gap-4">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Module name</Label>
                                <Input id="name" name="name" placeholder="Programming fundamentals" />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className={textareaClassName}
                                    placeholder="What this module covers, learning goals, or expected outcomes."
                                />
                                <InputError message={errors.description} />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="start_date">Start date</Label>
                                    <Input id="start_date" name="start_date" type="date" />
                                    <InputError message={errors.start_date} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end_date">End date</Label>
                                    <Input id="end_date" name="end_date" type="date" />
                                    <InputError message={errors.end_date} />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Create module
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}
