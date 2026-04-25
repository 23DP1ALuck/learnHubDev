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
import { OrganizationGroup, OrganizationModule } from '@/types';
import { Input } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRoute } from 'ziggy-js';
type OrganizationSummary = OrganizationModule & {
    teacher_name: string;
};
export const AssignModules = ({
    group,
}: {
    group: OrganizationGroup;
    modules: OrganizationSummary[];
}) => {
    const { t } = useTranslation();
    const route = useRoute();
    const [selectedModules, setSelectedModules] = useState<number[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const handleModuleChange = (moduleId: number, checked: boolean) => {
        if (checked) {
            setSelectedModules((modules) => {
                return [...modules, moduleId];
            });
            return;
        }

        setSelectedModules((modules) => {
            return modules.filter((module) => module !== moduleId);
        });
    };
    const getGroupModules = async () => {
        const response = await fetch(
            route('groups.available-modules', [
                group.school_id,
                group.group_id,
            ]),
        );
        return await response.json();
    };
    const [availableModules, setAvailableModules] = useState<
        OrganizationSummary[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchModules = async () => {
        try {
            const modules = await getGroupModules();
            setAvailableModules(modules);
            setLoading(false);
        } catch {
            setError(t('owner.Failed to fetch modules'));
            setLoading(false);
        }
    };
    const handleOpenChange = async (open: boolean) => {
        setIsOpen(open);
        if (open) {
            setLoading(true);
            setError(null);
            await fetchModules();
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    {t('learning.Assign modules')}
                </Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[50vh] flex-col sm:max-w-sm">
                <Form
                    onSuccess={() => setIsOpen(false)}
                    action={route('groups.assign-modules')}
                    method={'patch'}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <DialogHeader>
                        <DialogTitle>
                            {t('learning.Assign modules')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('owner.Assign modules to group —')} {group.name}.{' '}
                            {t("owner.Click save when you're done.")}
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
                                    placeholder={t('owner.Search modules')}
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
                            {loading ? (
                                <p className="text-sm text-muted-foreground">
                                    {t('common.Loading')}
                                </p>
                            ) : null}
                            {error ? (
                                <p className="text-sm text-destructive">
                                    {error}
                                </p>
                            ) : null}
                            {!loading &&
                            !error &&
                            availableModules.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    {t(
                                        'owner.No modules are available for this group.',
                                    )}
                                </p>
                            ) : null}
                            {availableModules.map((module) => (
                                <Card
                                    key={module.id}
                                    className="flex shrink-0 flex-row items-center justify-between p-2"
                                >
                                    <div className="flex flex-col gap-1">
                                        <Label
                                            htmlFor={module.id.toString()}
                                            className="w-full text-sm text-muted-foreground"
                                        >
                                            {module.name}
                                        </Label>
                                        <span className="mr-1 text-sm text-muted-foreground">
                                            Teacher:
                                            <span>{module.teacher_name}</span>
                                        </span>
                                    </div>
                                    <Checkbox
                                        name="module_id"
                                        id={module.id.toString()}
                                        value={module.id.toString()}
                                        onCheckedChange={(checked) =>
                                            handleModuleChange(
                                                module.id,
                                                checked === true,
                                            )
                                        }
                                    />
                                </Card>
                            ))}
                            {selectedModules.map((id) => (
                                <input
                                    key={id}
                                    type="hidden"
                                    name="module_ids[]"
                                    value={id}
                                />
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
