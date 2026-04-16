import type { StudentMaterialSummary } from '@/components/student/student-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type StudentTopicMaterialsListProps = {
    materials: StudentMaterialSummary[];
};

export default function StudentTopicMaterialsList({ materials }: StudentTopicMaterialsListProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Materials</CardTitle>
                <CardDescription>Learning resources attached to this topic.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {materials.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No materials are available yet.
                    </div>
                ) : (
                    materials.map((material) => (
                        <div key={material.material_id} className="rounded-xl border p-4">
                            <p className="font-semibold">{material.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{material.description || 'No material description yet.'}</p>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
