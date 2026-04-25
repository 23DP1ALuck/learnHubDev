import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/hooks/use-translation';
import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Check, Languages } from 'lucide-react';
import { type HTMLAttributes } from 'react';
import { route } from 'ziggy-js';

const localeLabels = {
    lv: 'Latvian',
    en: 'English',
    ru: 'Russian',
} as const;

export default function LanguageSwitcher({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    function changeLocale(locale: string) {
        router.post(
            route('locale.set', locale),
            {},
            {
                preserveScroll: true,
            },
        );
    }

    const { t } = useTranslation();
    const { locale } = usePage<SharedData>().props;
    const locales = ['lv', 'en', 'ru'] as const;

    return (
        <div className={className} {...props}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-md"
                    >
                        <Languages className="h-5 w-5" />
                        <span className="sr-only">{t('common.Language')}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {locales.map((option) => (
                        <DropdownMenuItem
                            key={option}
                            onClick={() => changeLocale(option)}
                            className="cursor-pointer"
                        >
                            <span className="mr-2 w-5 text-xs uppercase">
                                {option}
                            </span>
                            <span>{t(`common.${localeLabels[option]}`)}</span>
                            {locale === option ? (
                                <Check className="ml-auto h-4 w-4" />
                            ) : null}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
