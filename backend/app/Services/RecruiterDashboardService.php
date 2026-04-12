<?php

namespace App\Services;

use App\Repositories\Contracts\JobOfferRepositoryInterface;
use App\Repositories\Contracts\ApplicationRepositoryInterface;
use App\Repositories\Contracts\RecruiterRepositoryInterface;
use App\Models\Recruiter;
use Carbon\Carbon;
use Exception;
use App\Models\JobOffer;
use App\Models\Application;
use Illuminate\Support\Facades\DB;

class RecruiterDashboardService
{
    private $jobOfferRepository;
    private $applicationRepository;
    private $recruiterRepository;

    public function __construct(
        JobOfferRepositoryInterface $jobOfferRepository,
        ApplicationRepositoryInterface $applicationRepository,
        RecruiterRepositoryInterface $recruiterRepository
    ) {
        $this->jobOfferRepository = $jobOfferRepository;
        $this->applicationRepository = $applicationRepository;
        $this->recruiterRepository = $recruiterRepository;
    }

    public function getDashboardStats(int $userId)
    {
        $recruiter = $this->recruiterRepository->findByUserId($userId);

        if (!$recruiter) {
            throw new Exception('Recruiter profile not found.');
        }

        $recruiterId = $recruiter->id;

        // General Stats
        $activeJobsCount = JobOffer::where('recruiter_id', $recruiterId)
            ->where('status', 'active')
            ->count();

        $totalApplicationsCount = Application::whereHas('jobOffer', function ($query) use ($recruiterId) {
            $query->where('recruiter_id', $recruiterId);
        })->count();

        $newApplicationsToday = Application::whereHas('jobOffer', function ($query) use ($recruiterId) {
            $query->where('recruiter_id', $recruiterId);
        })->whereDate('created_at', Carbon::today())->count();

        $totalViews = JobOffer::where('recruiter_id', $recruiterId)->sum('views_count');

        // Applications by Status
        $applicationsByStatus = Application::whereHas('jobOffer', function ($query) use ($recruiterId) {
            $query->where('recruiter_id', $recruiterId);
        })
        ->select('status', DB::raw('count(*) as total'))
        ->groupBy('status')
        ->pluck('total', 'status')
        ->toArray();

        // Recent Applications
        $recentApplications = Application::with(['jobSeeker.user', 'jobOffer'])
            ->whereHas('jobOffer', function ($query) use ($recruiterId) {
                $query->where('recruiter_id', $recruiterId);
            })
            ->latest()
            ->take(5)
            ->get();

        // Top Active Jobs
        $topJobs = JobOffer::where('recruiter_id', $recruiterId)
            ->where('status', 'active')
            ->orderBy('applications_count', 'desc')
            ->take(5)
            ->get();

        return [
            'stats' => [
                'active_jobs' => $activeJobsCount,
                'total_applications' => $totalApplicationsCount,
                'new_applications_today' => $newApplicationsToday,
                'total_views' => $totalViews,
            ],
            'applications_by_status' => $applicationsByStatus,
            'recent_applications' => $recentApplications,
            'top_jobs' => $topJobs,
        ];
    }
}
