<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class JobSeekerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'specialty'        => $this->specialty,
            'experience_level' => $this->experience_level,
            'cv_path'          => $this->cv_path ? (str_starts_with($this->cv_path, 'http') ? $this->cv_path : asset('storage/' . $this->cv_path)) : null,
            'skills'           => $this->whenLoaded('skills'),
            'experiences'      => $this->whenLoaded('experiences'),
            'created_at'       => $this->created_at?->toISOString(),
            'updated_at'       => $this->updated_at?->toISOString(),
        ];
    }
}
