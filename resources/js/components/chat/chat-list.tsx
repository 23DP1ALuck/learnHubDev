import type { ChatSummary, ChatType } from '@/components/chat/chat-types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { route } from 'ziggy-js';

type ChatListProps = {
    chats: ChatSummary[];
    activeChatId?: number | null;
};

function typeLabel(type: ChatType): string {
    switch (type) {
        case 'GROUP':
            return 'Group';
        case 'MODULE':
            return 'Module';
        default:
            return 'Private';
    }
}

function formatTimestamp(value: string | null): string {
    if (!value) {
        return 'No messages yet';
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    return parsed.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function ChatList({ chats, activeChatId }: ChatListProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader className="gap-3">
                <div>
                    <CardTitle>Chats</CardTitle>
                    <CardDescription>Private, group, and module conversations.</CardDescription>
                </div>
                <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-9" placeholder="Search chats" />
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {chats.length === 0 ? (
                    <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No chats are available yet.
                    </div>
                ) : (
                    chats.map((chat) => (
                        <Link
                            key={chat.id}
                            href={route('chats', { chat: chat.id })}
                            className={cn(
                                'block rounded-2xl border p-4 transition-colors hover:bg-muted/40',
                                activeChatId === chat.id && 'border-primary bg-primary/5',
                            )}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="truncate font-semibold">{chat.name}</p>
                                        <Badge variant="outline">{typeLabel(chat.type)}</Badge>
                                    </div>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {chat.last_sender_name ? `${chat.last_sender_name}: ` : ''}
                                        {chat.last_message_text || 'No messages yet.'}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-xs text-muted-foreground">{formatTimestamp(chat.last_message_at)}</span>
                                    {chat.unread_count > 0 ? <Badge>{chat.unread_count}</Badge> : null}
                                </div>
                            </div>
                            {chat.participants_preview.length > 0 ? (
                                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    {chat.participants_preview.slice(0, 3).map((participant) => (
                                        <span key={participant}>{participant}</span>
                                    ))}
                                    {chat.participants_preview.length > 3 ? <span>+{chat.participants_preview.length - 3} more</span> : null}
                                </div>
                            ) : null}
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
