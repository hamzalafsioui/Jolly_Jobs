<?php

namespace App\Http\Requests\JobOffer;

use App\Models\JobOffer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreJobOfferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Auths are handled by middleware
    }

    public function rules(): array
    {
        return [
            'recruiter_id'      => ['required', 'exists:recruiters,id'],
            'category_id'       => ['required', 'exists:categories,id'],
            'city_id'           => ['required', 'exists:cities,id'],
            'title'             => ['required', 'string', 'max:255'],
            'description'       => ['required', 'string'],
            'contract_type' => [
                'required',
                Rule::in(JobOffer::CONTRACT_TYPES)
            ],
            'salary_min'        => ['nullable', 'numeric'],
            'salary_max'        => ['nullable', 'numeric'],
            'remote'            => ['boolean'],
            'experience_level'  => ['required', 'string', 'max:255'],
            'image_path'        => ['nullable', 'string', 'max:255'],
        ];
    }
}
