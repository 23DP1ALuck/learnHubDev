import type { TeacherDashboardModule } from '@/components/teacher/teacher-dashboard-types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

type TeacherDashboardModulesProps = {
    modules: TeacherDashboardModule[];
};

export default function TeacherDashboardModules({ modules }: TeacherDashboardModulesProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Recent modules</CardTitle>
                <CardDescription>The latest modules in your teaching workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {modules.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No modules are available yet.
                    </div>
                ) : (
                    modules.map((module) => (
                        <Link
                            key={module.id}
                            href={route('teacher.modules.show', module.id)}
                            className="block rounded-xl border p-4 transition-colors hover:bg-muted/40"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-semibold">{module.name}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {module.description || 'No module description yet.'}
                                    </p>
                                </div>
                                <Badge variant="outline">{module.topics_count} topics</Badge>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span>{module.assignments_count} assignments</span>
                                <span>{module.start_date || 'No start date'} - {module.end_date || 'No end date'}</span>
                            </div>
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
