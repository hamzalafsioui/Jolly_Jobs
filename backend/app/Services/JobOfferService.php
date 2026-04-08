<?php

namespace App\Services;

use App\Repositories\Contracts\JobOfferRepositoryInterface;
use App\Models\JobOffer;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class JobOfferService
{
    protected $jobOfferRepository;

    public function __construct(JobOfferRepositoryInterface $jobOfferRepository)
    {
        $this->jobOfferRepository = $jobOfferRepository;
    }

    public function getAllOffers(int $perPage = 15): LengthAwarePaginator
    {
        return $this->jobOfferRepository->all($perPage);
    }

    public function getOfferDetails(int $id): ?JobOffer
    {
        return $this->jobOfferRepository->findById($id);
    }

    public function createOffer(array $data): JobOffer
    {
        return $this->jobOfferRepository->create($data);
    }

    public function updateOffer(int $id, array $data): bool
    {
        return $this->jobOfferRepository->update($id, $data);
    }

    public function deleteOffer(int $id): bool
    {
        return $this->jobOfferRepository->delete($id);
    }

    public function getLatestActiveOffers(int $limit = 10): Collection
    {
        return $this->jobOfferRepository->getLatest($limit);
    }

    public function searchOffers(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->jobOfferRepository->search($filters, $perPage);
    }

    public function getJobTitleSuggestions(string $query): Collection
    {
        return $this->jobOfferRepository->getJobTitleSuggestions($query);
    }
}
