import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Form} from "@inertiajs/react";
import {route} from "ziggy-js";

type DeleteModuleProps = {
    module: {
        id: number,
        name: string,
    },
    onFullWidth?: boolean
}
export const DeleteModule = ({module, onFullWidth}: DeleteModuleProps) => {
    const [open, setOpen] = useState(false)
    return<Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className={onFullWidth ? 'w-full' : ''} asChild>
            <Button variant="destructive">Delete</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <h2 className="text-lg font-semibold">Are you absolutely sure?</h2>
                <p className="text-sm text-muted-foreground">
                    This action cannot be undone. This will permanently delete module
                    <span className="font-semibold"> {module.name}</span> and remove its contents.
                </p>
            </DialogHeader>
            <DialogFooter>
                <Form method="DELETE" action={route('modules.destroy', module.id)}>
                    <Button type="submit" variant="destructive">
                        Delete
                    </Button>
                </Form>
                <DialogClose asChild>
                    <Button variant="outline" type="button">
                        Cancel
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>

         </Dialog>
}
