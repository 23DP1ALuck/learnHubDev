import { toUrl } from '@/lib/utils';
import type { InertiaLinkProps } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

export function useActiveUrl() {
    const page = usePage();
    const currentUrlPath = new URL(page.url, window?.location.origin).pathname;
    // TODO: fix hook for routes with user's role specificationq
    function urlIsActive(
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        currentUrl?: string,
        primaryPath?: boolean // flag if you want to compare a base path
    ) {
        console.log(urlToCheck, currentUrl, primaryPath)
        if (primaryPath){
            const primaryPathUrlToCompare = currentUrl ?? currentUrlPath.split('/')[1];
            return `/${toUrl(urlToCheck).split('/')[1]}` === `/${primaryPathUrlToCompare}`;
        }
        const urlToCompare = currentUrl ?? currentUrlPath;
        return toUrl(urlToCheck) === urlToCompare;
    }

    return {
        currentUrl: currentUrlPath,
        urlIsActive,
    };
}
