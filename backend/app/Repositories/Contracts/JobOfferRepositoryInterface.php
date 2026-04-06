<?php

namespace App\Repositories\Contracts;

use App\Models\JobOffer;
use Illuminate\Support\Collection;

interface JobOfferRepositoryInterface
{
    public function all(): Collection;
    public function findById(int $id): ?JobOffer;
    public function create(array $data): JobOffer;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function getLatest(int $limit = 10): Collection;
    public function search(array $filters): Collection;
    public function getJobTitleSuggestions(string $query): Collection;
}
