import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { onboardingRequests as onboardingRequestsRoute } from '@/routes';
import { OnboardingRequest } from '@/types';
import { Link } from '@inertiajs/react';
import { getOnboardingRequestName } from './admin-dashboard-utils';

type AdminOnboardingQueueProps = {
    onboardingRequests: OnboardingRequest[];
};

export function AdminOnboardingQueue({
    onboardingRequests,
}: AdminOnboardingQueueProps) {
    const { t } = useTranslation();

    return (
        <Card className="border-sidebar-border/70">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                    <CardTitle>{t('common.Onboarding requests')}</CardTitle>
                    <CardDescription>
                        {t('admin.Latest organization access requests.')}
                    </CardDescription>
                </div>
                <Button asChild variant="outline">
                    <Link href={onboardingRequestsRoute().url}>
                        {t('common.Open')}
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                {onboardingRequests.length === 0 ? (
                    <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                        {t('common.No onboarding requests found.')}
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {onboardingRequests.map((request) => (
                            <div
                                key={request.id}
                                className="flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between"
                            >
                                <div className="min-w-0">
                                    <p className="font-medium">
                                        {getOnboardingRequestName(request) ||
                                            request.email}
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {request.organization_name} ·{' '}
                                        {request.email}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">
                                        {request.organization_type}
                                    </Badge>
                                    <Badge>{request.status}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
