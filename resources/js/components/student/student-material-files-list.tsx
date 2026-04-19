import type { StudentMaterialFileSummary } from '@/components/student/student-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { route } from 'ziggy-js';

type StudentMaterialFilesListProps = {
    files: StudentMaterialFileSummary[];
};

export default function StudentMaterialFilesList({ files }: StudentMaterialFilesListProps) {
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Files</CardTitle>
                <CardDescription>Files attached to this material.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {files.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No files are attached to this material yet.
                    </div>
                ) : (
                    files.map((file) => (
                        <a
                            key={file.file_id}
                            href={route('download-material', [file.module_id, file.topic_id, file.material_id, file.file_id])}
                            className="block rounded-xl border p-4 transition-colors hover:bg-muted/40"
                        >
                            <p className="font-semibold">{file.file.file_name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">#{file.file_id}</p>
                        </a>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
