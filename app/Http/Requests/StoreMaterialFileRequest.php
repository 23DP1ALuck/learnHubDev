<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\AuthorizesLearningContent;
use Illuminate\Foundation\Http\FormRequest;

class StoreMaterialFileRequest extends FormRequest
{
    use AuthorizesLearningContent;

    public function authorize(): bool
    {
        return $this->canManageLearningContent();
    }

    public function rules(): array
    {
        return [
            'module_id' => ['required', 'integer', 'exists:modules,id'],
            'topic_id' => ['required', 'integer'],
            'material_id' => ['required', 'integer'],
            'file_name' => ['nullable', 'string', 'max:120'],
            'file' => ['required', 'file'],
        ];
    }
}
