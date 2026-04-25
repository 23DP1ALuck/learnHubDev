import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useTranslation } from '@/hooks/use-translation';
import { Form } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
type DeleteTopicProps = {
    topic: {
        topic_id: number;
        module_id: number;
        name: string;
    };
    onFullWidth?: boolean;
};
export const DeleteTopic = ({ topic, onFullWidth }: DeleteTopicProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="destructive"
                    className={onFullWidth ? 'w-full' : ''}
                >
                    {t('common.Delete')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <h2 className="text-lg font-semibold">
                        {t('common.Are you absolutely sure?')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {t(
                            'teacher.This action cannot be undone. This will permanently delete topic',
                        )}{' '}
                        <span className="font-semibold"> {topic.name}</span>{' '}
                        {t('teacher.and remove its contents.')}
                    </p>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">{t('common.Cancel')}</Button>
                    </DialogClose>
                    <Form
                        method="DELETE"
                        action={route('topics.destroy', [
                            topic.module_id,
                            topic.topic_id,
                        ])}
                    >
                        <DialogClose asChild>
                            <Button type="submit" variant="destructive">
                                {t('common.Delete')}
                            </Button>
                        </DialogClose>
                    </Form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
