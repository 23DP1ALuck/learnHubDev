<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreChatRequest extends FormRequest
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
        return [
            'name' => 'nullable|string|max:255',
            'type' => 'required|string|in:GROUP,MODULE,PRIVATE',
            'module_id' => 'nullable|integer|exists:modules,id',
            'organization_id' => 'required|integer|exists:organizations,id',
            'recipient_ids' => [
                'required',
                'array',
                'min:1',
            ],
            'recipient_ids.*' => ['required', 'integer', 'exists:users,id'],
        ];
    }
}
