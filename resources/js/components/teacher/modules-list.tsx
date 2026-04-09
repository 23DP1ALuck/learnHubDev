import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import {route} from "ziggy-js";

type TeacherModule = {
    id: number;
    name: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    topics_count: number;
};

type ModulesListProps = {
    modules: TeacherModule[];
};

export default function ModulesList({ modules }: ModulesListProps) {
    return (
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
                            href={route('teacher.modules.show', module.id)}
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
    );
}
