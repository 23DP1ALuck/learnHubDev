import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import {Organization, type User} from '@/types';

export function UserInfo({
    user,
    showEmail = false,
    showOrganization = false,
    organization = {} as Organization,
}: {
    user: User;
    showEmail?: boolean;
    showOrganization?: boolean;
    organization?: Organization;
}) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                )}
                {showOrganization && (
                    <span className="truncate text-xs text-muted-foreground">
                        {organization.organization_name}
                    </span>
                )}
            </div>
        </>
    );
}
