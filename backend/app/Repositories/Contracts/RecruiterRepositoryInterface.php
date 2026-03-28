<?php

namespace App\Repositories\Contracts;

use App\Models\Recruiter;

interface RecruiterRepositoryInterface
{
    public function findById(int $id): ?Recruiter;
    public function findByUserId(int $userId): ?Recruiter;
    public function create(array $data): Recruiter;
    public function update(int $id, array $data): bool;
}
