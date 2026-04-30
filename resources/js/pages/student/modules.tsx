import StudentModulesList from '@/components/student/student-modules-list';
import type { StudentModuleSummary } from '@/components/student/student-types';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Modules',
        href: route('student.modules'),
    },
];
export default function StudentModulesPage({
    modules,
}: {
    modules: StudentModuleSummary[];
}) {
    const { t } = useTranslation();
    const { flash } = usePage<Flash>().props;
    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.error]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('student.Student modules')} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                {flash?.success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t('learning.Modules')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t(
                            'student.The learning modules available to the student in the active organization.',
                        )}
                    </p>
                </div>
                {modules ? <StudentModulesList modules={modules} /> : <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('student.No modules are available yet')}
                        </CardTitle>
                    </CardHeader>
                </Card>}

            </div>
        </AppLayout>
    );
}
