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
            'recruiter' => $this->whenLoaded('recruiter', function () use ($request) {
                $data = $this->recruiter?->user ? (new UserResource($this->recruiter->user))->toArray($request) : [];
                return array_merge($data, [
                    'company_name' => $this->recruiter?->company_name,
                    'company_size' => $this->recruiter?->company_size,
                    'industry'     => $this->recruiter?->industry,
                    'website'      => $this->recruiter?->website,
                    'logo'         => $this->recruiter?->logo,
                    'description'  => $this->recruiter?->description,
                ]);
            }),
            'category_id'        => $this->category_id,
            'city_id'            => $this->city_id,
            'city'               => $this->whenLoaded('city'),
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
