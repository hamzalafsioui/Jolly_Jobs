<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'first_name' => $this->first_name,
            'last_name'  => $this->last_name,
            'full_name'  => $this->first_name . ' ' . $this->last_name,
            'email'      => $this->email,
            'role'       => $this->role,
            'city_id'    => $this->city_id,
            'phone'      => $this->phone,
            'bio'        => $this->bio,
            'photo'      => $this->photo,
            'is_active'  => $this->is_active,
            'recruiter'  => $this->when($this->role === 'recruiter', $this->recruiter),
            'job_seeker' => $this->when($this->role === 'job_seeker', $this->jobSeeker),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
