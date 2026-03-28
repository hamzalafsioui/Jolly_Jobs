<?php

namespace App\Repositories\Eloquent;

use App\Models\Experience;
use App\Repositories\Contracts\ExperienceRepositoryInterface;
use Illuminate\Support\Collection;

class ExperienceRepository implements ExperienceRepositoryInterface
{
    public function findByJobSeeker(int $jobSeekerId): Collection
    {
        return Experience::where('job_seeker_id', $jobSeekerId)->latest()->get();
    }

    public function create(array $data): Experience
    {
        return Experience::create($data);
    }

    public function delete(int $id): bool
    {
        $experience = Experience::find($id);
        if (!$experience) return false;
        return $experience->delete();
    }
}
