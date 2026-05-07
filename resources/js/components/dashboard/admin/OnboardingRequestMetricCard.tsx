import { CheckCircleIcon, CircleX, Clock } from 'lucide-react';

type OnboardingRequestMetricCardProps = {
    onboardingRequestType: 'pending' | 'approved' | 'rejected';
    count: number;
    active: boolean;
    onClick?: () => void;
};
const iconsByStatus = {
    pending: <Clock className="fill-blue-400 text-white" />,
    approved: <CheckCircleIcon className="fill-green-400 text-white" />,
    rejected: <CircleX className="fill-red-400 text-white" />,
};
export const OnboardingRequestMetricCard = ({
    onboardingRequestType,
    count,
    active,
    onClick
}: OnboardingRequestMetricCardProps) => {
    return (
        <div
            className={`flex flex-col gap-5 rounded-xl  ${active ? 'bg-gray-400/20 border border-black/10' : 'bg-white border border-sidebar-border/70 hover:bg-gray-400/2 duration-150 '} p-6 dark:border-sidebar-border cursor-pointer`}
            onClick={onClick}>
            <div className="flex gap-3">
                {iconsByStatus[onboardingRequestType]}
                {`${onboardingRequestType.charAt(0).toUpperCase()}${onboardingRequestType.slice(1)}`}
            </div>
            <div className="text-xl font-semibold">{count}</div>
        </div>
    );
};
