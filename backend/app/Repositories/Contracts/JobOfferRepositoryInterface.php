<?php

namespace App\Repositories\Contracts;

use App\Models\JobOffer;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface JobOfferRepositoryInterface
{
    public function all(int $perPage = 15): LengthAwarePaginator;
    public function findById(int $id): ?JobOffer;
    public function create(array $data): JobOffer;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function getLatest(int $limit = 10): Collection;
    public function search(array $filters, int $perPage = 15): LengthAwarePaginator;
    public function getJobTitleSuggestions(string $query): Collection;
    public function toggleSave(int $jobId, int $jobSeekerId): array;
}
