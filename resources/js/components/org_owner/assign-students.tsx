import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { OrganizationGroup, User } from '@/types';
import { Input } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useRoute } from 'ziggy-js';
export const AssignStudents = ({
    group,
    students,
}: {
    group: OrganizationGroup;
    students: User[];
}) => {
    const { t } = useTranslation();
    const route = useRoute();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">{t('common.Assign students')}</Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[40vh] flex-col sm:max-w-sm">
                <Form
                    action={route('groups.assign-students')}
                    method={'patch'}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <DialogHeader>
                        <DialogTitle>{t('common.Assign students')}</DialogTitle>
                        <DialogDescription>
                            {t('owner.Assign students to group \u2014')}{' '}
                            {group.name}
                            {t("owner.. Click save when you're done.")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex min-h-0 flex-1 flex-col gap-3">
                        <div className="flex shrink-0 items-center justify-between gap-2">
                            <p className="text-md font-bold text-muted-foreground">
                                {t('common.Students')}
                            </p>
                            <Card className="flex flex-row items-center gap-2 p-1">
                                <Search className="size-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder={t('owner.Search students')}
                                    className="bg-transparent outline-none"
                                />
                            </Card>
                        </div>

                        <div className="flex min-h-0 flex-col gap-2 overflow-y-auto pr-1">
                            <input
                                type="hidden"
                                name="group_id"
                                value={group.group_id.toString()}
                                id={group.group_id.toString()}
                            />
                            {students.map((student) => (
                                <Card
                                    key={student.id}
                                    className="flex shrink-0 flex-row items-center justify-between p-2"
                                >
                                    <Label
                                        htmlFor={student.id.toString()}
                                        className="w-full text-sm text-muted-foreground"
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
                            <Button variant="outline">
                                {t('common.Cancel')}
                            </Button>
                        </DialogClose>
                        <Button type="submit">
                            {t('common.Save changes')}
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
