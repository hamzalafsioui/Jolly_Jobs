<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ApplicationResource;
use App\Http\Resources\JobOfferResource;
use App\Http\Responses\ApiResponse;
use App\Models\JobOffer;
use App\Models\Application;
use App\Services\RecruiterDashboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
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
    public function getStats(Request $request): JsonResponse
    {
        try {
            $userId = $request->user()->id;
            $data = $this->dashboardService->getDashboardStats($userId);

            return ApiResponse::success($data, 'Dashboard stats retrieved successfully.');
        } catch (Exception $e) {
            Log::error('Error fetching recruiter dashboard stats: ' . $e->getMessage());
            return ApiResponse::serverError('Error fetching recruiter dashboard stats.', $e->getMessage());
        }
    }

    /**
     * Get recruiter's own job offers
     */
    public function myJobs(Request $request): JsonResponse
    {
        try {
            $userId = $request->user()->id;
            $jobs = $this->dashboardService->getMyJobs($userId);

            return ApiResponse::success(JobOfferResource::collection($jobs), 'Recruiter jobs retrieved successfully.');
        } catch (Exception $e) {
            Log::error('Error fetching recruiter jobs: ' . $e->getMessage());
            return ApiResponse::serverError('Error fetching recruiter jobs.', $e->getMessage());
        }
    }

    /**
     * Get all applications for recruiter's jobs
     */
    public function myApplications(Request $request): JsonResponse
    {
        try {
            $userId = $request->user()->id;
            $applications = $this->dashboardService->getMyApplications($userId);

            return ApiResponse::success(ApplicationResource::collection($applications), 'Recruiter applications retrieved successfully.');
        } catch (Exception $e) {
            Log::error('Error fetching recruiter applications: ' . $e->getMessage());
            return ApiResponse::serverError('Error fetching recruiter applications.', $e->getMessage());
        }
    }
}
