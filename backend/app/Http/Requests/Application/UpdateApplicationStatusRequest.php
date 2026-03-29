<?php

namespace App\Http\Requests\Application;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateApplicationStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => [
                'required', 
                'string', 
                Rule::in(['sent', 'viewed', 'shortlisted', 'rejected', 'accepted'])
            ],
        ];
    }
}
