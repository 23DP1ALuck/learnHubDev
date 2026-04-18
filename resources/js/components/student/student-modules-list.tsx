import type { StudentModuleSummary } from '@/components/student/student-types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

type StudentModulesListProps = {
    modules: StudentModuleSummary[];
};

export default function StudentModulesList({ modules }: StudentModulesListProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Modules</CardTitle>
                <CardDescription>All modules available to the current student organization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {modules.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No modules are available yet.
                    </div>
                ) : (
                    modules.map((module) => (
                        <Link key={module.id} href={route('student.modules.show', module.id)} className="block rounded-xl border p-4 transition-colors hover:bg-muted/40">
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                    <p className="font-semibold">{module.name}</p>
                                    <p className="text-sm text-muted-foreground">{module.description || 'No module description yet.'}</p>
                                </div>
                                <Badge variant="outline">{module.assignments_count} assignments</Badge>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span>{module.topics_count} topics</span>
                                <span>Start: {module.start_date || 'Not set'}</span>
                                <span>End: {module.end_date || 'Not set'}</span>
                            </div>
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
