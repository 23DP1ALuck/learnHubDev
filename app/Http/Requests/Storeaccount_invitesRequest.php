<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class Storeaccount_invitesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && $user->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'invitation_type' => ['required', Rule::in(['onboarding_request', 'join_org'])],
            'onboarding_request_id' => [
                'nullable',
                'integer',
                Rule::requiredIf(fn () => $this->input('invitation_type') === 'onboarding_request'),
                'exists:onboarding_requests,id',
            ],
        ];
    }
}
