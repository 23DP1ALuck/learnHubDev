import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { type OnboardingRequest } from "@/types";
import { Check, Clock, Eye, MoreHorizontal, X } from "lucide-react";
import moment from "moment";
import {router} from "@inertiajs/react";

const statusMeta = {
    pending: {
        label: "Pending",
        Icon: Clock,
        className: "bg-amber-100 text-amber-800",
    },
    approved: {
        label: "Approved",
        Icon: Check,
        className: "bg-green-100 text-green-800",
    },
    rejected: {
        label: "Rejected",
        Icon: X,
        className: "bg-red-100 text-red-800",
    },
} satisfies Record<
    OnboardingRequest["status"],
    {
        label: string;
        Icon: typeof Clock;
        className: string;
    }
>;

const organizationTypeLabel: Record<
    OnboardingRequest["organization_type"],
    string
> = {
    individual: "Individual",
    school: "School",
};

function formatTimestamp(value: unknown) {
    const date = moment(value as moment.MomentInput);
    if (!date.isValid()) return "—";

    if (Math.abs(moment().diff(date, "hours")) < 24) {
        return date.fromNow();
    }

    return date.format("MMMM D, YYYY, h:mm A");
}

export const OnboardingRequestsList = ({
    requests,
}: {
    requests: OnboardingRequest[];
}) => {
    if (requests.length === 0) {
        return (
            <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 text-sm text-muted-foreground dark:border-sidebar-border dark:bg-background">
                No onboarding requests found.
            </div>
        );
    }
    const createInvite = (requestId: number) => {
        router.post(
            "/account-invites",
            {
                invitation_type: "onboarding_request",
                onboarding_request_id: requestId,
            },
            {
                preserveScroll: true,
                onSuccess: () => console.log("Invite created"),
                onError: (errors) => console.log(errors),
            }
        );
    };
    return (
        <div className="w-full relative overflow-auto rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-background">
                <div className="min-w-[900px]">
                    <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1.5fr] gap-6 border-b border-border bg-muted/30 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <div>Name</div>
                        <div>Organization</div>
                        <div>Submitted</div>
                        <div>Status</div>
                        <div className="text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-border">
                        {requests.map((request) => {
                            const meta = statusMeta[request.status];
                            const StatusIcon = meta.Icon;

                            return (
                                <div
                                    key={request.id}
                                    className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1.5fr] items-center gap-6 px-6 py-4 hover:bg-muted/30"
                                >
                                    <div className="min-w-0">
                                        <div className="font-medium text-foreground">
                                            {request.first_name}{" "}
                                            {request.last_name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {request.email}
                                        </div>
                                    </div>

                                    <div className="min-w-0">
                                        <div className="truncate font-medium text-foreground">
                                            {request.organization_name}
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="mt-1 w-fit"
                                        >
                                            {
                                                organizationTypeLabel[
                                                    request.organization_type
                                                ]
                                            }
                                        </Badge>
                                    </div>

                                    <div className="text-sm">
                                        <div>
                                            {formatTimestamp(request.created_at)}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {formatTimestamp(request.updated_at)}
                                        </div>
                                    </div>

                                    <div>
                                        <Badge
                                            variant="secondary"
                                            className={cn(meta.className)}
                                        >
                                            <StatusIcon />
                                            {meta.label}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => createInvite(request.id)}
                                            className="bg-blue-600 text-white hover:bg-blue-700"
                                            disabled={
                                                request.status !== "pending"
                                            }
                                            type="button"
                                        >
                                            <Check />
                                            Approve
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                                            disabled={
                                                request.status !== "pending"
                                            }
                                            type="button"
                                        >
                                            <X />
                                            Reject
                                        </Button>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    aria-label="More actions"
                                                    type="button"
                                                >
                                                    <MoreHorizontal />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye />
                                                    View
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
        </div>
    );
};
