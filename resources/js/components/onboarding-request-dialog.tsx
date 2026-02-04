import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { Form } from '@inertiajs/react';
import { type PropsWithChildren, useState } from 'react';

export default function OnboardingRequestDialog({
    children,
}: PropsWithChildren) {
    const [open, setOpen] = useState(false);
    const [formKey, setFormKey] = useState(0);
    const [organizationType, setOrganizationType] = useState<string>("");

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);

        if (!nextOpen) {
            setFormKey((current) => current + 1);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-black/60">Pieprasīt piekļuvi</DialogTitle>
                    <DialogDescription>
                        Aizpildiet veidlapu, un mēs ar jums sazināsimies.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    key={formKey}
                    action="/onboarding-requests"
                    method="post"
                    onSuccess={() => setOpen(false)}
                    resetOnSuccess
                    className="space-y-6"
                >
                    {({ processing, errors, resetAndClearErrors }) => (
                        <>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first_name" className="text-black/70">
                                        Vārds
                                    </Label>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        placeholder="Vārds"
                                        className="text-gray-700"
                                    />
                                    <InputError message={errors.first_name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last_name" className="text-black/70">
                                        Uzvārds
                                    </Label>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        placeholder="Uzvārds"
                                        className="text-gray-700"
                                    />
                                    <InputError message={errors.last_name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="onboarding_email" className="text-black/70">
                                        E-pasts
                                    </Label>
                                    <Input
                                        id="onboarding_email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        className="text-gray-700"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="onboarding_organization_type" className="text-black/70">
                                        Organizācijas tips
                                    </Label>
                                    <input
                                        type="hidden"
                                        name="organization_type"
                                        value={organizationType}
                                    />

                                    <Select
                                        value={organizationType}
                                        onValueChange={setOrganizationType}
                                    >
                                        <SelectTrigger id="onboarding_organization_type" className="text-black/70">
                                            <SelectValue placeholder="Izvelēties…" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="individual">Kursa veidotājs</SelectItem>
                                            <SelectItem value="school">Skola</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={errors.organization_type}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="onboarding_organization_name" className="text-black/70">
                                        {organizationType === "individual" ? "Kursa nosaukums" : "Organizācijas nosaukums"}
                                    </Label>
                                    <Input
                                        id="onboarding_organization_name"
                                        name="organization_name"
                                        type="text"
                                        required
                                        placeholder=
                                            {organizationType === "individual" ? "Jūsu kurss" : "Jūsu organizācija"}
                                        className="text-gray-700"
                                    />
                                    <InputError
                                        message={errors.organization_name}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => resetAndClearErrors()}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    Submit
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

