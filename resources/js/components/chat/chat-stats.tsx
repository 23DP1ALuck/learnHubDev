import type { ChatStats } from '@/components/chat/chat-types';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
type ChatStatsProps = {
    stats: ChatStats;
};
export default function ChatStatsCards({ stats }: ChatStatsProps) {
    const { t } = useTranslation();
    return (
        <div className="grid gap-4 md:grid-cols-5">
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>{t('chat.Total chats')}</CardDescription>
                    <CardTitle className="text-3xl">{stats.total}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    {t('chat.All chats visible in the active organization.')}
                </CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>{t('common.Unread')}</CardDescription>
                    <CardTitle className="text-3xl">{stats.unread}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    {t('chat.Messages that still need to be opened and read.')}
                </CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>{t('chat.Private')}</CardDescription>
                    <CardTitle className="text-3xl">{stats.private}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    {t(
                        'chat.One-to-one conversations between organization members.',
                    )}
                </CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>{t('owner.Groups')}</CardDescription>
                    <CardTitle className="text-3xl">{stats.groups}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    {t('chat.Custom group chats created for collaboration.')}
                </CardContent>
            </Card>
            <Card className="border-sidebar-border/70">
                <CardHeader className="pb-2">
                    <CardDescription>{t('chat.Module chats')}</CardDescription>
                    <CardTitle className="text-3xl">{stats.modules}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    {t('chat.System chats tied directly to a teaching module.')}
                </CardContent>
            </Card>
        </div>
    );
}
