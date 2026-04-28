import { useTranslation } from '@/hooks/use-translation';
import { MarksTablePreview, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import moment from 'moment';
import { forwardRef } from 'react';

const schoolYearMonths = [
    'Sep',
    'Oct',
    'Nov',
    'Dec',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
];

const getShortenMonthName = (month: string) => {
    const allowedLong = ['May', 'Май', 'Maijs'];

    return allowedLong.includes(month) ? month : month.substring(0, 3);
};
export const StudentMarksTablePreview = forwardRef<
    HTMLDivElement,
    MarksTablePreview
>(({ marks, enrolledModules }, ref) => {
    const { t } = useTranslation();
    const { auth } = usePage<SharedData>().props;
    const getMarksForModuleAndMonth = (moduleName: string, month: string) => {
        // filter marks for the current module and month
        return marks.filter((mark) => {
            const markMonth = moment(mark.submitted_on).format('MMM');

            return mark.module_name === moduleName && markMonth === month;
        });
    };

    const getAverageGrade = (moduleName: string) => {
        const moduleMarks = marks.filter(
            (mark) => mark.module_name === moduleName && mark.grade,
        );

        if (moduleMarks.length === 0) {
            return '-';
        }

        const sum = moduleMarks.reduce((total, mark) => total + mark.grade, 0);

        return (sum / moduleMarks.length).toFixed(2);
    };

    return (
        <div className="w-full rounded-md border bg-background p-2" ref={ref}>
            <div className="border-b pb-2 text-center">
                <h1 className="text-sm leading-tight font-semibold">
                    {auth.user.name}
                </h1>
                <p className="text-xs leading-tight text-muted-foreground">
                    {auth.currentOrganization?.organization_name}
                </p>
            </div>

            <table className="w-full table-fixed border-collapse text-[6px] sm:text-xs">
                <thead>
                    <tr className="bg-muted/30">
                        <th className="w-[22%] border px-1 py-1.5 text-center font-semibold">
                            {t('learning.Module')}
                        </th>

                        {schoolYearMonths.map((month) => (
                            <th
                                key={month}
                                className="border px-0.5 py-1.5 text-center font-semibold"
                            >
                                {getShortenMonthName(t('common.' + month))}
                            </th>
                        ))}

                        <th className="border px-0.5 py-1.5 text-center font-semibold">
                            {t('common.Average')}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {enrolledModules.map((moduleName, rowIndex) => (
                        <tr
                            key={moduleName}
                            className={
                                rowIndex % 2 === 0
                                    ? 'bg-background'
                                    : 'bg-muted/10'
                            }
                        >
                            <td className="border px-1 py-1.5 text-left leading-tight font-medium break-words">
                                {moduleName}
                            </td>

                            {schoolYearMonths.map((month) => {
                                const monthMarks = getMarksForModuleAndMonth(
                                    moduleName,
                                    month,
                                );

                                return (
                                    <td
                                        key={month}
                                        className="border px-0.5 py-1.5 text-center align-top leading-tight break-words"
                                    >
                                        {monthMarks.length > 0
                                            ? monthMarks
                                                  .map((mark) =>
                                                      mark.grading_policy ===
                                                      'SUMMATIVE'
                                                          ? mark.grade
                                                          : `${mark.percent}%`,
                                                  )
                                                  .join(' ')
                                            : '-'}
                                    </td>
                                );
                            })}

                            <td className="border px-0.5 py-1.5 text-center leading-tight font-semibold">
                                {getAverageGrade(moduleName)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});
