import type { ActiveChat, ChatMessage } from '@/components/chat/chat-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Paperclip, Send } from 'lucide-react';
import React, {useEffect, useRef, useState} from 'react';
import { route } from 'ziggy-js';
import { useEcho } from '@laravel/echo-react';
import { toast } from 'sonner';
import {useIsMobile} from "@/hooks/use-mobile";

type ChatThreadProps = {
    activeChat: ActiveChat | null;
};

type IncomingChatMessageEvent = {
    chat_id: number;
    sender_id: number;
    sender_name: string;
    text: string;
    sent_at: string | null;
    is_seen: boolean;
    files: Array<{
        id: number;
        file_name: string;
    }>;
};

function formatTimestamp(value: string | null): string {
    if (!value) {
        return '';
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
function sendViaShiftEnter(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    ref: React.RefObject<HTMLButtonElement | null>)
{
    if(event.code === 'Enter' && event.shiftKey){
        event.preventDefault();
        ref.current?.click();
    }
}
function MessageBubble({ message }: { message: ChatMessage }) {
    return (
        <div className={`flex ${message.is_mine ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2xl rounded-3xl px-4 py-3 ${message.is_mine ? 'bg-primary text-primary-foreground' : 'border bg-card'}`}>
                <div className="flex items-center gap-2 text-xs opacity-80">
                    <span>{message.sender_name}</span>
                    <span>{formatTimestamp(message.sent_at)}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{message.text}</p>
                {message.files.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {message.files.map((file) => (
                            <span
                                key={file.id}
                                className={`rounded-full px-3 py-1 text-xs ${message.is_mine ? 'bg-primary-foreground/15' : 'bg-muted text-muted-foreground'}`}
                            >
                                {file.file_name}
                            </span>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function getXsrfToken(): string { // need for laravel POST request if make request via fetch
    const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
    const xsrfCookie = cookies.find((cookie) => cookie.startsWith('XSRF-TOKEN='))?.slice(11);

    // cookies are encoded, so decode it
    return xsrfCookie ? decodeURIComponent(xsrfCookie) : '';
}

export default function ChatThread({ activeChat }: ChatThreadProps) {
    const { auth } = usePage<SharedData>().props;
    const [draft, setDraft] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>(activeChat?.messages ?? []);
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState<string | null>(null);

    const isMobile = useIsMobile();
    const messagesListRef = useRef<HTMLDivElement | null>(null);
    const sendButtonRef = useRef<HTMLButtonElement | null>(null);
    useEffect(() => {
        setMessages(activeChat?.messages ?? []);
    }, [activeChat?.messages]);

    useEffect(() => {
        if (sendError) {
            toast.error(sendError);
        }
    }, [sendError]);

    useEffect(() => { // scroll to bottom of messages list if new message received
        const element = messagesListRef.current;
        if (!element) {
            return;
        }
        element.scrollTop = element.scrollHeight;
    }, [messages]);

    useEcho(`chat.${activeChat?.id}`, '.chat.message.created', (event: IncomingChatMessageEvent) => {
        if (!activeChat || event.chat_id !== activeChat.id || event.sender_id === auth.user.id) {
            return;
        }

        setMessages((currentMessages) => [
            ...currentMessages,
            {
                id: Date.now(),
                sender_id: event.sender_id,
                sender_name: event.sender_name,
                text: event.text,
                sent_at: event.sent_at,
                is_mine: false,
                is_seen: event.is_seen,
                files: event.files,
            },
        ]);
    });
    const submitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!activeChat || draft.trim() === '' || isSending) {
            return;
        }

        setSendError(null);

        try {
            const response = await fetch(route('chats.messages.store', activeChat.id, false), {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getXsrfToken(),
                },
                body: JSON.stringify({ text: draft }),
            });

            const data = await response.json();
            if (!response.ok) {
                setSendError(data.message);
                return;
            }

            setDraft('');
            setMessages((currentMessages) => [...currentMessages, data.message]);
        } catch (error) {
            setSendError(`Failed to send message. Please try again. ${error}`);
        }
    };

    if (!activeChat) {
        return (
            <Card className="border-sidebar-border/70">
                <CardHeader>
                    <CardTitle>Open a chat</CardTitle>
                    <CardDescription>Select a chat from the list or create a new one to start messaging.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-3xl border border-dashed p-12 text-center text-sm text-muted-foreground">
                        The conversation area will show messages, participants, and the composer once a chat is selected.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-sidebar-border/70">
            <CardHeader className="border-b">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle>{activeChat.name}</CardTitle>
                        <CardDescription>{activeChat.participants.length} participants</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="outline">{activeChat.type}</Badge>
                        {activeChat.unread_count > 0 ? <Badge>{activeChat.unread_count} unread</Badge> : null}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid h-[68dvh] grid-rows-[minmax(0,1fr)_auto] gap-4 p-4">
                <div className="space-y-3 overflow-y-auto rounded-3xl bg-muted/20 p-3" ref={messagesListRef}>
                    {messages.length === 0 ? (
                        <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                            No messages yet. The first message in this chat will appear here.
                        </div>
                    ) : (
                        messages.map((message) => <MessageBubble key={message.id} message={message} />)
                    )}
                </div>

                <form
                    className="grid gap-3 rounded-3xl border bg-card p-4"
                    onSubmit={submitMessage}
                >
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {activeChat.participants.map((participant) => (
                            <span key={participant.id} className="rounded-full border px-3 py-1">
                                {participant.name}
                            </span>
                        ))}
                    </div>
                    <textarea
                        name="text"
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => sendViaShiftEnter(event, sendButtonRef)}
                        className="min-h-28 w-full resize-none rounded-2xl border bg-background px-4 py-3 text-sm outline-none"
                        placeholder="Write a message..."
                    />
                    {sendError ? <p className="text-sm text-destructive">{sendError}</p> : null}
                    <div className="flex items-center justify-between gap-3">
                        <Button type="button" variant="outline">
                            <Paperclip />
                            Attach file
                        </Button>
                        {(!isMobile) ?(
                            <div className="flex items-center gap-2">
                                <p className="text-muted-foreground text-xs">Shift + Enter</p>
                                <Button type="submit" disabled={draft.trim() === '' || isSending} ref={sendButtonRef}>
                                    <Send />
                                    {isSending ? 'Sending...' : 'Send'}
                                </Button>
                            </div>
                        ):
                            <Button type="submit" disabled={draft.trim() === '' || isSending} ref={sendButtonRef}>
                                <Send />
                                {isSending ? 'Sending...' : 'Send'}
                            </Button>
                        }

                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
