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
        // filter marks for the current module and month
        return marks.filter((mark) => {
            const markMonth = moment(mark.submitted_on).format('MMM');

            return mark.module_name === moduleName && markMonth === month;
        });
    };

    const getAverageGrade = (moduleName: string) => {
        const moduleMarks =
            marks.filter((mark) => mark.module_name === moduleName && mark.grade);

        if (moduleMarks.length === 0) {
            return '-';
        }

        const sum = moduleMarks.reduce((total, mark) => total + mark.grade, 0);

        return (sum / moduleMarks.length).toFixed(2);
    };

    return (
        <div className="w-full">
            <table className="w-full table-fixed border-collapse text-[6px] sm:text-xs">
                <thead>
                <tr>
                    <th className="w-[22%] border px-0.5 py-1 text-center font-semibold">
                        {t('learning.Module')}
                    </th>

                    {schoolYearMonths.map((month) => (
                        <th
                            key={month}
                            className="border px-0.5 py-1 text-center font-semibold"
                        >
                            {getShortenMonthName(t('common.' + month))}
                        </th>
                    ))}

                    <th className="border px-0.5 py-1 text-center font-semibold">
                        {t('common.Average')}
                    </th>
                </tr>
                </thead>

                <tbody>
                {enrolledModules.map((moduleName) => (
                    <tr key={moduleName}>
                        <td className="break-words border px-0.5 py-1 text-center">
                            {moduleName}
                        </td>

                        {schoolYearMonths.map((month) => {
                            const monthMarks = getMarksForModuleAndMonth(moduleName, month);

                            return (
                                <td
                                    key={month}
                                    className="break-words border px-0.5 py-1 text-center align-top"
                                >
                                    {monthMarks.length > 0 // show percent for formative darbs and mark for summative
                                        ? monthMarks.map((mark) => (
                                            mark.grading_policy === 'SUMMATIVE' ? mark.grade : `${mark.percent}%`))
                                            .join(' ')
                                        : '-'}
                                </td>
                            );
                        })}

                        <td className="border px-0.5 py-1 text-center font-semibold">
                            {getAverageGrade(moduleName)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
