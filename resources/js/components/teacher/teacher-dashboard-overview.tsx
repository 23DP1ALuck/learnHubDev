import type { TeacherDashboardStats } from '@/components/teacher/teacher-dashboard-types';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
type TeacherDashboardOverviewProps = {
    stats: TeacherDashboardStats;
};
export default function TeacherDashboardOverview({
    stats,
}: TeacherDashboardOverviewProps) {
    const { t } = useTranslation();
    return (
        <div className="grid gap-4 md:grid-cols-5">
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>{t('learning.Modules')}</CardDescription>
                    <CardTitle className="text-3xl">{stats.modules}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    {t(
                        'teacher.Top-level learning spaces you manage in the active organization.',
                    )}
                </CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>{t('learning.Topics')}</CardDescription>
                    <CardTitle className="text-3xl">{stats.topics}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    {t('teacher.Topic sections created inside your modules.')}
                </CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>{t('learning.Materials')}</CardDescription>
                    <CardTitle className="text-3xl">
                        {stats.materials}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    {t(
                        'teacher.Learning resources currently attached to your topics.',
                    )}
                </CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>
                        {t('learning.Assignments')}
                    </CardDescription>
                    <CardTitle className="text-3xl">
                        {stats.assignments}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    {t(
                        'teacher.Assignments available across the topics you manage.',
                    )}
                </CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>{t('learning.Tasks')}</CardDescription>
                    <CardTitle className="text-3xl">{stats.tasks}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    {t(
                        'teacher.Individual task items that students will answer inside assignments.',
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
