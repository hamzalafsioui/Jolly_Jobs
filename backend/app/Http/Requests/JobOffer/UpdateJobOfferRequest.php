<?php

namespace App\Http\Requests\JobOffer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\JobOffer;

class UpdateJobOfferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Auths are handled by middleware
    }

    public function rules(): array
    {
        return [
            'recruiter_id'      => ['sometimes', 'exists:recruiters,id'],
            'category_id'       => ['sometimes', 'exists:categories,id'],
            'city_id'           => ['sometimes', 'exists:cities,id'],
            'title'             => ['sometimes', 'string', 'max:255'],
            'description'       => ['sometimes', 'string'],
            'contract_type'     => ['sometimes', Rule::in(JobOffer::CONTRACT_TYPES)],
            'salary_min'        => ['nullable', 'numeric'],
            'salary_max'        => ['nullable', 'numeric'],
            'remote'            => ['sometimes', 'boolean'],
            'experience_level'  => ['sometimes', 'string', 'max:255'],
            'status'            => ['sometimes', Rule::in(['active', 'closed', 'draft', 'expired'])],
            'image_path'        => ['nullable', 'string', 'max:255'],
        ];
    }
}
