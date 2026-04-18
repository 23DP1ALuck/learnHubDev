<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\AuthorizesLearningContent;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;

class StoreTaskRequest extends FormRequest
{
    use AuthorizesLearningContent;

    public function authorize(): bool
    {
        return $this->canManageLearningContent();
    }

    public function rules(): array
    {
        $autoGradableTypes = ['CHECKBOX', 'TRUE_FALSE', 'NUMBER', 'CUSTOM_SELECT'];
        $selectableTypes = ['CHECKBOX', 'CUSTOM_SELECT'];

        return [
            'assignment_id' => ['required', 'integer', 'exists:assignments,id'],
            'question_text' => ['required', 'string'],
            'task_type' => ['required', Rule::in(['CHECKBOX', 'TEXT', 'FILE', 'TRUE_FALSE', 'NUMBER', 'CUSTOM_SELECT'])],
            'max_points' => ['required', 'numeric', 'min:0'],
            'correct_answers' => [
                'nullable',
                'array',
                'min:1',
            ],
            'correct_answers.*' => ['nullable','string', 'max:255'],
            'options' => [
                Rule::requiredIf(fn () => in_array($this->input('task_type'), $selectableTypes, true)),
                'nullable',
                'array',
                'min:2',
            ],
            'options.*' => ['required', 'string', 'max:255'],
        ];
    }
}
