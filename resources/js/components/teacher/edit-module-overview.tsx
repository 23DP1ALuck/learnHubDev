import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
type EditModuleOverviewProps = {
    module: {
        id: number;
        name: string;
        description: string | null;
        start_date: string | null;
        end_date: string | null;
        created_at: string | null;
    };
    stats: {
        topics: number;
        materials: number;
        topic_assignments: number;
    };
};
export default function EditModuleOverview({
    module,
    stats,
}: EditModuleOverviewProps) {
    const { t } = useTranslation();
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{t('learning.Edit module')}</CardTitle>
                <CardDescription>
                    {t(
                        'teacher.Update the core details of this module without changing its topics, materials, or assignments.',
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-5">
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                        {t('learning.Topics')}
                    </p>
                    <p className="mt-1 text-3xl font-semibold">
                        {stats.topics}
                    </p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                        {t('learning.Materials')}
                    </p>
                    <p className="mt-1 text-3xl font-semibold">
                        {stats.materials}
                    </p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                        {t('learning.Assignments')}
                    </p>
                    <p className="mt-1 text-3xl font-semibold">
                        {stats.topic_assignments}
                    </p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Start</p>
                    <p className="mt-1 text-sm font-medium">
                        {module.start_date || t('common.Not set')}
                    </p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">End</p>
                    <p className="mt-1 text-sm font-medium">
                        {module.end_date || t('common.Not set')}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
