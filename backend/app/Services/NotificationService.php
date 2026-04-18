<?php

namespace App\Services;

use App\Repositories\Contracts\NotificationRepositoryInterface;
use Illuminate\Support\Collection;

class NotificationService
{
    public function __construct(
        protected NotificationRepositoryInterface $notificationRepository
    ) {}

    public function getUserNotifications(int $userId): Collection
    {
        return $this->notificationRepository->findByUser($userId);
    }

    public function markAsRead(int $id): bool
    {
        return $this->notificationRepository->markAsRead($id);
    }

    public function markAllAsRead(int $userId): void
    {
        $this->notificationRepository->markAllRead($userId);
    }
}
