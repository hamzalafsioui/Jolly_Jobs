<?php

namespace App\Policies;

use App\Models\JobOffer;
use App\Models\User;

class JobOfferPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, JobOffer $jobOffer): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'recruiter';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, JobOffer $jobOffer): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->role === 'recruiter' 
            && $user->recruiter 
            && $user->recruiter->id === $jobOffer->recruiter_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, JobOffer $jobOffer): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->role === 'recruiter' 
            && $user->recruiter 
            && $user->recruiter->id === $jobOffer->recruiter_id;
    }

    /**
     * Determine whether the user can view applications for the model.
     */
    public function viewApplications(User $user, JobOffer $jobOffer): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->role === 'recruiter' 
            && $user->recruiter 
            && $user->recruiter->id === $jobOffer->recruiter_id;
    }
}
