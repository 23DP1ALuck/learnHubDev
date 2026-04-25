import { Logo } from '@/components/icons/Logo';
import { NavLink } from '@/components/NavLink';
import OnboardingRequestDialog from '@/components/onboarding-request-dialog';
import { Container } from '@/components/ui/container';
import { useTranslation } from '@/hooks/use-translation';
import {
    Popover,
    PopoverBackdrop,
    PopoverButton,
    PopoverPanel,
} from '@headlessui/react';
import { Link } from '@inertiajs/react';
import clsx from 'clsx';
import LanguageSwitcher from "@/components/shared/language-switcher";
function MobileNavLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <PopoverButton as={Link} href={href} className="block w-full p-2">
            {children}
        </PopoverButton>
    );
}
function MobileNavIcon({ open }: { open: boolean }) {
    return (
        <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
        >
            <path
                d="M0 1H14M0 7H14M0 13H14"
                className={clsx(
                    'origin-center transition',
                    open && 'scale-90 opacity-0',
                )}
            />
            <path
                d="M2 2L12 12M12 2L2 12"
                className={clsx(
                    'origin-center transition',
                    !open && 'scale-90 opacity-0',
                )}
            />
        </svg>
    );
}
function MobileNavigation() {
    const { t } = useTranslation();
    return (
        <Popover>
            <PopoverButton
                className="relative z-10 flex h-8 w-8 items-center justify-center focus:not-data-focus:outline-hidden"
                aria-label={t('common.Toggle Navigation')}
            >
                {({ open }) => <MobileNavIcon open={open} />}
            </PopoverButton>
            <PopoverBackdrop
                transition
                className="fixed inset-0 bg-slate-300/50 duration-150 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
            />
            <PopoverPanel
                transition
                className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in"
            >
                <MobileNavLink href="#features">
                    {t('landing.Funkcijas')}
                </MobileNavLink>
                <MobileNavLink href="#aboutUs">
                    {t('landing.Par mums')}
                </MobileNavLink>
                <MobileNavLink href="#contacts">
                    {t('landing.Kontakti')}
                </MobileNavLink>
                <hr className="m-2 border-slate-300/40" />
                <MobileNavLink href="/login">
                    {t('landing.Ieiet')}
                </MobileNavLink>
            </PopoverPanel>
        </Popover>
    );
}
export function Header() {
    const { t } = useTranslation();
    return (
        <header className="py-10">
            <Container>
                <nav className="relative z-50 flex justify-between">
                    <div className="flex items-center md:gap-x-12">
                        <Link href="#" aria-label={t('common.Home')}>
                            <Logo variant="black" className="size-17" />
                        </Link>
                        <div className="hidden md:flex md:gap-x-6">
                            <NavLink href="#features">
                                {t('landing.Funkcijas')}
                            </NavLink>
                            <NavLink href="#aboutUs">
                                {t('landing.Par mums')}
                            </NavLink>
                            <NavLink href="#contacts">
                                {t('landing.Kontakti')}
                            </NavLink>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-5 md:gap-x-8">
                        <LanguageSwitcher/>
                        <div className="hidden md:block">
                            <NavLink href="/login">
                                {t('landing.Ieiet')}
                            </NavLink>
                        </div>
                        <OnboardingRequestDialog>
                            <button
                                type="button"
                                className="w-fit cursor-pointer rounded-full bg-[#6366F1] px-3 py-2 text-white"
                            >
                                <span className="font-bold">
                                    {t('landing.Pievienojies')}{' '}
                                    <span className="hidden lg:inline">
                                        {t('landing.jau')}
                                    </span>{' '}
                                    {t('landing.tagad')}
                                </span>
                            </button>
                        </OnboardingRequestDialog>
                        <div className="-mr-1 md:hidden">
                            <MobileNavigation />
                        </div>
                    </div>
                </nav>
            </Container>
        </header>
    );
}
