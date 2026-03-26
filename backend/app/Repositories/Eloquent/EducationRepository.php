<?php

namespace App\Repositories\Eloquent;

use App\Models\Education;
use App\Repositories\Contracts\EducationRepositoryInterface;
use Illuminate\Support\Collection;

class EducationRepository implements EducationRepositoryInterface
{
    public function findByJobSeeker(int $jobSeekerId): Collection
    {
        return Education::where('job_seeker_id', $jobSeekerId)->latest()->get();
    }

    public function create(array $data): Education
    {
        return Education::create($data);
    }

    public function delete(int $id): bool
    {
        $education = Education::find($id);
        if (!$education) return false;
        return $education->delete();
    }
}
