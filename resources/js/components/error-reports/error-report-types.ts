export type ErrorReportFile = {
    id: number;
    file_name: string;
    file_path: string | null;
    download_url?: string | null;
};

export type ErrorReportUser = {
    id: number;
    name: string;
    email: string;
};

export type ErrorReportSummary = {
    error_id: number;
    report_text: string;
    created_at: string | null;
    resolved_at: string | null;
    user: ErrorReportUser;
    files: ErrorReportFile[];
};

export type ErrorReportStats = {
    total: number;
    unresolved: number;
    resolved: number;
    with_files: number;
};
