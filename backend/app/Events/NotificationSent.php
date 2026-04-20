<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Notification $notification)
    {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('App.Models.User.' . $this->notification->user_id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'id'         => $this->notification->id,
            'user_id'    => $this->notification->user_id,
            'type'       => $this->notification->type,
            'title'      => $this->notification->title,
            'content'    => $this->notification->content,
            'is_read'    => $this->notification->is_read,
            'data'       => $this->notification->data,
            'created_at' => $this->notification->created_at->toISOString(),
        ];
    }

    public function broadcastAs(): string
    {
        return 'NotificationSent';
    }
}
