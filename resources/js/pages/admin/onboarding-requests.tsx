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
export default function OnboardingRequests({onboardingRequests}: { onboardingRequests: OnboardingRequest[]}) {
    console.log(onboardingRequests);
        return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <OnboardingRequestMetricCard onboardingRequestType={'pending'} count={15}/>
                    <OnboardingRequestMetricCard onboardingRequestType={'approved'} count={3}/>
                    <OnboardingRequestMetricCard onboardingRequestType={'rejected'} count={4}/>
                </div>
            </div>
        </AppLayout>)
}
