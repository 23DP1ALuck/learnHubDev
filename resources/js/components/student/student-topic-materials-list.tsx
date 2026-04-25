import type { StudentMaterialSummary } from '@/components/student/student-types';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
type StudentTopicMaterialsListProps = {
    materials: StudentMaterialSummary[];
};
export default function StudentTopicMaterialsList({
    materials,
}: StudentTopicMaterialsListProps) {
    const { t } = useTranslation();
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{t('learning.Materials')}</CardTitle>
                <CardDescription>
                    {t('learning.Learning resources attached to this topic.')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {materials.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        {t('student.No materials are available yet.')}
                    </div>
                ) : (
                    materials.map((material) => (
                        <Link
                            key={material.material_id}
                            href={route('student.materials.show', [
                                material.module_id,
                                material.topic_id,
                                material.material_id,
                            ])}
                            className="block rounded-xl border p-4 transition-colors hover:bg-muted/40"
                            prefetch
                        >
                            <p className="font-semibold">{material.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {material.description ||
                                    'No material description yet.'}
                            </p>
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
