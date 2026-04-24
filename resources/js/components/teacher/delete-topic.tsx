import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader} from "@/components/ui/dialog";
import {DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {route} from "ziggy-js";
import {Form} from "@inertiajs/react";

type DeleteTopicProps = {
    topic: {
        topic_id: number,
        module_id: number,
        name: string,
    },
    onFullWidth?: boolean
}
export const DeleteTopic = ({topic, onFullWidth}: DeleteTopicProps) => {
    const [open, setOpen] = useState(false)
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="destructive" className={onFullWidth ? 'w-full' : ''}>Delete</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <h2 className="text-lg font-semibold">Are you absolutely sure?</h2>
                <p className="text-sm text-muted-foreground">
                    This action cannot be undone. This will permanently delete topic
                    <span className="font-semibold"> {topic.name}</span> and remove its contents.
                </p>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Form method="DELETE" action={route('topics.destroy', [topic.module_id, topic.topic_id])}>
                    <DialogClose asChild>
                        <Button type="submit" variant="destructive">
                            Delete
                        </Button>
                    </DialogClose>
                </Form>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}

