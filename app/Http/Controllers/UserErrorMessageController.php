<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreErrorMessageRequest;
use App\Models\ErrorReport;
use App\Models\ErrorReportFile;
use App\Models\StoredFile;
use Exception;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserErrorMessageController extends Controller
{
    public function create()
    {
        return Inertia::render('error-reports/create', []);
    }

    public function store(StoreErrorMessageRequest $request)
    {
        $validated = $request->validated();
        $file = $request->file('file');
        $user = $request->user();

        // if user has attached a file to the report
        $fileExtension = null;
        $storedPath = null;
        $fileName = null;
        if ($file) {
            $storedPath = $file->store('error-reports');
            $fileName = $file->getClientOriginalName();
        }

        try {
            DB::transaction(function () use ($user, $validated, $file, $fileName, $storedPath) {
                $error = ErrorReport::create([
                    'user_id' => $user->id,
                    'report_text' => json_encode($validated['report_text']),
                ]);
                if ($file) {
                    $storedFile = StoredFile::create([
                        'file_name' => $fileName,
                        'file_path' => $storedPath,
                    ]);
                    ErrorReportFile::create([
                        'error_id' => $error->error_id,
                        'user_id' => $error->user_id,
                        'file_id' => $storedFile->id,
                    ]);
                }
            });
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to submit error report');
        }

        return redirect()->back()->with('success', 'Error report submitted successfully');
    }
}
