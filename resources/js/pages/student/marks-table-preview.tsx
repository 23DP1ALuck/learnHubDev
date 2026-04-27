import {Head, Link, usePage} from "@inertiajs/react";
import {route} from "ziggy-js";
import {Button} from "@/components/ui/button";
import StudentMarksTable from "@/components/student/student-marks-table";
import AppLayout from "@/layouts/app-layout";
import {useTranslation} from "@/hooks/use-translation";

type MarksTablePreview = {
    marks: any;
    enrolledModules: any;
}
function MarksTablePreview({marks, enrolledModules}: MarksTablePreview) {
    const {t} = useTranslation();
    console.log(marks);
    console.log(enrolledModules);
    return <div>
            <Head title={t('student.Student marks')} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {t('common.Marks')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t(
                                'student.Submitted and graded results for the active organization.',
                            )}
                        </p>
                    </div>
                    <Link href={route('student.marks.table-preview')} className="btn btn-primary">
                        <Button variant={"outline"}>Atvert liecību</Button>
                    </Link>
                </div>
            </div>
        </div>

}
export default MarksTablePreview;
