import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader
} from "@/components/ui/dialog";
import {DialogTrigger} from "@/components/ui/dialog";
import {Form} from "@inertiajs/react";
import {Button} from "@/components/ui/button";
import {DialogTitle} from "@/components/ui/dialog";
import {OrganizationGroup, User} from "@/types";
import {Card} from "@/components/ui/card";
import {Search} from "lucide-react";
import {Input} from "@headlessui/react";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import { useRoute } from 'ziggy-js';
export const AssignStudents = ({group, students}: {group: OrganizationGroup, students: User[]}) => {
    const route = useRoute();
    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline">Assign students</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-sm max-h-[40vh] flex flex-col">
            <Form action={route('groups.assign-students')} method={"patch"} className="flex flex-col flex-1 min-h-0">
                <DialogHeader>
                    <DialogTitle>Assign students</DialogTitle>
                    <DialogDescription>
                        Assign students to group — {group.name}. Click save when you&apos;re done.
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
                        {students.map((student) => (
                            <Card
                                key={student.id}
                                className="flex flex-row items-center justify-between p-2 shrink-0"
                            >
                                <Label
                                    htmlFor={student.id.toString()}
                                    className="text-muted-foreground text-sm w-full"
                                >
                                    {student.name}
                                </Label>
                                <Checkbox
                                    name="student_id"
                                    id={student.id.toString()}
                                    value={student.id.toString()}
                                />
                            </Card>
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
