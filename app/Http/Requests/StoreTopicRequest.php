<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\AuthorizesLearningContent;
use Illuminate\Foundation\Http\FormRequest;

class StoreTopicRequest extends FormRequest
{
    use AuthorizesLearningContent;

    public function authorize(): bool
    {
        return $this->canManageLearningContent();
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'module_id' => ['required', 'integer', 'exists:modules,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
