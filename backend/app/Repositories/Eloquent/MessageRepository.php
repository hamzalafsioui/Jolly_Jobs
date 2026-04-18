<?php

namespace App\Repositories\Eloquent;

use App\Models\Message;
use App\Repositories\Contracts\MessageRepositoryInterface;
use Illuminate\Support\Collection;

class MessageRepository implements MessageRepositoryInterface
{
    public function getChat(int $userId, int $otherUserId): Collection
    {
        return Message::with('sender')
            ->where(function ($query) use ($userId, $otherUserId) {
                $query->where('sender_id', $userId)->where('receiver_id', $otherUserId);
            })
            ->orWhere(function ($query) use ($userId, $otherUserId) {
                $query->where('sender_id', $otherUserId)->where('receiver_id', $userId);
            })
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function create(array $data): Message
    {
        return Message::create($data);
    }

    public function markAsRead(int $id): bool
    {
        $message = Message::find($id);
        if (!$message) return false;
        return $message->update(['is_read' => true]);
    }

    public function getPartnerIds(int $userId): Collection
    {
        return Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->get()
            ->flatMap(fn($m) => [$m->sender_id, $m->receiver_id])
            ->filter(fn($id) => $id !== $userId)
            ->unique()
            ->values();
    }

    public function getUnreadCount(int $receiverId, ?int $senderId = null): int
    {
        $query = Message::where('receiver_id', $receiverId)->where('is_read', false);
        
        if ($senderId) {
            $query->where('sender_id', $senderId);
        }

        return $query->count();
    }

    public function markConversationAsRead(int $userId, int $partnerId): void
    {
        Message::where('sender_id', $partnerId)
            ->where('receiver_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);
    }

    public function conversationExists(int $userId1, int $userId2): bool
    {
        return Message::where(function ($q) use ($userId1, $userId2) {
            $q->where('sender_id', $userId1)->where('receiver_id', $userId2);
        })->orWhere(function ($q) use ($userId1, $userId2) {
            $q->where('sender_id', $userId2)->where('receiver_id', $userId1);
        })->exists();
    }
}
