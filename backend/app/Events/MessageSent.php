<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Message $message)
    {
    }

    /**
     * Private channel name is canonical: lower_id-higher_id
     * so both participants resolve the same channel name.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('App.Models.User.' . $this->message->receiver_id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'id'          => $this->message->id,
            'sender_id'   => $this->message->sender_id,
            'receiver_id' => $this->message->receiver_id,
            'content'     => $this->message->content,
            'is_read'     => $this->message->is_read,
            'created_at'  => $this->message->created_at->toISOString(),
            'sender' => [
                'id'         => $this->message->sender->id,
                'first_name' => $this->message->sender->first_name,
                'last_name'  => $this->message->sender->last_name,
                'photo'      => $this->message->sender->photo,
                'role'       => $this->message->sender->role,
            ],
        ];
    }

    public function broadcastAs(): string
    {
        return 'MessageSent';
    }
}
