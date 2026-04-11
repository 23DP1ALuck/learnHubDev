import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type MaterialFileSummary = {
    id: number;
    file_name: string;
    file_path: string | null;
};

type MaterialFilesListProps = {
    files: MaterialFileSummary[];
};

export default function MaterialFilesList({ files }: MaterialFilesListProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Linked files</CardTitle>
                <CardDescription>Files attached to this material.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {files.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No files linked to this material yet.
                    </div>
                ) : (
                    files.map((file) => (
                        <div key={file.id} className="rounded-xl border p-4">
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-semibold">{file.file_name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {file.file_path || 'No file path stored.'}
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">#{file.id}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
