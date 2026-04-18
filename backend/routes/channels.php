<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

/**
 * Private conversation channel: conversation.{minUserId}-{maxUserId}
 * Both participants (sender and receiver) are authorized to listen.
 */
Broadcast::channel('conversation.{ids}', function ($user, $ids) {
    // $ids is the "minId-maxId" string
    $parts = explode('-', $ids);
    if (count($parts) !== 2) return false;
    return in_array((string) $user->id, $parts);
});

