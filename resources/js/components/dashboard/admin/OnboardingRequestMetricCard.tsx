import { CheckCircleIcon, CircleX, Clock } from 'lucide-react';

type OnboardingRequestMetricCardProps = {
    onboardingRequestType: 'pending' | 'approved' | 'rejected';
    count: number;
};
const iconsByStatus = {
    pending: <Clock className="fill-blue-400 text-white" />,
    approved: <CheckCircleIcon className="fill-green-400 text-white" />,
    rejected: <CircleX className="fill-red-400 text-white" />,
};
export const OnboardingRequestMetricCard = ({
    onboardingRequestType,
    count,
}: OnboardingRequestMetricCardProps) => {
    return (
        <div className="flex flex-col gap-5 rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border">
            <div className="flex gap-3">
                {iconsByStatus[onboardingRequestType]}
                {`${onboardingRequestType.charAt(0).toUpperCase()}${onboardingRequestType.slice(1)}`}
            </div>
            <div className="text-xl font-semibold">{count}</div>
        </div>
    );
};
