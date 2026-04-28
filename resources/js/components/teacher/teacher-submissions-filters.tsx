import type {
    TeacherSubmissionsFilters,
    TeacherSubmissionsGroupOption,
} from '@/components/teacher/teacher-submissions-types';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

const selectClassName =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

type TeacherSubmissionsFiltersProps = {
    filters: TeacherSubmissionsFilters;
    groups: TeacherSubmissionsGroupOption[];
    organizationType: 'school' | 'individual' | null;
    assignmentId: number | null | undefined;
};

export default function TeacherSubmissionsFilters({
    filters,
    groups,
    organizationType,
    assignmentId,
}: TeacherSubmissionsFiltersProps) {
    const { t } = useTranslation();
    const isSchool = organizationType === 'school';
    // TODO: implement search
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{t('common.Filters')}</CardTitle>
                <CardDescription>
                    {isSchool
                        ? t(
                              'teacher.Filter submissions by group or student name.',
                          )
                        : t('teacher.Search submissions by student name.')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    action={route(
                        'teacher.assignments.submissions',
                        assignmentId!,
                    )}
                    method="get"
                    className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                >
                    {isSchool ? (
                        <div className="grid gap-2">
                            <label
                                htmlFor="group_id"
                                className="text-sm font-medium"
                            >
                                {t('common.Groups')}
                            </label>
                            <select
                                id="group_id"
                                name="group_id"
                                className={selectClassName}
                                defaultValue={filters.group_id}
                            >
                                <option value="">
                                    {t('teacher.All groups')}
                                </option>
                                {groups.map((group) => (
                                    <option
                                        key={group.group_id}
                                        value={group.group_id}
                                    >
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : null}

                    <div className="grid gap-2">
                        <label htmlFor="search" className="text-sm font-medium">
                            {t('common.Search')}
                        </label>
                        <Input
                            id="search"
                            name="search"
                            placeholder={t('teacher.Search by student name')}
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <Button type="submit">{t('common.Apply')}</Button>
                        <Button asChild type="button" variant="outline">
                            <Link
                                href={route(
                                    'teacher.assignments.submissions',
                                    assignmentId!,
                                )}
                            >
                                {t('common.Reset')}
                            </Link>
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
