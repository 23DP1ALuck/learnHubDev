import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {AddFile} from "@/components/teacher/add-file";
import {route} from "ziggy-js";

type MaterialFileSummary = {
    id: number;
    module_id: number,
    topic_id: number,
    material_id: number,
    file_id: number,
    file: {
        file_name: string,
        file_path: string | null
    }
};

type MaterialFilesListProps = {
    files: MaterialFileSummary[];
    materialContext: Record<string, number>
};

export default function MaterialFilesList({ files, materialContext }: MaterialFilesListProps) {
    console.log(files)
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <div className="flex justify-between">
                    <div className="flex flex-col gap-1.5">
                        <CardTitle>Linked files</CardTitle>
                        <CardDescription>Files attached to this material.</CardDescription>
                    </div>
                    <AddFile materialContext={materialContext}/>
                </div>
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
                                    <a href={route('download-material', [file.module_id, file.topic_id, file.material_id, file.file_id])}>
                                        <div>
                                            <p className="font-semibold">{file.file.file_name}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">#{file.id}</span>
                                    </a>

                                </div>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
