import type { TeacherDashboardStats } from '@/components/teacher/teacher-dashboard-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type TeacherDashboardOverviewProps = {
    stats: TeacherDashboardStats;
};

export default function TeacherDashboardOverview({ stats }: TeacherDashboardOverviewProps) {
    return (
        <div className="grid gap-4 md:grid-cols-5">
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>Modules</CardDescription>
                    <CardTitle className="text-3xl">{stats.modules}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Top-level learning spaces you manage in the active organization.</CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>Topics</CardDescription>
                    <CardTitle className="text-3xl">{stats.topics}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Topic sections created inside your modules.</CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>Materials</CardDescription>
                    <CardTitle className="text-3xl">{stats.materials}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Learning resources currently attached to your topics.</CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>Assignments</CardDescription>
                    <CardTitle className="text-3xl">{stats.assignments}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Assignments available across the topics you manage.</CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>Tasks</CardDescription>
                    <CardTitle className="text-3xl">{stats.tasks}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Individual task items that students will answer inside assignments.</CardContent>
            </Card>
        </div>
    );
}
