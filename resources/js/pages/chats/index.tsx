import ChatCreateDialog from '@/components/chat/chat-create-dialog';
import ChatList from '@/components/chat/chat-list';
import ChatThread from '@/components/chat/chat-thread';
import type {
    ActiveChat,
    ChatRecipientPools,
    ChatSummary,
} from '@/components/chat/chat-types';
import { useTranslation } from '@/hooks/use-translation';
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
const emptyRecipients: ChatRecipientPools = {
    class: [],
    organization: [],
};
export default function ChatsPage({
    chats = [],
    activeChat = null,
    recipientPools = emptyRecipients,
}: {
    chats?: ChatSummary[];
    activeChat?: ActiveChat | null;
    recipientPools?: ChatRecipientPools;
}) {
    const { t } = useTranslation();
    const { flash } = usePage<Flash>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('chat.Chats')} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {t('chat.Chats')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t(
                                'chat.Chat workspace for private conversations, custom groups, and module chats.',
                            )}
                        </p>
                    </div>
                    <ChatCreateDialog recipientPools={recipientPools} />
                </div>

                <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(20rem,24rem)_minmax(0,1fr)]">
                    <ChatList
                        chats={chats}
                        activeChatId={activeChat?.id ?? null}
                    />
                    <ChatThread activeChat={activeChat} />
                </div>
            </div>
        </AppLayout>
    );
}
