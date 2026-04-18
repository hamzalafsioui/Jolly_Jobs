<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\AdminDashboardService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;
use Illuminate\Support\Facades\Log;

class AdminDashboardController extends Controller
{
    public function __construct(
        private readonly AdminDashboardService $adminDashboardService
    ) {}

    public function getStats(Request $request): JsonResponse
    {
        try {
            if ($request->user()->role !== 'admin') {
                return ApiResponse::forbidden('Only administrators can access this data.');
            }

            $stats = $this->adminDashboardService->getDashboardStats();
            return ApiResponse::success($stats, 'Admin dashboard stats retrieved successfully.');
        } catch (Exception $e) {
            Log::error('Error fetching admin stats: ' . $e->getMessage());
            return ApiResponse::serverError('Error fetching admin dashboard stats.', $e->getMessage());
        }
    }
}
