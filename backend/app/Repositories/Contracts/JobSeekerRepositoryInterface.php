<?php

namespace App\Repositories\Contracts;

use App\Models\JobSeeker;

interface JobSeekerRepositoryInterface
{
    public function findById(int $id): ?JobSeeker;
    public function findByUserId(int $userId): ?JobSeeker;
    public function create(array $data): JobSeeker;
    public function update(int $id, array $data): bool;
}
