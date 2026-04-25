import InputError from '@/components/input-error';
import { DeleteModule } from '@/components/teacher/delete-module';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { Form, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
const textareaClassName =
    'min-h-32 max-h-[50dvh] w-full resize-y overflow-auto rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';
type EditModuleFormProps = {
    module: {
        id: number;
        name: string;
        description: string | null;
        start_date: string | null;
        end_date: string | null;
    };
};
export default function EditModuleForm({ module }: EditModuleFormProps) {
    const { t } = useTranslation();
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{t('learning.Module details')}</CardTitle>
                <CardDescription>
                    {t(
                        'teacher.Change the title, schedule, and short summary shown across the teacher workspace.',
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form
                    action={route('modules.update', module.id)}
                    method="patch"
                    className="grid gap-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">
                                    {t('learning.Module name')}
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={module.name}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">
                                    {t('common.Description')}
                                </Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    defaultValue={module.description ?? ''}
                                    className={textareaClassName}
                                    placeholder={t(
                                        'teacher.What this module covers, learning goals, or expected outcomes.',
                                    )}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="start_date">
                                        {t('learning.Start date')}
                                    </Label>
                                    <Input
                                        id="start_date"
                                        name="start_date"
                                        type="date"
                                        defaultValue={module.start_date ?? ''}
                                    />
                                    <InputError message={errors.start_date} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end_date">
                                        {t('learning.End date')}
                                    </Label>
                                    <Input
                                        id="end_date"
                                        name="end_date"
                                        type="date"
                                        defaultValue={module.end_date ?? ''}
                                    />
                                    <InputError message={errors.end_date} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <Button variant="outline" asChild>
                                    <Link
                                        href={route(
                                            'teacher.modules.show',
                                            module.id,
                                        )}
                                    >
                                        {t('learning.Back to module')}
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {t('common.Save changes')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
            <div className="w-full px-4">
                <DeleteModule
                    module={{
                        id: module.id,
                        name: module.name,
                    }}
                    onFullWidth={true}
                />
            </div>
        </Card>
    );
}
