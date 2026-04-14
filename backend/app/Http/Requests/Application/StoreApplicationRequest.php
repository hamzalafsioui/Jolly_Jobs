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
        $merges = [];

        if ($this->route('jobOfferId')) {
            $merges['job_offer_id'] = $this->route('jobOfferId');
        }

        if (!$this->has('cv_path') && $this->user() && $this->user()->jobSeeker) {
            $merges['cv_path'] = $this->user()->jobSeeker->cv_path;
        }

        if (!empty($merges)) {
            $this->merge($merges);
        }
    }
}
