<?php

namespace App\Http\Requests\Application;

use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'job_offer_id' => ['required', 'exists:job_offers,id'],
            'cover_letter' => ['nullable', 'string'],
            'cv_path'      => ['required', 'string'],
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->route('jobOfferId')) {
            $this->merge([
                'job_offer_id' => $this->route('jobOfferId'),
            ]);
        }
    }
}
