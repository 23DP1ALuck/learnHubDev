<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\AuthorizesLearningContent;
use Illuminate\Foundation\Http\FormRequest;

class StoreSchoolGroupRequest extends FormRequest
{
    use AuthorizesLearningContent;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->canManageLearningContent();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'school_id' => 'required|integer|exists:organizations,id',
        ];

    }
}
