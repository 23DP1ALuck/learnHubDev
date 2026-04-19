import StudentAssignmentSummaryCard from '@/components/student/student-assignment-summary';
import StudentAssignmentTopicsList from '@/components/student/student-assignment-topics-list';
import type { StudentAssignmentDetail, StudentAssignmentTopic } from '@/components/student/student-types';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Flash } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from "react";
import { toast } from "sonner";
import { route } from 'ziggy-js';

export default function StudentAssignmentPage({
    assignment,
    topics,
}: {
    assignment: StudentAssignmentDetail;
    topics: StudentAssignmentTopic[];
}) {
    const { flash } = usePage<Flash>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Assignments',
            href: route('student.assignments'),
        },
        {
            title: assignment.title,
            href: route('student.assignments.show', assignment.id),
        },
    ];
    useEffect(() => {
        if(flash?.success){
            toast.success(flash?.success);
        }
    }, [flash?.success]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={assignment.title} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <StudentAssignmentSummaryCard assignment={assignment} />
                <StudentAssignmentTopicsList topics={topics} />
            </div>
        </AppLayout>
    );
}
