<?php

namespace App\Services;

use App\Models\User;
use App\Models\JobOffer;
use App\Models\Application;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardService
{
    public function getDashboardStats()
    {
        // General Stats
        $totalUsers = User::count();
        $totalJobSeekers = User::where('role', 'job_seeker')->count();
        $totalRecruiters = User::where('role', 'recruiter')->count();
        
        $totalJobs = JobOffer::count();
        $activeJobs = JobOffer::where('status', 'active')->count();
        
        $totalApplications = Application::count();
        $applicationsToday = Application::whereDate('created_at', Carbon::today())->count();

        // users joined this month
        $usersThisMonth = User::where('created_at', '>=', Carbon::now()->startOfMonth())->count();

        // Recent Jobs
        $recentJobs = JobOffer::with('recruiter.user')
            ->latest()
            ->take(5)
            ->get();

        // Recent Users
        $recentUsers = User::latest()
            ->take(5)
            ->get();

        return [
            'stats' => [
                'total_users' => $totalUsers,
                'job_seekers' => $totalJobSeekers,
                'recruiters' => $totalRecruiters,
                'total_jobs' => $totalJobs,
                'active_jobs' => $activeJobs,
                'total_applications' => $totalApplications,
                'applications_today' => $applicationsToday,
                'users_this_month' => $usersThisMonth,
            ],
            'recent_jobs' => $recentJobs,
            'recent_users' => $recentUsers,
        ];
    }
}
