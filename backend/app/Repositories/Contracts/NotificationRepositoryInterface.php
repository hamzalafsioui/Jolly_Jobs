<?php

namespace App\Repositories\Contracts;

use App\Models\Notification;
use Illuminate\Support\Collection;

interface NotificationRepositoryInterface
{
    public function findByUser(int $userId): Collection;
    public function markAsRead(int $id): bool;
    public function create(array $data): Notification;
}
