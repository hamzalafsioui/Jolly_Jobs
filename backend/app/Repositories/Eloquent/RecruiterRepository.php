<?php

namespace App\Repositories\Eloquent;

use App\Models\Recruiter;
use App\Repositories\Contracts\RecruiterRepositoryInterface;

class RecruiterRepository implements RecruiterRepositoryInterface
{
    public function findById(int $id): ?Recruiter
    {
        return Recruiter::with('user')->find($id);
    }

    public function findByUserId(int $userId): ?Recruiter
    {
        return Recruiter::where('user_id', $userId)->first();
    }

    public function create(array $data): Recruiter
    {
        return Recruiter::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $recruiter = Recruiter::find($id);
        if (!$recruiter) return false;
        return $recruiter->update($data);
    }
}
