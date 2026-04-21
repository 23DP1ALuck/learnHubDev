import type { ChatRecipientPools, ChatRecipientScope } from '@/components/chat/chat-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Plus, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

type ChatCreateDialogProps = {
    recipientPools: ChatRecipientPools;
};

export default function ChatCreateDialog({ recipientPools }: ChatCreateDialogProps) {
    const initialScope: ChatRecipientScope = recipientPools.class.length > 0 ? 'CLASS' : 'ORGANIZATION';
    const [open, setOpen] = useState(false);
    const [chatType, setChatType] = useState<'PRIVATE' | 'GROUP'>('PRIVATE');
    const [scope, setScope] = useState<ChatRecipientScope>(initialScope);
    const [groupName, setGroupName] = useState('');
    const [selectedRecipientIds, setSelectedRecipientIds] = useState<number[]>([]);

    const recipients = useMemo(
        () => (scope === 'CLASS' ? recipientPools.class : recipientPools.organization),
        [recipientPools.class, recipientPools.organization, scope],
    );

    const canCreate =
        chatType === 'PRIVATE'
            ? selectedRecipientIds.length === 1
            : groupName.trim() !== '' && selectedRecipientIds.length >= 2;

    const reset = () => {
        setChatType('PRIVATE');
        setScope(initialScope);
        setGroupName('');
        setSelectedRecipientIds([]);
    };

    const toggleRecipient = (recipientId: number, checked: boolean) => {
        if (chatType === 'PRIVATE') {
            setSelectedRecipientIds(checked ? [recipientId] : []);
            return;
        }

        setSelectedRecipientIds((currentIds) =>
            checked ? [...currentIds.filter((id) => id !== recipientId), recipientId] : currentIds.filter((id) => id !== recipientId),
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);

                if (!nextOpen) {
                    reset();
                }
            }}
        >
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    New chat
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Create chat</DialogTitle>
                    <DialogDescription>
                        For the MVP, let users start private chats or create custom groups. Module chats remain a separate system type from the documentation.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <p className="text-sm font-medium">Chat type</p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: 'PRIVATE' as const, label: 'Private', description: 'One recipient', disabled: false },
                                { value: 'GROUP' as const, label: 'Group', description: 'Multiple recipients', disabled: false },
                                { value: null, label: 'Module', description: 'Created automatically', disabled: true },
                            ].map((option) => (
                                <button
                                    key={option.label}
                                    type="button"
                                    disabled={option.disabled}
                                    onClick={() => {
                                        if (option.disabled || !option.value) {
                                            return;
                                        }

                                        setChatType(option.value);
                                        setSelectedRecipientIds([]);
                                    }}
                                    className={cn(
                                        'rounded-2xl border px-4 py-3 text-left transition-colors',
                                        option.disabled && 'cursor-not-allowed opacity-50',
                                        !option.disabled && chatType === option.value && 'border-primary bg-primary/5',
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{option.label}</span>
                                        {option.disabled ? <Badge variant="outline">System</Badge> : null}
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {chatType === 'GROUP' && (
                        <div className="grid gap-2">
                            <label htmlFor="group-name" className="text-sm font-medium">
                                Group name
                            </label>
                            <Input
                                id="group-name"
                                value={groupName}
                                onChange={(event) => setGroupName(event.target.value)}
                                placeholder="Ex. Biology help group"
                            />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <p className="text-sm font-medium">Recipient scope</p>
                        <div className="flex gap-2">
                            {recipientPools.class.length > 0 && (
                                <Button
                                    type="button"
                                    variant={scope === 'CLASS' ? 'default' : 'outline'}
                                    onClick={() => {
                                        setScope('CLASS');
                                        setSelectedRecipientIds([]);
                                    }}
                                >
                                    My class
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant={scope === 'ORGANIZATION' ? 'default' : 'outline'}
                                onClick={() => {
                                    setScope('ORGANIZATION');
                                    setSelectedRecipientIds([]);
                                }}
                            >
                                Organization
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-3 rounded-3xl border bg-card/50 p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">
                                    {scope === 'CLASS' ? 'Students in your class' : 'Students in the organization'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {chatType === 'PRIVATE'
                                        ? 'Select one recipient for a private conversation.'
                                        : 'Select at least two recipients for the group chat.'}
                                </p>
                            </div>
                            <Badge variant="secondary">{recipients.length}</Badge>
                        </div>

                        {recipients.length === 0 ? (
                            <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                                No recipients are available in this scope yet.
                            </div>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {recipients.map((recipient) => {
                                    const isChecked = selectedRecipientIds.includes(recipient.id);

                                    return (
                                        <label
                                            key={recipient.id}
                                            className={cn(
                                                'flex items-start gap-3 rounded-2xl border p-4 transition-colors',
                                                isChecked && 'border-primary bg-primary/5',
                                            )}
                                        >
                                            <Checkbox
                                                checked={isChecked}
                                                onCheckedChange={(checked) => toggleRecipient(recipient.id, checked === true)}
                                            />
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{recipient.name}</p>
                                                    {recipient.group_name ? <Badge variant="outline">{recipient.group_name}</Badge> : null}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{recipient.email || 'No email provided'}</p>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="button" disabled={!canCreate}>
                        <Users />
                        Create chat
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
