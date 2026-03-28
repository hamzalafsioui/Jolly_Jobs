<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobOfferResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'recruiter' => $this->whenLoaded('recruiter', function () {
                return new UserResource($this->recruiter?->user);
            }),
            'category_id'        => $this->category_id,
            'city_id'            => $this->city_id,
            'title'              => $this->title,
            'description'        => $this->description,
            'contract_type'      => $this->contract_type,
            'salary_min'         => $this->salary_min,
            'salary_max'         => $this->salary_max,
            'remote'             => (bool) $this->remote,
            'experience_level'   => $this->experience_level,
            'status'             => $this->status,
            'views_count'        => $this->views_count,
            'applications_count' => $this->applications_count,
            'image_path'         => $this->image_path,
            'created_at'         => $this->created_at?->toISOString(),
            'updated_at'         => $this->updated_at?->toISOString(),
        ];
    }
}
