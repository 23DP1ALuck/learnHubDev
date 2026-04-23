import type { ChatRecipientPools, ChatRecipientScope } from '@/components/chat/chat-types';
import InputError from '@/components/input-error';
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
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { Plus, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { route } from 'ziggy-js';

type ChatCreateDialogProps = {
    recipientPools: ChatRecipientPools;
};

export default function ChatCreateDialog({ recipientPools }: ChatCreateDialogProps) {
    console.log(recipientPools);
    const { auth } = usePage<SharedData>().props;
    const initialScope: ChatRecipientScope = recipientPools.class.length > 0 ? 'CLASS' : 'ORGANIZATION';
    const [open, setOpen] = useState(false);
    const [chatType, setChatType] = useState<'PRIVATE' | 'GROUP'>('PRIVATE');
    const [scope, setScope] = useState<ChatRecipientScope>(initialScope);
    const [groupName, setGroupName] = useState('');
    const [selectedRecipientIds, setSelectedRecipientIds] = useState<number[]>([]);

    // hook to get recipients based on scope and not to reread the data every time
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
    const formatRole = (role: string) => {
        switch (role) {
            case 'TEACHER':
                return 'Teacher';
            case 'STUDENT':
                return 'Student';
            case 'ORGANIZATION_OWNER':
                return 'Administration';
            default:
                return role;
        }
    }

    const toggleRecipient = (recipientId: number, checked: boolean) => {
        if (chatType === 'PRIVATE') { // if private chat select new one, remove from old one
            setSelectedRecipientIds(checked ? [recipientId] : []);
            return;
        }
        // otherwise allow to select more than one
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

                <Form
                    action={route('chats.store')}
                    method="post"
                    onSuccess={() => {
                        setOpen(false);
                        reset();
                    }}
                    className="grid gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="type" value={chatType} />
                            <input type="hidden" name="organization_id" value={auth.currentOrganization?.id ?? ''} />
                            {chatType !== 'GROUP' ? <input type="hidden" name="name" value="" /> : null}
                            {selectedRecipientIds.map((recipientId) => (
                                <input key={recipientId} type="hidden" name="recipient_ids[]" value={recipientId} />
                            ))}

                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <p className="text-sm font-medium">Chat type</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { value: 'PRIVATE' as const, label: 'Private', description: 'One recipient', disabled: false },
                                            { value: 'GROUP' as const, label: 'Group', description: 'Multiple recipients', disabled: false },
                                            { value: null, label: 'Module', description: 'Created automatically', disabled: true },
                                        ].map((option) => (
                                            <Button
                                                key={option.label}
                                                type="button"
                                                variant={option.disabled ? 'outline' : chatType === option.value ? 'default' : 'outline'}
                                                disabled={option.disabled}
                                                onClick={() => {
                                                    if (option.disabled || !option.value) {
                                                        return;
                                                    }

                                                    setChatType(option.value);
                                                    setSelectedRecipientIds([]);
                                                }}
                                                className={cn(
                                                    'h-auto min-w-44 flex-col items-start rounded-2xl px-4 py-3 text-left whitespace-normal',
                                                    option.disabled && 'cursor-not-allowed opacity-50',
                                                )}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{option.label}</span>
                                                    {option.disabled ? <Badge variant="outline">System</Badge> : null}
                                                </div>
                                                <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
                                            </Button>
                                        ))}
                                    </div>
                                    <InputError message={errors.type} />
                                </div>

                                {chatType === 'GROUP' && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="group-name">
                                            Group name
                                        </Label>
                                        <Input
                                            id="group-name"
                                            name="name"
                                            value={groupName}
                                            onChange={(event) => setGroupName(event.target.value)}
                                            placeholder="Ex. Biology help group"
                                        />
                                        <InputError message={errors.name} />
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

                                <div className="grid gap-3 rounded-3xl border bg-card/50 p-4 max-h-[30vh] overflow-y-auto">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-medium">
                                                {scope === 'CLASS' ? 'Group members' : 'Users in the organization'}
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
                                                const checkboxId = `recipient-${recipient.id}`;

                                                return (
                                                    <Label
                                                        key={recipient.id}
                                                        htmlFor={checkboxId}
                                                        className={cn(
                                                            'flex items-start gap-3 rounded-2xl border p-4 transition-colors',
                                                            isChecked && 'border-primary bg-primary/5',
                                                        )}
                                                    >
                                                        <Checkbox
                                                            id={checkboxId}
                                                            checked={isChecked}
                                                            onCheckedChange={(checked) => toggleRecipient(recipient.id, checked === true)}
                                                        />
                                                        <div className="min-w-0 overflow-y-auto space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium">{recipient.name}</p>
                                                                {recipient.group_name ? <Badge variant="outline">{recipient.group_name}</Badge> : null}
                                                                {
                                                                    (recipient.role_in_org === 'TEACHER' ||
                                                                        recipient.role_in_org === 'ORGANIZATION_OWNER')
                                                                    &&
                                                                    <Badge variant="outline">
                                                                        {formatRole(recipient.role_in_org)}
                                                                    </Badge>}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">{recipient.email || 'No email provided'}</p>
                                                            <div className="flex">
                                                                {recipient.module_names ? recipient.module_names.map((name) =>
                                                                    <Badge variant={"outline"}>{name}</Badge>) : null}
                                                            </div>

                                                        </div>
                                                    </Label>
                                                );
                                            })}
                                        </div>
                                    )}
                                    <InputError message={errors.recipient_ids || errors['recipient_ids.0']} />
                                </div>

                                <InputError message={errors.organization_id} />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={!canCreate || processing}>
                                    <Users />
                                    Create chat
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
