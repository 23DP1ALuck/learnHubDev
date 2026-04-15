import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Form} from "@inertiajs/react";
import {Button} from "@/components/ui/button";
import {OrganizationGroup, OrganizationModule} from "@/types";
import {Card} from "@/components/ui/card";
import {Search} from "lucide-react";
import {Input} from "@headlessui/react";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {useRoute} from 'ziggy-js';
import {useEffect, useState} from "react";

type OrganizationSummary = OrganizationModule & {teacher_name: string};
export const AssignModules = ({group, modules}: {group: OrganizationGroup, modules: OrganizationSummary[]}) => {
    const route = useRoute();
    const [selectedModules, setSelectedModules] = useState<number[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const handleModuleChange = (moduleId: number, checked: boolean) => {
        checked ? setSelectedModules((modules) => {
            return [
                    ...modules,
                    moduleId
                    ]
            }) :
            setSelectedModules((modules) => {
            return modules.filter((module) => module !== moduleId)
        })
    }
    const getGroupModules = async () => {
        const response = await fetch(`/organization/${group.school_id}/groups/${group.group_id}/available-modules`);
        return await response.json();
    }
    const [availableModules, setAvailableModules] = useState<OrganizationSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchModules = async () => {
        try {
            const modules = await getGroupModules();
            setAvailableModules(modules);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch modules');
            setLoading(false);
        }
    }
    const handleOpenChange = async (open: boolean) => {
        setIsOpen(open);

        if (open) {
            setLoading(true);
            setError(null);
            await fetchModules();
        }
    };
    return <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
            <Button variant="outline">Assign modules</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-sm max-h-[50vh] flex flex-col">
            <Form onSuccess={() => setIsOpen(false)} action={route('groups.assign-modules')} method={"patch"} className="flex flex-col flex-1 min-h-0">
                <DialogHeader>
                    <DialogTitle>Assign modules</DialogTitle>
                    <DialogDescription>
                        Assign modules to group — {group.name}. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 flex-1 min-h-0">
                    <div className="flex justify-between items-center gap-2 shrink-0">
                        <p className="text-muted-foreground text-md font-bold">Students</p>
                        <Card className="flex flex-row p-1 items-center gap-2">
                            <Search className="text-muted-foreground size-4" />
                            <Input type="text" placeholder="Search students" className="bg-transparent outline-none"/>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-2 overflow-y-auto min-h-0 pr-1">
                        <input type="hidden" name="group_id" value={group.group_id.toString()} id={group.group_id.toString()}/>
                        {availableModules.map((module) => (
                            <Card
                                key={module.id}
                                className="flex flex-row items-center justify-between p-2 shrink-0"
                            >
                                <div className="flex flex-col gap-1">
                                    <Label
                                        htmlFor={module.id.toString()}
                                        className="text-muted-foreground text-sm w-full"
                                    >
                                        {module.name}
                                    </Label>
                                    <span className="text-muted-foreground text-sm mr-1">Teacher:<span>{module.teacher_name}</span></span>
                                </div>
                                <Checkbox
                                    name="module_id"
                                    id={module.id.toString()}
                                    value={module.id.toString()}
                                    onCheckedChange={(checked) => handleModuleChange(module.id, checked === true)}
                                />

                            </Card>
                        ))}
                        {selectedModules.map((id) => (
                            <input key={id} type="hidden" name="module_ids[]" value={id} />
                        ))}
                    </div>
                </div>

                <DialogFooter className="mt-4 shrink-0">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </Form>
        </DialogContent>
    </Dialog>
}
