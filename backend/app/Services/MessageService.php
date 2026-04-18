<?php

namespace App\Services;

use App\Events\MessageSent;
use App\Models\User;
use App\Repositories\Contracts\MessageRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Collection;
use \Exception;
class MessageService
{
    public function __construct(
        protected MessageRepositoryInterface $messageRepository,
        protected UserRepositoryInterface $userRepository
    ) {}

    /**
     * Get unique conversation partners for a user.
     */
    public function getConversations(int $userId): Collection
    {
        $partnerIds = $this->messageRepository->getPartnerIds($userId);

        // Fetch user data for each partner and map to the required format
        $partners = User::whereIn('id', $partnerIds)->get();

        return $partners->map(function (User $partner) use ($userId) {
            $lastMsg = $this->messageRepository->getChat($userId, $partner->id)->last();
            $unreadCount = $this->messageRepository->getUnreadCount($userId, $partner->id);

            return [
                'user' => [
                    'id'         => $partner->id,
                    'first_name' => $partner->first_name,
                    'last_name'  => $partner->last_name,
                    'photo'      => $partner->photo,
                    'role'       => $partner->role,
                ],
                'last_message' => $lastMsg ? [
                    'content'    => $lastMsg->content,
                    'created_at' => $lastMsg->created_at->toISOString(),
                ] : null,
                'unread_count' => $unreadCount,
            ];
        })->sortByDesc(fn($c) => $c['last_message']['created_at'] ?? '')->values();
    }

    /**
     * Get full message history between two users.
     */
    public function getHistory(int $userId, int $partnerId): Collection
    {
        return $this->messageRepository->getChat($userId, $partnerId)->map(fn($m) => [
            'id'          => $m->id,
            'sender_id'   => $m->sender_id,
            'receiver_id' => $m->receiver_id,
            'content'     => $m->content,
            'is_read'     => $m->is_read,
            'created_at'  => $m->created_at->toISOString(),
        ]);
    }

    /**
     * Send a message from one user to another.
     */
    public function sendMessage(User $sender, int $receiverId, string $content): array
    {
        $receiver = $this->userRepository->findById($receiverId);
        if (!$receiver) {
            throw new Exception('Receiver not found.');
        }

        // Guard: job seekers cannot initiate conversations
        if ($sender->role !== 'recruiter') {
            if (!$this->messageRepository->conversationExists($sender->id, $receiverId)) {
                throw new Exception('Only recruiters can start a new conversation.', 403);
            }
        }

        $message = $this->messageRepository->create([
            'sender_id'   => $sender->id,
            'receiver_id' => $receiverId,
            'content'     => $content,
            'is_read'     => false,
        ]);

        $message->load('sender');

        broadcast(new MessageSent($message));

        return [
            'id'          => $message->id,
            'sender_id'   => $message->sender_id,
            'receiver_id' => $message->receiver_id,
            'content'     => $message->content,
            'is_read'     => $message->is_read,
            'created_at'  => $message->created_at->toISOString(),
        ];
    }

    /**
     * Get total unread count for a user.
     */
    public function getUnreadTotal(int $userId): int
    {
        return $this->messageRepository->getUnreadCount($userId);
    }

    /**
     * Mark all messages in a conversation as read.
     */
    public function markAsRead(int $userId, int $partnerId): void
    {
        $this->messageRepository->markConversationAsRead($userId, $partnerId);
    }
}
