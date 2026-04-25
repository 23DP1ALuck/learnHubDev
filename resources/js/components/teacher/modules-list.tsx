import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import moment from 'moment';
import { route } from 'ziggy-js';
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
    const { t } = useTranslation();
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{t('learning.Modules')}</CardTitle>
                <CardDescription>
                    {t(
                        'teacher.Open a module to manage its topics. Materials and assignments are intentionally not top-level routes.',
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {modules.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        {t(
                            'teacher.No modules yet. Create the first module to start structuring your course.',
                        )}
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
                                        <p className="text-lg font-semibold">
                                            {module.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {module.description ||
                                                'No module description yet.'}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                        <span>
                                            Topics: {module.topics_count}
                                        </span>
                                        <span>
                                            Start:{' '}
                                            {module.start_date
                                                ? moment(
                                                      module.start_date,
                                                  ).format('MMM Do Y')
                                                : t('common.Not set')}
                                        </span>
                                        <span>
                                            End:{' '}
                                            {module.end_date
                                                ? moment(
                                                      module.end_date,
                                                  ).format('MMM Do Y')
                                                : t('common.Not set')}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-primary">
                                    {t('common.Open')}
                                </span>
                            </div>
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
