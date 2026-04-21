<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreChatRequest;
use App\Models\Chat;
use App\Models\ChatMessage;
use App\Models\ChatUser;
use App\Models\Organization;
use App\Models\SchoolGroup;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    public function chats(Request $request, ?int $chat = null): Response|RedirectResponse
    {
        $user = $request->user();
        if (!$user) {
            return redirect()->route('login');
        }
        $organizationId = $request->session()->get('activeOrganization');

        if (!$organizationId) {
            return redirect()->route('dashboard')->with('afterLogin', true);
        }

        $organization = $user->organizations()->where('organizations.id', $organizationId)->first();
        if (!$organization) {
            return redirect()->route('dashboard')->with('afterLogin', true);
        }


        $groupId = $organization->pivot?->group_id;

        $group = $this->getGroup($groupId, $organization);

        $classPools = $this->getClassPools($group, $user, $organization); // for user list

        $chatsUsers = $this->getChats($user);


        $activeChat = null;

        if ($chat !== null) {
            $activeChat = Chat::query()
                ->where('chat_id', $chat)
                ->with(['users', 'messages'])
                ->first();
            if(!$activeChat){
                return redirect()->route('chats')->with('error', 'Chat not found');
            }
            $belongsToChat =  $activeChat?->users()->where('user_id', $user->id)->exists();
            if(!$belongsToChat){
                return redirect()->route('chats')->with('error', 'You are not a member of this chat');
            }

            $messages = $activeChat->messages()->with('sender')->get();
            $chatMessages = $messages->map(function (ChatMessage $message) use ($user){
                $sender = $message->sender;
                return [
                    'id' => $message->message_id,
                    'sender_id' => $message->sender_id,
                    'sender_name' => $sender->name,
                    'text' => $message->text,
                    'sent_at' => $message->sent_at,
                    'is_mine' =>  $sender->id === $user->id,
                    'is_seen' => false,
                    'files' => [],
                ];
            });
            $chatUser = ChatUser::query()
                ->where('chat_id', $chat)
                ->where('user_id', $user->id)
                ->first();
            $unreadMessagesQuery = $activeChat
                ->messages()
                ->where('sender_id', '!=', $user->id);

            if ($chatUser->last_read_at !== null) {
                $unreadMessagesQuery->where('sent_at', '>', $chatUser->last_read_at);
            }

            $unreadMessages = $unreadMessagesQuery->count();
            $participants = $activeChat->users()->get()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role_in_org' => $user->pivot?->role,
                ];
            });
            $activeChat = [
                'id' => $activeChat->chat_id,
                'name' => $activeChat->type === 'GROUP' ?
                    $activeChat->name :
                    $activeChat->users()->where('user_id', '!=', $user->id)->first()->name,
                'type' => $activeChat->type,
                'unread_count' => $unreadMessages,
                'participants' => $participants,
                'messages' => $chatMessages,
            ];
        }

        return Inertia::render('chats/index', [
            'stats' => [
                'total' => 0,
                'unread' => 0,
                'private' => 0,
                'groups' => 0,
                'modules' => 0,
            ],
            'chats' => $chatsUsers,
            'activeChat' => $activeChat ?? null,
            'recipientPools' => [
                'class' => $classPools,
                'organization' => [],
            ],
        ]);
    }
    private function getChats(User $user){
        $chats = $user->chats()->get();

        return $chats->map(function ($chat) use($user){
            $lastMessage = $chat->messages()->latest()->first();
            // if group chat, set group name, if private - set recipient's name
            if($chat->type === 'GROUP'){
                return [
                    'id' => $chat->chat_id,
                    'name' => $chat->name,
                    'type' => $chat->type,
                    'unread_count' => 0,
                    'last_message_text' => $lastMessage->text ?? null,
                    'last_message_at' => $lastMessage?->created_at ?? null,
                    'last_sender_name' => $lastMessage?->sender?->name ?? null,
                    'participants_preview' => ['qwe','qweqwe'],
                ];
            } else if($chat->type === 'PRIVATE'){
                return [
                    'id' => $chat->chat_id,
                    'name' => $chat->users()->where('user_id', '!=', $user->id)->first()->name,
                    'type' => $chat->type,
                    'unread_count' => 0,
                    'last_message_text' => $lastMessage->text ?? null,
                    'last_message_at' => $lastMessage?->created_at ?? null,
                    'last_sender_name' => $lastMessage?->sender?->name ?? null,
                    'participants_preview' => ['qwe','qweqwe'],
                ];
            }
            return null;
        });
    }
    private function getClassPools(SchoolGroup $group, $user, $organization){
        // get all modules/teachers for current group
        $moduleTeachers = $group->groupModulesTeachers()->with(['teacher.user', 'module'])->get();
        $groupMembers = $organization
            ->users()
            ->wherePivot('group_id', $organization->pivot->group_id)
            ->where('id', '!=', $user->id)
            ->get();
        $teachers = $moduleTeachers->map(function ($groupModuleTeacher) use ($group) {
            $teacher = $groupModuleTeacher->teacher?->user;
            if (! $teacher) {
                return null;
            }

            return [
                'id' => $teacher->id,
                'name' => $teacher->name,
                'email' => $teacher->email,
                'role_in_org' => 'TEACHER',
                'group_name' => $group?->name,
            ];
        })->filter()->unique('id')->values();

        $classMates = $groupMembers->map(function (User $user) use ($group) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role_in_org' => $user->pivot?->role_in_org,
                'group_name' => $group->name ?? null,
            ];
        });
        return $classMates->merge($teachers)->toArray();
    }
    private function getGroup($groupId, $organization): ?SchoolGroup
    {
        return SchoolGroup::query()
            ->where('group_id', $groupId)
            ->where('school_id', $organization->id)
            ->first();
    }
    public function createChat(StoreChatRequest $request): RedirectResponse
    {
        $user = $request->user();
        if (!$user) {
            return redirect()->route('login');
        }
        $validated = $request->validated();

        $organizationId = $request->session()->get('activeOrganization');
        if(!$organizationId){
            return redirect()->route('dashboard')->with('afterLogin', true);
        }
        $organization = Organization::query()->where('id', $organizationId)->first();
        if (!$organization){
            return redirect()->route('dashboard')->with('afterLogin', true);
        }
        try{
            DB::transaction(function () use ($validated, $organization, $user){
                $sender = $user->id;
                $recipients = collect($validated['recipient_ids'])
                    ->map(fn ($recipientId) => (int) $recipientId)
                    ->unique()
                    ->values();
                $allowedRecipientIds = $organization->users()
                    ->whereIn('users.id', $recipients)
                    ->pluck('users.id');

                if ($allowedRecipientIds->count() !== $recipients->count()) {
                    throw new Exception('One or more recipients do not belong to the active organization.');
                }

                $chat =Chat::create([
                    'name' => $validated['name'] ?? null,
                    'type' => $validated['type'],
                    'organization_id'  => $organization->id,
                ]);
                ChatUser::create([
                    'chat_id' => $chat->chat_id,
                    'user_id' => $sender,
                    'role' => 'OWNER',
                ]);
                foreach ($allowedRecipientIds as $recipient){
                    ChatUser::create([
                        'chat_id' => $chat->chat_id,
                        'user_id' => $recipient,
                        'role' => 'MEMBER'
                    ]);
                }
            });
        } catch (Exception $e){
            return redirect()->route('chats')->with('error', 'Failed to create chat');
        }


        return redirect()->route('chats');
    }
}
