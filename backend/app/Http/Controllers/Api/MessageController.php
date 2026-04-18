<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use App\Services\MessageService;
use Exception;

class MessageController extends Controller
{
    public function __construct(
        protected MessageService $messageService
    ) {}

    /**
     * GET /api/messages/unread-count
     */
    public function unreadCount(): JsonResponse
    {
        $unreadTotal = $this->messageService->getUnreadTotal(Auth::id());
        return ApiResponse::success(['count' => $unreadTotal], 'Unread count retrieved.');
    }

    /**
     * GET /api/messages/conversations
     */
    public function conversations(): JsonResponse
    {
        $conversations = $this->messageService->getConversations(Auth::id());
        return ApiResponse::success($conversations, 'Conversations retrieved.');
    }

    /**
     * GET /api/messages/{userId}
     */
    public function history(int $userId): JsonResponse
    {
        $history = $this->messageService->getHistory(Auth::id(), $userId);
        return ApiResponse::success($history, 'Message history retrieved.');
    }

    /**
     * POST /api/messages/{userId}
     */
    public function send(Request $request, int $userId): JsonResponse
    {
        $request->validate(['content' => 'required|string|max:2000']);

        try {
            $message = $this->messageService->sendMessage(
                Auth::user(),
                $userId,
                $request->content
            );
            return ApiResponse::created($message, 'Message sent successfully.');
        } catch (Exception $e) {
            $code = $e->getCode();
            $statusCode = ($code >= 400 && $code < 600) ? $code : 400;
            return ApiResponse::error($e->getMessage(), null, $statusCode);
        }
    }

    /**
     * PATCH /api/messages/{userId}/read
     */
    public function markRead(int $userId): JsonResponse
    {
        $this->messageService->markAsRead(Auth::id(), $userId);
        return ApiResponse::success(null, 'Marked as read.');
    }
}
