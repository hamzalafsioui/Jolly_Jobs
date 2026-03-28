<?php

namespace App\Repositories\Eloquent;

use App\Models\JobOffer;
use App\Repositories\Contracts\JobOfferRepositoryInterface;
use Illuminate\Support\Collection;

class JobOfferRepository implements JobOfferRepositoryInterface
{
    public function all(): Collection
    {
        return JobOffer::with(['recruiter', 'category', 'city', 'skills'])->get();
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

    public function search(array $filters): Collection
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

        if (!empty($filters['keyword'])) {
            $query->where(function($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['keyword'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['keyword'] . '%');
            });
        }

        return $query->latest()->get();
    }
}
