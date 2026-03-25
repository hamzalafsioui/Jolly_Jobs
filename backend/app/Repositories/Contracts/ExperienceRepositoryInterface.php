<?php

namespace App\Repositories\Contracts;

use App\Models\Experience;
use Illuminate\Support\Collection;

interface ExperienceRepositoryInterface
{
    public function findByJobSeeker(int $jobSeekerId): Collection;
    public function create(array $data): Experience;
    public function delete(int $id): bool;
}
