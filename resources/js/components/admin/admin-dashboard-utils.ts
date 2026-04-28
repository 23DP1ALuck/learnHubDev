import { OnboardingRequest } from '@/types';

export function formatAdminDashboardDate(value: string | Date | null): string {
    if (!value) {
        return '-';
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return String(value);
    }

    return parsed.toLocaleDateString();
}

export function getOnboardingRequestName(request: OnboardingRequest): string {
    return [request.first_name, request.last_name].join(' ');
}
