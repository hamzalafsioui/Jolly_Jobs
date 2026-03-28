<?php

namespace App\Repositories\Contracts;

use App\Models\Education;
use Illuminate\Support\Collection;

interface EducationRepositoryInterface
{
    public function findByJobSeeker(int $jobSeekerId): Collection;
    public function create(array $data): Education;
    public function delete(int $id): bool;
}
