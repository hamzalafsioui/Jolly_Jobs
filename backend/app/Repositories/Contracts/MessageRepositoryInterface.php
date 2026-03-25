<?php

namespace App\Repositories\Contracts;

use App\Models\Message;
use Illuminate\Support\Collection;

interface MessageRepositoryInterface
{
    public function getChat(int $userId, int $otherUserId): Collection;
    public function create(array $data): Message;
    public function markAsRead(int $id): bool;
}
