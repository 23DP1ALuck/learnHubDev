import {Head, Link, usePage} from "@inertiajs/react";
import {route} from "ziggy-js";
import {Button} from "@/components/ui/button";
import StudentMarksTable from "@/components/student/student-marks-table";
import AppLayout from "@/layouts/app-layout";
import {useTranslation} from "@/hooks/use-translation";
import type {MarksTablePreview, SharedData} from "@/types";
import {StudentMarksTablePreview} from "@/components/student/student-marks-table-preview";


function MarksTablePreview({marks, enrolledModules}: MarksTablePreview) {
    const {t} = useTranslation();
    const {auth} = usePage<SharedData>().props;

    return <div>
            <Head title={t('student.Student marks')} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-2">
                <div className="flex w-screen text-center justify-center">
                    <h1>{auth.user.name}</h1>
                </div>
                <StudentMarksTablePreview marks={marks} enrolledModules={enrolledModules}/>
            </div>
        </div>

}
export default MarksTablePreview;
