export type ChatType = 'GROUP' | 'MODULE' | 'PRIVATE';
export type ChatRecipientScope = 'CLASS' | 'ORGANIZATION';

export type ChatStats = {
    total: number;
    unread: number;
    private: number;
    groups: number;
    modules: number;
};

export type ChatSummary = {
    id: number;
    name: string;
    type: ChatType;
    unread_count: number;
    last_message_text: string | null;
    last_message_at: string | null;
    last_sender_name: string | null;
    participants_preview: string[];
};

export type ChatParticipant = {
    id: number;
    name: string;
    email: string | null;
    role: 'OWNER' | 'MEMBER' | null;
};

export type ChatMessageFile = {
    id: number;
    file_name: string;
};

export type ChatMessage = {
    id: number;
    sender_id: number;
    sender_name: string;
    text: string;
    sent_at: string | null;
    is_mine: boolean;
    is_seen: boolean;
    files: ChatMessageFile[];
};

export type ActiveChat = {
    id: number;
    name: string;
    type: ChatType;
    unread_count: number;
    participants: ChatParticipant[];
    messages: ChatMessage[];
};

export type ChatRecipient = {
    id: number;
    name: string;
    email: string | null;
    role_in_org: 'STUDENT' | 'TEACHER' | 'ORGANIZATION_OWNER' | null;
    group_name?: string | null;
    module_names?: string[] | null;
};

export type ChatRecipientPools = {
    class: ChatRecipient[];
    organization: ChatRecipient[];
};
