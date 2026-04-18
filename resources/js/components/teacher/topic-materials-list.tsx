import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

type MaterialSummary = {
    material_id: number;
    title: string;
    description: string | null;
};

type TopicMaterialsListProps = {
    moduleId: number;
    topicId: number;
    materials: MaterialSummary[];
};

export default function TopicMaterialsList({ moduleId, topicId, materials }: TopicMaterialsListProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Materials</CardTitle>
                <CardDescription>Theory, links, files, and other topic resources.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {materials.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No materials yet for this topic.
                    </div>
                ) : (
                    materials.map((material) => (
                        <Link
                            key={material.material_id}
                            href={route('teacher.materials.show', [moduleId, topicId, material.material_id])}
                            className="block rounded-xl border p-4 transition-colors hover:bg-muted/40"
                            prefetch
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-semibold">{material.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {material.description || 'No material description yet.'}
                                    </p>
                                </div>
                                <span className="text-xs text-muted-foreground">#{material.material_id}</span>
                            </div>
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
