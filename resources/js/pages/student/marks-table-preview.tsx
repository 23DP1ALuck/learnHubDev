import { StudentMarksTablePreview } from '@/components/student/student-marks-table-preview';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import type { MarksTablePreview } from '@/types';
import { Head } from '@inertiajs/react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { useRef } from 'react';

function MarksTablePreview({ marks, enrolledModules }: MarksTablePreview) {
    const { t } = useTranslation();
    const tableRef = useRef<HTMLDivElement>(null);
    const handlePrint = async () => {
        if (!tableRef.current) return;

        const printWidth = 794; // approx a4 width in pixels

        // make a clone, because image size in pdf should not depend from the user's screen size
        const clone = tableRef.current.cloneNode(true) as HTMLElement;
        // set a fixed width and height to the clone and hide it from the user
        clone.style.width = `${printWidth}px`;
        clone.style.maxWidth = `${printWidth}px`;
        clone.style.position = 'fixed';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        clone.style.background = 'white';

        document.body.appendChild(clone);

        const canvas = await html2canvas(clone, {
            scale: 2,
            backgroundColor: '#ffffff',
            windowWidth: printWidth,
        });

        document.body.removeChild(clone);

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();

        const margin = 20;
        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(
            canvas.toDataURL('image/png'),
            'PNG',
            margin,
            margin,
            imgWidth,
            imgHeight,
        );

        pdf.save('marks-table.pdf');
    };
    return (
        <div>
            <Head title={t('student.Student marks')} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-end">
                    <Button onClick={handlePrint}>Print</Button>
                </div>
                <StudentMarksTablePreview
                    marks={marks}
                    enrolledModules={enrolledModules}
                    ref={tableRef}
                />
            </div>
        </div>
    );
}
export default MarksTablePreview;
