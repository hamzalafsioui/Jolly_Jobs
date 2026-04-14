<?php

namespace App\Repositories\Eloquent;

use App\Models\Message;
use App\Repositories\Contracts\MessageRepositoryInterface;
use Illuminate\Support\Collection;

class MessageRepository implements MessageRepositoryInterface
{
    public function getChat(int $userId, int $otherUserId): Collection
    {
        return Message::where(function ($query) use ($userId, $otherUserId) {
                $query->where('sender_id', $userId)->where('receiver_id', $otherUserId);
            })
            ->orWhere(function ($query) use ($userId, $otherUserId) {
                $query->where('sender_id', $otherUserId)->where('receiver_id', $userId);
            })
            ->latest()
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
}
