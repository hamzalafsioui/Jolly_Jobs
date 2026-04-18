<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService
    ) {}

    /**
     * GET /api/notifications
     */
    public function index(): JsonResponse
    {
        $notifications = $this->notificationService->getUserNotifications(Auth::id());
        return ApiResponse::success($notifications, 'Notifications retrieved.');
    }

    /**
     * PATCH /api/notifications/{id}/read
     */
    public function markRead(int $id): JsonResponse
    {
        $this->notificationService->markAsRead($id);
        return ApiResponse::success(null, 'Notification marked as read.');
    }

    /**
     * PATCH /api/notifications/read-all
     */
    public function markAllRead(): JsonResponse
    {
        $this->notificationService->markAllAsRead(Auth::id());
        return ApiResponse::success(null, 'All notifications marked as read.');
    }
}
