import InputError from '@/components/input-error';
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
import { Form } from '@inertiajs/react';
import { route } from 'ziggy-js';
const textareaClassName =
    'min-h-24 max-h-[50dvh] w-full resize-y overflow-auto rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';
export default function ModulesCreate() {
    const { t } = useTranslation();
    return (
        <Card className="h-full max-h-[60dvh] overflow-y-auto border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{t('learning.Create module')}</CardTitle>
                <CardDescription>
                    {t(
                        'teacher.Modules are the first level in the structure described in your documentation.',
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form
                    action={route('modules.store')}
                    method="post"
                    resetOnSuccess={[
                        'name',
                        'description',
                        'start_date',
                        'end_date',
                    ]}
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
                                    placeholder={t(
                                        'teacher.Programming fundamentals',
                                    )}
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
                                    />
                                    <InputError message={errors.end_date} />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {t('learning.Create module')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}
