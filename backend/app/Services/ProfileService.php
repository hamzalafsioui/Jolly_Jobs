<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Contracts\RecruiterRepositoryInterface;
use App\Repositories\Contracts\JobSeekerRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Exception;
use Illuminate\Http\UploadedFile;

class ProfileService
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private RecruiterRepositoryInterface $recruiterRepository,
        private JobSeekerRepositoryInterface $jobSeekerRepository
    ) {}

    /**
     * Get the complete profile for a user including role-specific info
     */
    public function getProfile(User $user)
    {
        $userData = $this->userRepository->findById($user->id);
        
        if ($user->role === 'recruiter') {
            $userData->load('recruiter');
        } elseif ($user->role === 'job_seeker') {
            $userData->load('jobSeeker.skills');
        }

        return $userData;
    }

    /**
     * Update user profile and role-specific data
     */
    public function updateProfile(User $user, array $data)
    {
        return DB::transaction(function () use ($user, $data) {
            // Update User table basic info
            $userFields = ['first_name', 'last_name', 'email', 'city_id', 'phone', 'bio'];
            $userData = array_intersect_key($data, array_flip($userFields));
            
            if (isset($data['password']) && !empty($data['password'])) {
                $userData['password'] = $data['password'];
            }

            // Handle photo upload
            if (isset($data['photo']) && $data['photo'] instanceof UploadedFile && $data['photo']->isValid()) {
                // Delete old photo if exists
                if ($user->photo) {
                    Storage::disk('public')->delete($user->photo);
                }
                $path = $data['photo']->store('photos', 'public');
                $userData['photo'] = $path;
            }

            if (!empty($userData)) {
                $this->userRepository->update($user->id, $userData);
            }

            // Update Role in specific table
            if ($user->role === 'recruiter') {
                $this->updateRecruiterProfile($user, $data);
            } elseif ($user->role === 'job_seeker') {
                $this->updateJobSeekerProfile($user, $data);
            }

            return $this->getProfile($user->fresh());
        });
    }

    /**
     * Handle Recruiter specialized update
     */
    private function updateRecruiterProfile(User $user, array $data)
    {
        $recruiter = $user->recruiter;
        if (!$recruiter) {
            throw new Exception('Recruiter profile not found.');
        }

        $recruiterFields = ['company_name', 'company_size', 'industry', 'website', 'description'];
        $recruiterData = array_intersect_key($data, array_flip($recruiterFields));

        // Handle logo upload
        if (isset($data['logo']) && $data['logo'] instanceof UploadedFile && $data['logo']->isValid()) {
            // Delete old logo if exists
            if ($recruiter->logo) {
                Storage::disk('public')->delete($recruiter->logo);
            }
            $path = $data['logo']->store('logos', 'public');
            $recruiterData['logo'] = $path;
        }

        $this->recruiterRepository->update($recruiter->id, $recruiterData);
    }

    /**
     * Handle Job Seeker specialized update
     */
    private function updateJobSeekerProfile(User $user, array $data)
    {
        $jobSeeker = $user->jobSeeker;
        if (!$jobSeeker) {
            throw new Exception('Job Seeker profile not found.');
        }

        $jobSeekerFields = ['specialty', 'experience_level'];
        $jobSeekerData = array_intersect_key($data, array_flip($jobSeekerFields));

        // Handle CV upload
        if (isset($data['cv']) && $data['cv'] instanceof UploadedFile && $data['cv']->isValid()) {
            // Delete old CV if exists
            if ($jobSeeker->cv_path) {
                Storage::disk('public')->delete($jobSeeker->cv_path);
            }
            $path = $data['cv']->store('cvs', 'public');
            $jobSeekerData['cv_path'] = $path;
        }

        $this->jobSeekerRepository->update($jobSeeker->id, $jobSeekerData);

        if (isset($data['skills'])) {
            $jobSeeker->skills()->sync($data['skills']);
        }
    }
}
