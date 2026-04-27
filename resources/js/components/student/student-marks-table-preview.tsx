import { MarksTablePreview } from '@/types';
import moment from 'moment';
import { useTranslation } from '@/hooks/use-translation';

const schoolYearMonths = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const getShortenMonthName = (month: string) => {
    const allowedLong = ['May', 'Май', 'Maijs'];

    return allowedLong.includes(month) ? month : month.substring(0, 3);
};

export const StudentMarksTablePreview = ({ enrolledModules, marks }: MarksTablePreview) => {
    const { t } = useTranslation();

    const getMarksForModuleAndMonth = (moduleName: string, month: string) => {
        return marks.filter((mark) => {
            const markMonth = moment(mark.submitted_on).format('MMM');

            return mark.module_name === moduleName && markMonth === month;
        });
    };

    const getAverageGrade = (moduleName: string) => {
        const moduleMarks = marks.filter((mark) => mark.module_name === moduleName && mark.grade);

        if (moduleMarks.length === 0) {
            return '-';
        }

        const sum = moduleMarks.reduce((total, mark) => total + mark.grade, 0);

        return (sum / moduleMarks.length).toFixed(2);
    };

    return (
        <div className="w-full overflow-x-auto rounded-lg border bg-white">
            <table className="w-full min-w-[900px] border-collapse text-xs">
                <thead>
                <tr className="bg-muted/40">
                    <th className="border px-2 py-3 text-left font-semibold">
                        {t('learning.Module')}
                    </th>

                    {schoolYearMonths.map((month) => (
                        <th key={month} className="border px-2 py-3 text-center font-semibold">
                            {getShortenMonthName(t('common.' + month))}
                        </th>
                    ))}

                    <th className="border px-2 py-3 text-center font-semibold">
                        {t('common.Average')}
                    </th>
                </tr>
                </thead>

                <tbody>
                {enrolledModules.map((moduleName) => (
                    <tr key={moduleName}>
                        <td className="border px-2 py-3 font-medium">
                            {moduleName}
                        </td>

                        {schoolYearMonths.map((month) => {
                            const monthMarks = getMarksForModuleAndMonth(moduleName, month);

                            return (
                                <td key={month} className="border px-2 py-3 text-center align-top">
                                    {monthMarks.length > 0 ? (
                                        <div className="flex flex-col gap-1">
                                            {monthMarks.map((mark, index) => (
                                                <span key={index}>
                                                        {mark.grade} ({mark.percent}%)
                                                    </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </td>
                            );
                        })}

                        <td className="border px-2 py-3 text-center font-semibold">
                            {getAverageGrade(moduleName)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
