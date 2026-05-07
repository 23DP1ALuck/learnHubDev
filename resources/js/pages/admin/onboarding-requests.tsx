import { OnboardingRequestMetricCard } from '@/components/dashboard/admin/OnboardingRequestMetricCard';
import { OnboardingRequestsList } from '@/components/dashboard/admin/OnboardingRequestsList';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useClipboard } from '@/hooks/use-clipboard';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { onboardingRequests } from '@/routes';
import type {
    BreadcrumbItem,
    Flash,
    OnboardingRequest,
    PaginatedData,
} from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Onboarding requests',
        href: onboardingRequests().url,
    },
];
type Metrics = {
    approved: number;
    pending: number;
    rejected: number;
};
type PaginatedProps = PaginatedData & {
    data: OnboardingRequest[];
};
export default function OnboardingRequests({
    onboardingRequests,
    metrics,
    currentStatusFilter
}: {
    onboardingRequests: PaginatedProps;
    metrics: Metrics;
    currentStatusFilter: 'pending' | 'approved' | 'rejected';
}) {
    const { t } = useTranslation();
    const { flash } = usePage<Flash>().props;
    const [, copy] = useClipboard();
    const lastInviteUrlRef = useRef<string | undefined>(undefined);
    const inviteLinkCreatedMessage = t('common.Invite link created');
    const copyLabel = t('common.Copy');
    useEffect(() => {
        if (
            !flash?.invite_url ||
            flash.invite_url === lastInviteUrlRef.current
        ) {
            return;
        }
        lastInviteUrlRef.current = flash.invite_url;
        toast(inviteLinkCreatedMessage, {
            description: flash.invite_url,
            action: {
                label: copyLabel,
                onClick: () => copy(flash.invite_url as string),
            },
        });
    }, [copy, copyLabel, flash?.invite_url, inviteLinkCreatedMessage]);

    const [onboardingRequestFilterCard, setOnboardingRequestFilterCard] = useState<string>(currentStatusFilter);
    useEffect(() => {
        setOnboardingRequestFilterCard(currentStatusFilter);
    }, [currentStatusFilter]);
    const handleOnboardingRequestFilterCardChange = (onboardingRequestType: string) => {
        if(onboardingRequestType === onboardingRequestFilterCard) return; // to prevent making the same request more than 1 time
        setOnboardingRequestFilterCard(onboardingRequestType);
        if(statusInputRef.current) {
            statusInputRef.current.value = onboardingRequestType; // need to set, because after rerender the input might have not been changed
        }
        if(!buttonRef.current) return;
        buttonRef.current.click();
    }
    const buttonRef = useRef<HTMLButtonElement>(null);
    const statusInputRef = useRef<HTMLInputElement>(null)
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('common.Admin Dashboard')} />
            <form action={route('onboarding-requests')} method="get">
                <input type="hidden" name="status" value={onboardingRequestFilterCard} ref={statusInputRef}/>
                <button type="submit" className="hidden" ref={buttonRef}></button>
            </form>
            <div className="flex min-h-0 flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {Object.entries(metrics).map(
                        ([onboardingRequestType, count]) => (
                            <OnboardingRequestMetricCard
                                key={onboardingRequestType}
                                onboardingRequestType={
                                    onboardingRequestType as OnboardingRequest['status']
                                }
                                count={count}
                                active={onboardingRequestFilterCard === onboardingRequestType}
                                onClick={() => handleOnboardingRequestFilterCardChange(onboardingRequestType)}
                            />
                        ),
                    )}
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-4">
                    <Pagination>
                        <PaginationContent>
                            {onboardingRequests.links.map((link, index) => {
                                if (index === 0) {
                                    return (
                                        <PaginationItem
                                            key={link.label ?? index}
                                        >
                                            <PaginationPrevious
                                                href={
                                                    onboardingRequests.prev_page_url
                                                }
                                                isActive={link.active}
                                            />
                                        </PaginationItem>
                                    );
                                } else if (
                                    index ===
                                    onboardingRequests.links.length - 1
                                ) {
                                    return (
                                        <PaginationItem
                                            key={link.label ?? index}
                                        >
                                            <PaginationNext
                                                href={
                                                    onboardingRequests.next_page_url
                                                }
                                                isActive={link.active}
                                            />
                                        </PaginationItem>
                                    );
                                }
                                return (
                                    <PaginationItem key={link.label ?? index}>
                                        <PaginationLink
                                            href={link.url}
                                            isActive={link.active}
                                        >
                                            {link.label}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}
                        </PaginationContent>
                    </Pagination>
                    <OnboardingRequestsList
                        requests={onboardingRequests.data}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
