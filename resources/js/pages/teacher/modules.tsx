import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';

type TeacherModule = {
    id: number;
    name: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    topics_count: number;
    created_at: string | null;
};

type ContentStats = {
    modules: number;
    topics: number;
    materials: number;
    assignments: number;
    tasks: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Modules',
        href: '/teacher/modules',
    },
];

const textareaClassName =
    'min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

export default function TeacherModulesPage({
    stats,
    modules,
}: {
    stats: ContentStats;
    modules: TeacherModule[];
}) {
    const { flash } = usePage<Flash>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teacher modules" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <Card className="border-sidebar-border/70">
                    <CardHeader>
                        <CardTitle>Learning workspace</CardTitle>
                        <CardDescription>
                            Start with modules, then build topics inside them. Materials and assignments live on the topic level, and tasks live inside assignments.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-5">
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Modules</p>
                            <p className="mt-1 text-3xl font-semibold">{stats.modules}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Topics</p>
                            <p className="mt-1 text-3xl font-semibold">{stats.topics}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Materials</p>
                            <p className="mt-1 text-3xl font-semibold">{stats.materials}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Assignments</p>
                            <p className="mt-1 text-3xl font-semibold">{stats.assignments}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground">Tasks</p>
                            <p className="mt-1 text-3xl font-semibold">{stats.tasks}</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(22rem,0.9fr)]">
                    <Card className="border-sidebar-border/70">
                        <CardHeader>
                            <CardTitle>Modules</CardTitle>
                            <CardDescription>
                                Open a module to manage its topics. Materials and assignments are intentionally not top-level routes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {modules.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                                    No modules yet. Create the first module to start structuring your course.
                                </div>
                            ) : (
                                modules.map((module) => (
                                    <Link
                                        key={module.id}
                                        href={`/teacher/modules/${module.id}`}
                                        className="block rounded-xl border p-4 transition-colors hover:bg-muted/40"
                                        prefetch
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-lg font-semibold">{module.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {module.description || 'No module description yet.'}
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                    <span>Topics: {module.topics_count}</span>
                                                    <span>Start: {module.start_date || 'Not set'}</span>
                                                    <span>End: {module.end_date || 'Not set'}</span>
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium text-primary">Open</span>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border/70">
                        <CardHeader>
                            <CardTitle>Create module</CardTitle>
                            <CardDescription>
                                Modules are the first level in the structure described in your documentation.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form action="/modules" method="post" resetOnSuccess={['name', 'description', 'start_date', 'end_date']} className="grid gap-4">
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Module name</Label>
                                            <Input id="name" name="name" placeholder="Programming fundamentals" />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="description">Description</Label>
                                            <textarea id="description" name="description" className={textareaClassName} placeholder="What this module covers, learning goals, or expected outcomes." />
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
                </div>
            </div>
        </AppLayout>
    );
}
