
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Button} from "@/components/ui/button";
import {Organization} from "@/types";
import {Form} from "@inertiajs/react";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {setActiveOrganization} from "@/actions/App/Http/Controllers/SessionController";

type JoinedOrgProps = {
    organizations: Organization[];
    showList?: boolean;
    onOpenChange?: (open: boolean) => void;
    currentOrganization?: Organization | null | undefined;
};
export const JoinedOrg = ({organizations, showList, onOpenChange, currentOrganization} : JoinedOrgProps) => {
    console.log("qweq", currentOrganization);
    return <Dialog open={showList} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Organizations</DialogTitle>
                    <DialogDescription>
                        Select an organization to continue your learning.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Form className="mt-2 space-y-3" id="active-org-form" action={setActiveOrganization()} onSuccess={() => onOpenChange?.(false)}>
                        <RadioGroup name="currentOrganization" defaultValue={currentOrganization?.id.toString()}>
                        {organizations.length > 1 && (
                            organizations.map((org) => (
                                <div
                                    key={org.id}
                                    className="flex justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                                >
                                {/*<RadioGroupItem value={org.id.toString()}/>*/}
                                {/*    <Label className="text-sm font-medium text-gray-900" htmlFor={org.id.toString()}>{org.organization_name}</Label>*/}
                                    <div className="flex items-center gap-3 w-full">
                                        <RadioGroupItem value={org.id.toString()} id={org.id.toString()}/>
                                        <Label htmlFor={org.id.toString()} className="w-full cursor-pointer">{org.organization_name}</Label>
                                    </div>
                                </div>
                            ))
                        )}
                        </RadioGroup>
                    </Form>

                </div>
                <DialogFooter>
                    <Button type="submit" form="active-org-form">Save changes</Button>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>

                </DialogFooter>
            </DialogContent>
    </Dialog>
}
