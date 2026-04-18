<?php

namespace App\Repositories\Contracts;

use App\Models\Message;
use Illuminate\Support\Collection;

interface MessageRepositoryInterface
{
    public function getChat(int $userId, int $otherUserId): Collection;
    public function create(array $data): Message;
    public function markAsRead(int $id): bool;
    public function getPartnerIds(int $userId): Collection;
    public function getUnreadCount(int $receiverId, ?int $senderId = null): int;
    public function markConversationAsRead(int $userId, int $partnerId): void;
    public function conversationExists(int $userId1, int $userId2): bool;
}
