<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskAnswerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $autoGradableTypes = ['CHECKBOX', 'TEXT', 'TRUE_FALSE', 'NUMBER', 'CUSTOM_SELECT'];
        return [
            'answer_text' => [
                Rule::requiredIf(fn () => in_array($this->input('task_type'), $autoGradableTypes, true)),
                'nullable',
                'array',
                'min:1',
            ],
            'answer_text.*' => ['required', 'string', 'max:255'],
        ];
    }
}
