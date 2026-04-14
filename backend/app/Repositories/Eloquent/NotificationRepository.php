<?php

namespace App\Repositories\Eloquent;

use App\Models\Notification;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use Illuminate\Support\Collection;

class NotificationRepository implements NotificationRepositoryInterface
{
    public function findByUser(int $userId): Collection
    {
        return Notification::where('user_id', $userId)->latest()->get();
    }

    public function markAsRead(int $id): bool
    {
        $notification = Notification::find($id);
        if (!$notification) return false;
        return $notification->update(['is_read' => true]);
    }

    public function create(array $data): Notification
    {
        return Notification::create($data);
    }
}
