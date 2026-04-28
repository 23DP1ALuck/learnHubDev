import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import {
    onboardingRequests as onboardingRequestsRoute,
    organizations,
} from '@/routes';
import { Link } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';

type AdminDashboardHeroProps = {
    userName: string;
};

export function AdminDashboardHero({ userName }: AdminDashboardHeroProps) {
    const { t } = useTranslation();

    return (
        <section className="overflow-hidden rounded-3xl border border-sidebar-border/70 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.18),_transparent_35%),linear-gradient(135deg,_#f8fafc,_#ecfeff)] p-6 dark:border-sidebar-border">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl space-y-3">
                    <Badge variant="secondary" className="w-fit">
                        <ShieldCheck className="size-3.5" />
                        {t('common.Admin dashboard')}
                    </Badge>
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {t('common.Welcome back,')} {userName}
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {t(
                                'admin.Monitor organizations, onboarding requests, and user growth from one place.',
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button asChild>
                        <Link href={onboardingRequestsRoute().url}>
                            {t('common.Onboarding requests')}
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={organizations().url}>
                            {t('common.Organizations')}
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
