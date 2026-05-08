<?php

namespace App\Http\Controllers;

use App\Models\ErrorReport;
use App\Models\ErrorReportFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminErrorMessageController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return redirect()->route('login');
        }
        //        $countsByStatus = OnboardingRequest::query() // get status metrics
        //        ->selectRaw("
        //            SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        //            SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        //            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
        //            ")
        //            ->first();
        $countsByStatus = ErrorReport::query()
            ->selectRaw('
                SUM(error_id) as total,
                SUM(CASE WHEN resolved_at IS NULL THEN 1 ELSE 0 END) as unresolved,
                SUM(CASE WHEN resolved_at IS NOT NULL THEN 1 ELSE 0 END) as resolved
            ')->first();
        $countsByStatus = [
            ...$countsByStatus->toArray(),
            // inner join will left only these reports that have files
            'with_files' => ErrorReport::query()
                ->join(
                    'error_images', 'error_reports.error_id', '=', 'error_images.error_id')
                ->count(),
        ];

        $reports = ErrorReport::query()
            ->with('user')
            ->with('fileLinks.file')
            ->get();

        $reports = $reports->map(function ($report) {
            $files = $report->fileLinks;
            return [

                'error_id' => $report->error_id,
                'report_text' => json_decode($report->report_text),
                'created_at' => $report->created_at?->toDateTimeString(),
                'resolved_at' => $report->resolved_at?->toDateTimeString(),
                'user' => [
                    'id' => $report->user->id,
                    'name' => $report->user->name,
                    'email' => $report->user->email,
                ],
                'files' => $files->map(function ($reportFile) {
                    return [
                        'id' => $reportFile->file->id,
                        'file_name' => $reportFile->file->file_name,
                        'file_path' => $reportFile->file->file_path,
                        'download_url' => $reportFile->file->file_path,
                    ];
                }),
            ];
        });
        //        'reports' => [
        //            [
        //                'error_id' => int,
        //                'report_text' => string,
        //                'created_at' => ?string,
        //                'resolved_at' => ?string,
        //                'user' => [
        //            'id' => int,
        //            'name' => string,
        //            'email' => string,
        //        ],
        //                'files' => [
        //            [
        //                'id' => int,
        //                'file_name' => string,
        //                'file_path' => ?string,
        //                        'download_url' => ?string, // preferred for opening files
        //                    ],
        //                ],
        //            ],
        //        ],
        return Inertia::render('admin/error-reports', [
            'stats' => $countsByStatus,
            'reports' => $reports,
        ]);
    }
    public function downloadFile(Request $request, int $errorId, int $userId, int $fileId)
    {

        $file = ErrorReportFile::query()
            ->where('error_id', $errorId)
            ->where('user_id', $userId)
            ->where('file_id', $fileId)
            ->first();
        $storedFile = $file->file()->first();
        return Storage::download(
            $storedFile->file_path,
            $storedFile->file_name
        );
    }
}
