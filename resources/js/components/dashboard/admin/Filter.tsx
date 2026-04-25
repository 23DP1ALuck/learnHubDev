import FilterIcon from '@/components/icons/FilterIcon';
import { useTranslation } from '@/hooks/use-translation';
import { ChevronRight } from 'lucide-react';
import { FC } from 'react';
export const Filter: FC = () => {
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-center gap-2.5 rounded bg-black/5 px-2">
            <FilterIcon className="size-3.5" />
            <p className="text-sm font-medium text-black/30">
                {t('common.Filters')}
            </p>
            <ChevronRight className="size-3.5" />
        </div>
    );
};
