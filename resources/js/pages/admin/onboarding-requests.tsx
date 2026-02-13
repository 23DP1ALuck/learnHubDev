import AppLayout from "@/layouts/app-layout";
import {Head} from "@inertiajs/react";
import {PlaceholderPattern} from "@/components/ui/placeholder-pattern";
import {RecentActivity} from "@/components/dashboard/admin/RecentActivity";
import type {BreadcrumbItem, OnboardingRequest} from "@/types";
import {dashboard, onboardingRequests} from "@/routes";
import {OnboardingRequestMetricCard} from "@/components/dashboard/admin/OnboardingRequestMetricCard";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Onboarding requests",
        href: onboardingRequests().url,
    },
];
type Metrics = {
    approved: number,
    pending: number,
    rejected: number,
}
export default function OnboardingRequests({onboardingRequests, metrics}: { onboardingRequests: OnboardingRequest[], metrics: Metrics}) {
    console.log(onboardingRequests);
        return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {Object.entries(metrics).map(([onboardingRequestType, count]) => (
                        <OnboardingRequestMetricCard
                            key={onboardingRequestType}
                            onboardingRequestType={onboardingRequestType as OnboardingRequest['status']}
                            count={count}/>
                    ))}
                </div>
            </div>
        </AppLayout>)
}
