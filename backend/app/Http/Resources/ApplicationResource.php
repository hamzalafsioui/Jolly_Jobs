<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'job_seeker_id'  => $this->job_seeker_id,
            'job_offer_id'   => $this->job_offer_id,
            'status'         => $this->status,
            'cover_letter'   => $this->cover_letter,
            'cv_path'        => $this->cv_path,
            'viewed_at'      => $this->viewed_at,
            'created_at'     => $this->created_at?->toISOString(),
            'updated_at'     => $this->updated_at?->toISOString(),
            'job_seeker'     => $this->whenLoaded('jobSeeker', function() {
                return [
                    'id' => $this->jobSeeker->id,
                    'user' => new UserResource($this->jobSeeker->user),
                ];
            }),
            'job_offer'      => new JobOfferResource($this->whenLoaded('jobOffer')), 
        ];
    }
}
