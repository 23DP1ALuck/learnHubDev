import AppLayout from "@/layouts/app-layout";
import {Head, usePage} from "@inertiajs/react";
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
import {useEffect, useRef} from "react";
import type {Flash} from "@/types";
import {toast} from "sonner";
import {useClipboard} from "@/hooks/use-clipboard";
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
    const {flash} = usePage<Flash>().props;
    const [, copy] = useClipboard();
    const lastInviteUrlRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (!flash?.invite_url || flash.invite_url === lastInviteUrlRef.current) {
            return;
        }

        lastInviteUrlRef.current = flash.invite_url;

        toast("Invite link created", {
            description: flash.invite_url,
            action: {
                label: "Copy",
                onClick: () => copy(flash.invite_url as string),
            },
        });
    }, [copy, flash?.invite_url]);

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
