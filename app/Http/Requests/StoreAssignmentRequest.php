<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\AuthorizesLearningContent;
use Illuminate\Foundation\Http\FormRequest;

class StoreAssignmentRequest extends FormRequest
{
    use AuthorizesLearningContent;

    public function authorize(): bool
    {
        return $this->canManageLearningContent();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string'],
            'grading_policy' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'topics' => ['required', 'array', 'min:1'],
            'topics.*.module_id' => ['required', 'integer', 'exists:modules,id'],
            'topics.*.topic_id' => ['required', 'integer'],
        ];
    }
}
