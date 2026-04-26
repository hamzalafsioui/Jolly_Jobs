<?php

namespace App\Repositories\Eloquent;

use App\Models\JobOffer;
use App\Repositories\Contracts\JobOfferRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\Skill;

class JobOfferRepository implements JobOfferRepositoryInterface
{
    public function all(int $perPage = 15): LengthAwarePaginator
    {
        return JobOffer::with(['recruiter.user', 'category', 'city', 'skills'])
            ->where('status', 'active')
            ->latest()
            ->paginate($perPage);
    }

    public function findById(int $id): ?JobOffer
    {
        return JobOffer::with(['recruiter', 'category', 'city', 'skills', 'applications'])->find($id);
    }

    public function create(array $data): JobOffer
    {
        $jobOffer = JobOffer::create($data);
        if (isset($data['skills'])) {
            $skillIds = [];
            foreach ($data['skills'] as $skillName) {

                $skill = Skill::firstOrCreate(['name' => $skillName]);
                $skillIds[] = $skill->id;
            }
            $jobOffer->skills()->sync($skillIds);
        }
        return $jobOffer;
    }

    public function update(int $id, array $data): bool
    {
        $jobOffer = JobOffer::find($id);
        if (!$jobOffer) return false;

        $updated = $jobOffer->update($data);

        if (isset($data['skills'])) {
            $skillIds = [];
            foreach ($data['skills'] as $skillName) {
                $skill = Skill::firstOrCreate(['name' => $skillName]);
                $skillIds[] = $skill->id;
            }
            $jobOffer->skills()->sync($skillIds);
        }

        return $updated;
    }

    public function delete(int $id): bool
    {
        $jobOffer = JobOffer::find($id);
        if (!$jobOffer) return false;
        return $jobOffer->delete();
    }

    public function getLatest(int $limit = 10): Collection
    {
        return JobOffer::with(['recruiter.user', 'category', 'city', 'skills'])
            ->where('status', 'active')
            ->latest()
            ->take($limit)
            ->get();
    }

    public function search(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = JobOffer::query()
            ->with(['recruiter.user', 'category', 'city', 'skills'])
            ->where('status', 'active');

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['city_id'])) {
            $query->where('city_id', $filters['city_id']);
        }

        if (!empty($filters['contract_type'])) {
            $query->where('contract_type', $filters['contract_type']);
        }

        if (!empty($filters['remote']) && filter_var($filters['remote'], FILTER_VALIDATE_BOOLEAN)) {
            $query->where('remote', true);
        }

        if (!empty($filters['keyword'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'ILIKE', '%' . $filters['keyword'] . '%')
                    ->orWhere('description', 'ILIKE', '%' . $filters['keyword'] . '%');
            });
        }

        return $query->latest()->paginate($perPage);
    }

    public function getJobTitleSuggestions(string $query): Collection
    {
        if (empty($query)) {
            return collect();
        }

        return JobOffer::where('status', 'active')
            ->where('title', 'ILIKE', '%' . $query . '%')
            ->distinct()
            ->orderBy('title')
            ->pluck('title');
    }

    public function toggleSave(int $jobId, int $jobSeekerId): array
    {
        $jobOffer = JobOffer::find($jobId);
        if (!$jobOffer) {
            return ['status' => 'not_found'];
        }

        $result = $jobOffer->savedByJobSeekers()->toggle([$jobSeekerId]);

        return [
            'status' => 'success',
            'attached' => !empty($result['attached'])
        ];
    }

    public function getSavedJobs(int $jobSeekerId, int $perPage = 15): LengthAwarePaginator
    {
        return JobOffer::with(['recruiter.user', 'category', 'city', 'skills'])
            ->whereHas('savedByJobSeekers', function ($query) use ($jobSeekerId) {
                $query->where('job_seeker_id', $jobSeekerId);
            })
            ->latest()
            ->paginate($perPage);
    }

    public function findByRecruiter(int $recruiterId): Collection
    {
        return JobOffer::where('recruiter_id', $recruiterId)
            ->with(['city', 'category', 'skills'])
            ->withCount('applications')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
