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
            'category'           => $this->whenLoaded('category'),
            'city_id'            => $this->city_id,
            'city'               => $this->whenLoaded('city'),
            'skills'             => $this->whenLoaded('skills'),
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
            'address'            => $this->address,
            'latitude'           => (float) $this->latitude,
            'longitude'          => (float) $this->longitude,
            'is_saved'           => $this->when($request->user() && $request->user()->jobSeeker, function() use ($request) {
                return $request->user()->jobSeeker->savedJobs()->where('job_offer_id', $this->id)->exists();
            }),
            'is_applied'         => $this->when($request->user() && $request->user()->jobSeeker, function() use ($request) {
                return $request->user()->jobSeeker->applications()->where('job_offer_id', $this->id)->exists();
            }),
            'created_at'         => $this->created_at?->toISOString(),
            'updated_at'         => $this->updated_at?->toISOString(),
        ];
    }
}
