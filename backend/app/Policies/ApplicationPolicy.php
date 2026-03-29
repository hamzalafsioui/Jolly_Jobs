<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'job_seeker' && $user->jobSeeker;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Application $application): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'job_seeker' && $user->jobSeeker) {
            return $user->jobSeeker->id === $application->job_seeker_id;
        }

        if ($user->role === 'recruiter' && $user->recruiter) {
           
            return $application->jobOffer && $application->jobOffer->recruiter_id === $user->recruiter->id;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Application $application): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'recruiter' && $user->recruiter) {
            $application->loadMissing('jobOffer');
            return $application->jobOffer && $application->jobOffer->recruiter_id === $user->recruiter->id;
        }

        return false;
    }
}
