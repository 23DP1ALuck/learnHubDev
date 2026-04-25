import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { useTranslation } from '@/hooks/use-translation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Building2, LogOut, Settings } from 'lucide-react';
import { JSX } from 'react';
interface UserMenuContentProps {
    user: User;
    setOpen?: (open: boolean) => void;
    showChangeOption?: boolean;
}
function ChangeOrganization({
    setOpen,
}: {
    setOpen: (open: boolean) => void;
}): JSX.Element {
    const { t } = useTranslation();
    return (
        <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <div
                        className="block w-full cursor-pointer"
                        onClick={() => setOpen(true)}
                    >
                        <Building2 className="mr-2" />
                        {t('owner.Change organization')}
                    </div>
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </>
    );
}
export function UserMenuContent({
    user,
    setOpen,
    showChangeOption,
}: UserMenuContentProps) {
    const { t } = useTranslation();
    const cleanup = useMobileNavigation();
    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };
    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2" />
                        {t('settings.Settings')}
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>

            {showChangeOption && setOpen && (
                <ChangeOrganization setOpen={setOpen} />
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    {t('common.Log out')}
                </Link>
            </DropdownMenuItem>
        </>
    );
}
