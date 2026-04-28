<?php

namespace App\Repositories\Eloquent;

use App\Models\Application;
use App\Repositories\Contracts\ApplicationRepositoryInterface;
use Illuminate\Support\Collection;

class ApplicationRepository implements ApplicationRepositoryInterface
{
    public function all(): Collection
    {
        return Application::with(['jobSeeker.user', 'jobOffer'])->get();
    }

    public function findById(int $id): ?Application
    {
        return Application::with(['jobSeeker.user', 'jobOffer'])->find($id);
    }

    public function create(array $data): Application
    {
        return Application::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $application = Application::find($id);
        if (!$application) return false;
        return $application->update($data);
    }

    public function delete(int $id): bool
    {
        $application = Application::find($id);
        if (!$application) return false;
        return $application->delete();
    }

    public function findByJobSeeker(int $jobSeekerId): Collection
    {
        return Application::with('jobOffer')
            ->where('job_seeker_id', $jobSeekerId)
            ->latest()
            ->get();
    }

    public function findByJobOffer(int $jobOfferId): Collection
    {
        return Application::with('jobSeeker.user')
            ->where('job_offer_id', $jobOfferId)
            ->latest()
            ->get();
    }

    public function findByRecruiter(int $recruiterId): Collection
    {
        return Application::whereHas('jobOffer', function ($query) use ($recruiterId) {
                $query->where('recruiter_id', $recruiterId);
            })
            ->with(['jobSeeker.user', 'jobOffer'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function isCvUsed(string $cvPath): bool
    {
        return Application::where('cv_path', $cvPath)->exists();
    }
}
