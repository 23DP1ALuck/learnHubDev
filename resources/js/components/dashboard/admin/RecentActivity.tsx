import { Filter } from '@/components/dashboard/admin/Filter';
import { useTranslation } from '@/hooks/use-translation';
import { FC } from 'react';
export const RecentActivity: FC = () => {
    const { t } = useTranslation();
    return (
        <div className="flex max-h-[250px] w-full flex-col rounded-xl bg-white p-6">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-xl font-semibold tracking-tight">
                    {t('common.Recent Activity')}
                </h1>
                <Filter />
            </div>
            <div className="flex flex-col overflow-y-auto"></div>
        </div>
    );
};
