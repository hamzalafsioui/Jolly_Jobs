<?php

namespace App\Repositories\Eloquent;

use App\Models\JobSeeker;
use App\Repositories\Contracts\JobSeekerRepositoryInterface;

class JobSeekerRepository implements JobSeekerRepositoryInterface
{
    public function findById(int $id): ?JobSeeker
    {
        return JobSeeker::with(['user', 'skills', 'educations', 'experiences'])->find($id);
    }

    public function findByUserId(int $userId): ?JobSeeker
    {
        return JobSeeker::where('user_id', $userId)->first();
    }

    public function create(array $data): JobSeeker
    {
        return JobSeeker::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $jobSeeker = JobSeeker::find($id);
        if (!$jobSeeker) return false;
        return $jobSeeker->update($data);
    }
}
