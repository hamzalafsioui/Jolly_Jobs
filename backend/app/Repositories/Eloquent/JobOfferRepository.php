<?php

namespace App\Repositories\Eloquent;

use App\Models\JobOffer;
use App\Repositories\Contracts\JobOfferRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class JobOfferRepository implements JobOfferRepositoryInterface
{
    public function all(int $perPage = 15): LengthAwarePaginator
    {
        return JobOffer::with(['recruiter', 'category', 'city', 'skills'])->latest()->paginate($perPage);
    }

    public function findById(int $id): ?JobOffer
    {
        return JobOffer::with(['recruiter', 'category', 'city', 'skills', 'applications'])->find($id);
    }

    public function create(array $data): JobOffer
    {
        return JobOffer::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $jobOffer = JobOffer::find($id);
        if (!$jobOffer) return false;
        return $jobOffer->update($data);
    }

    public function delete(int $id): bool
    {
        $jobOffer = JobOffer::find($id);
        if (!$jobOffer) return false;
        return $jobOffer->delete();
    }

    public function getLatest(int $limit = 10): Collection
    {
        return JobOffer::with(['recruiter', 'category', 'city'])
            ->where('status', 'active')
            ->latest()
            ->take($limit)
            ->get();
    }

    public function search(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = JobOffer::query()->with(['recruiter', 'category', 'city']);

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['city_id'])) {
            $query->where('city_id', $filters['city_id']);
        }

        if (!empty($filters['contract_type'])) {
            $query->where('contract_type', $filters['contract_type']);
        }

        if (isset($filters['remote'])) {
            $query->where('remote', (bool)$filters['remote']);
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

        return JobOffer::where('title', 'ILIKE', '%' . $query . '%')
            ->distinct()
            ->orderBy('title')
            ->pluck('title');
    }
}
