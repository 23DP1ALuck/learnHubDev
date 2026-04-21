import ChatCreateDialog from '@/components/chat/chat-create-dialog';
import ChatList from '@/components/chat/chat-list';
import ChatStatsCards from '@/components/chat/chat-stats';
import ChatThread from '@/components/chat/chat-thread';
import type { ActiveChat, ChatRecipientPools, ChatStats, ChatSummary } from '@/components/chat/chat-types';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chats',
        href: route('chats'),
    },
];

const emptyStats: ChatStats = {
    total: 0,
    unread: 0,
    private: 0,
    groups: 0,
    modules: 0,
};

const emptyRecipients: ChatRecipientPools = {
    class: [],
    organization: [],
};

export default function ChatsPage({
    stats = emptyStats,
    chats = [],
    activeChat = null,
    recipientPools = emptyRecipients,
}: {
    stats?: ChatStats;
    chats?: ChatSummary[];
    activeChat?: ActiveChat | null;
    recipientPools?: ChatRecipientPools;
}) {
    const { flash } = usePage<Flash>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chats" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Chats</h1>
                        <p className="text-sm text-muted-foreground">
                           Chat workspace for private conversations, custom groups, and module chats.
                        </p>
                    </div>
                    <ChatCreateDialog recipientPools={recipientPools} />
                </div>

                <ChatStatsCards stats={stats} />

                <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(20rem,24rem)_minmax(0,1fr)]">
                    <ChatList chats={chats} activeChatId={activeChat?.id ?? null} />
                    <ChatThread activeChat={activeChat} />
                </div>
            </div>
        </AppLayout>
    );
}
