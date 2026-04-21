import type { ChatStats } from '@/components/chat/chat-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ChatStatsProps = {
    stats: ChatStats;
};

export default function ChatStatsCards({ stats }: ChatStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-5">
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>Total chats</CardDescription>
                    <CardTitle className="text-3xl">{stats.total}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">All chats visible in the active organization.</CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>Unread</CardDescription>
                    <CardTitle className="text-3xl">{stats.unread}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Messages that still need to be opened and read.</CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>Private</CardDescription>
                    <CardTitle className="text-3xl">{stats.private}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">One-to-one conversations between organization members.</CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>Groups</CardDescription>
                    <CardTitle className="text-3xl">{stats.groups}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Custom group chats created for collaboration.</CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>Module chats</CardDescription>
                    <CardTitle className="text-3xl">{stats.modules}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">System chats tied directly to a teaching module.</CardContent>
            </Card>
        </div>
    );
}
