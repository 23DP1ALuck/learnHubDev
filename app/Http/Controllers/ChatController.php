<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreChatRequest;
use App\Models\Chat;
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
    public function chats(Request $request): Response|RedirectResponse
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

        $classPools = $this->getClassPools($group, $user, $organization);

        $chats = $user->chats()->get();
//        export type ChatSummary = {
//        id: number;
//        name: string;
//        type: ChatType;
//        unread_count: number;
//        last_message_text: string | null;
//        last_message_at: string | null;
//        last_sender_name: string | null;
//        participants_preview: string[];
//    };
        $chatsUsers = $chats->map(function ($chat) use($user){
            $lastMessage = $chat->messages()->latest()->first();
            $sender = $lastMessage?->sender;
            if($chat->type === 'GROUP'){
                return [
                    'chat_id' => $chat->chat_id,
                    'name' => $chat->name,
                    'chat_type' => $chat->type,
                    'unread_count' => 0,
                    'last_message_text' => $lastMessage->text ?? null,
                    'last_message_at' => $lastMessage?->created_at ?? null,
                    'last_sender_name' => $lastMessage?->sender?->name ?? null,
                    'participants_preview' => ['qwe','qweqwe'],
                ];
            } else if($chat->type === 'PRIVATE'){
                return [
                    'chat_id' => $chat->chat_id,
                    'name' => $chat->users()->where('user_id', '!=', $user->id)->first()->name,
                    'chat_type' => $chat->type,
                    'unread_count' => 0,
                    'last_message_text' => $lastMessage->text ?? null,
                    'last_message_at' => $lastMessage?->created_at ?? null,
                    'last_sender_name' => $lastMessage?->sender?->name ?? null,
                    'participants_preview' => ['qwe','qweqwe'],
                ];
            }
            return null;
        });

        return Inertia::render('chats/index', [
            'stats' => [
                'total' => 0,
                'unread' => 0,
                'private' => 0,
                'groups' => 0,
                'modules' => 0,
            ],
            'chats' => $chatsUsers,
            'activeChat' => null,
            'recipientPools' => [
                'class' => $classPools,
                'organization' => [],
            ],
        ]);
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
        $group = null;

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
            dd($e);
            return redirect()->route('chats')->with('error', 'Failed to create chat');
        }


        return redirect()->route('chats');
    }
}
