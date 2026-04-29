<?php

namespace App\Repositories\Contracts;

use App\Models\Application;
use Illuminate\Support\Collection;

interface ApplicationRepositoryInterface
{
    public function all(): Collection;
    public function findById(int $id): ?Application;
    public function create(array $data): Application;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function findByJobSeeker(int $jobSeekerId): Collection;
    public function findByJobOffer(int $jobOfferId): Collection;
    public function findByRecruiter(int $recruiterId): Collection;
    public function isCvUsed(string $cvPath): bool;
}
