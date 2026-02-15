import AppLayout from "@/layouts/app-layout";
import {Head} from "@inertiajs/react";
import type {BreadcrumbItem, OnboardingRequest, PaginatedData} from "@/types";
import {onboardingRequests} from "@/routes";
import {OnboardingRequestMetricCard} from "@/components/dashboard/admin/OnboardingRequestMetricCard";
import {OnboardingRequestsList} from "@/components/dashboard/admin/OnboardingRequestsList";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
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
type PaginatedProps = PaginatedData & { data: OnboardingRequest[] }
export default function OnboardingRequests({onboardingRequests, metrics}: { onboardingRequests: PaginatedProps, metrics: Metrics}) {
        return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex flex-1 min-h-0 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {Object.entries(metrics).map(([onboardingRequestType, count]) => (
                        <OnboardingRequestMetricCard
                            key={onboardingRequestType}
                            onboardingRequestType={onboardingRequestType as OnboardingRequest['status']}
                            count={count}/>
                    ))}
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-4">
                    <Pagination>
                        <PaginationContent>
                            {onboardingRequests.links.map((link, index) => {
                                if(index === 0){
                                    return <PaginationItem key={link.label ?? index}>
                                        <PaginationPrevious href={onboardingRequests.prev_page_url} isActive={link.active}/>
                                    </PaginationItem>
                                } else if (index === onboardingRequests.links.length-1){
                                    return <PaginationItem key={link.label ?? index}>
                                        <PaginationNext href={onboardingRequests.next_page_url} isActive={link.active}/>
                                    </PaginationItem>
                                }
                                return <PaginationItem key={link.label ?? index}>
                                    <PaginationLink href={link.url} isActive={link.active}>{link.label}</PaginationLink>
                                </PaginationItem>
                            })}
                        </PaginationContent>
                    </Pagination>
                        <OnboardingRequestsList requests={onboardingRequests.data}/>
                </div>
            </div>
        </AppLayout>)
}
