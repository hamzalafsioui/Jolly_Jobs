<?php

namespace App\Services;

use App\Repositories\Contracts\EducationRepositoryInterface;
use App\Repositories\Contracts\ExperienceRepositoryInterface;
use App\Repositories\Contracts\JobSeekerRepositoryInterface;
use App\Models\Education;
use App\Models\Experience;
use Illuminate\Support\Collection;

class ResumeService
{
    protected $educationRepository;
    protected $experienceRepository;
    protected $jobSeekerRepository;

    public function __construct(
        EducationRepositoryInterface $educationRepository,
        ExperienceRepositoryInterface $experienceRepository,
        JobSeekerRepositoryInterface $jobSeekerRepository
    ) {
        $this->educationRepository = $educationRepository;
        $this->experienceRepository = $experienceRepository;
        $this->jobSeekerRepository = $jobSeekerRepository;
    }

    public function addEducation(int $jobSeekerId, array $data): Education
    {
        $data['job_seeker_id'] = $jobSeekerId;
        return $this->educationRepository->create($data);
    }

    public function addExperience(int $jobSeekerId, array $data): Experience
    {
        $data['job_seeker_id'] = $jobSeekerId;
        return $this->experienceRepository->create($data);
    }

    public function deleteEducation(int $id): bool
    {
        return $this->educationRepository->delete($id);
    }

    public function deleteExperience(int $id): bool
    {
        return $this->experienceRepository->delete($id);
    }

    public function getJobSeekerResume(int $jobSeekerId): array
    {
        return [
            'educations' => $this->educationRepository->findByJobSeeker($jobSeekerId),
            'experiences' => $this->experienceRepository->findByJobSeeker($jobSeekerId),
        ];
    }
}
