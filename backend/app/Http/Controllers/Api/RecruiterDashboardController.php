<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RecruiterDashboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class RecruiterDashboardController extends Controller
{
    private $dashboardService;

    public function __construct(RecruiterDashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Get recruiter dashboard statistics and data
     */
    public function getStats(Request $request)
    {
        try {
            $userId = $request->user()->id;
            $data = $this->dashboardService->getDashboardStats($userId);

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (Exception $e) {
            Log::error('Error fetching recruiter dashboard stats: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
