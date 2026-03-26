<?php

namespace App\Services;

use App\Repositories\Contracts\RecruiterRepositoryInterface;
use App\Repositories\Contracts\JobSeekerRepositoryInterface;
use App\Models\Recruiter;
use App\Models\JobSeeker;

class ProfileService
{
    protected $recruiterRepository;
    protected $jobSeekerRepository;

    public function __construct(
        RecruiterRepositoryInterface $recruiterRepository,
        JobSeekerRepositoryInterface $jobSeekerRepository
    ) {
        $this->recruiterRepository = $recruiterRepository;
        $this->jobSeekerRepository = $jobSeekerRepository;
    }

    public function getRecruiterProfile(int $userId): ?Recruiter
    {
        return $this->recruiterRepository->findByUserId($userId);
    }

    public function getJobSeekerProfile(int $userId): ?JobSeeker
    {
        return $this->jobSeekerRepository->findByUserId($userId);
    }

    public function updateRecruiter(int $id, array $data): bool
    {
        return $this->recruiterRepository->update($id, $data);
    }

    public function updateJobSeeker(int $id, array $data): bool
    {
        return $this->jobSeekerRepository->update($id, $data);
    }
}
