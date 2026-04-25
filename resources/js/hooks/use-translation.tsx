import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function useTranslation() {
    const { translations } = usePage<SharedData>().props;

    function t(key: string): string {
        const separatorIndex = key.indexOf('.');

        if (separatorIndex === -1) {
            return key;
        }

        const group = key.slice(0, separatorIndex);
        const item = key.slice(separatorIndex + 1);

        return translations[group]?.[item] ?? key;
    }

    return { t };
}
