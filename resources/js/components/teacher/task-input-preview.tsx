import type { TaskPreview } from '@/components/teacher/task-preview-types';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/use-translation';
import { FileText } from 'lucide-react';
type TaskInputPreviewProps = {
    task: TaskPreview;
};
export default function TaskInputPreview({ task }: TaskInputPreviewProps) {
    const { t } = useTranslation();
    const options = task.options ?? [];
    switch (task.task_type) {
        case 'TEXT':
            return (
                <div className="rounded-2xl border border-dashed bg-muted/30 p-4">
                    <p className="mb-3 text-sm font-medium text-muted-foreground">
                        {t('student.Student answer')}
                    </p>
                    <textarea
                        className="min-h-40 w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none"
                        disabled
                        placeholder={t(
                            'student.Students will type their answer here.',
                        )}
                    />
                </div>
            );
        case 'NUMBER':
            return (
                <div className="rounded-2xl border border-dashed bg-muted/30 p-4">
                    <p className="mb-3 text-sm font-medium text-muted-foreground">
                        {t('student.Student answer')}
                    </p>
                    <Input
                        disabled
                        placeholder={t(
                            'student.Students will enter a numeric answer.',
                        )}
                        type="number"
                    />
                </div>
            );
        case 'FILE':
            return (
                <div className="rounded-2xl border border-dashed bg-muted/30 p-6 text-center">
                    <FileText className="mx-auto mb-3 size-8 text-muted-foreground" />
                    <p className="font-medium">
                        {t('teacher.File upload task')}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {t(
                            'student.Students will upload one or more files here. This task is reviewed manually.',
                        )}
                    </p>
                </div>
            );
        case 'TRUE_FALSE':
            return (
                <div className="grid gap-3 sm:grid-cols-2">
                    {['TRUE', 'FALSE'].map((value) => (
                        <label
                            key={value}
                            className="flex items-center gap-3 rounded-2xl border p-4 opacity-80"
                        >
                            <input
                                disabled
                                name="preview-true-false"
                                type="radio"
                            />
                            <span className="font-medium">{value}</span>
                        </label>
                    ))}
                </div>
            );
        case 'CHECKBOX':
            return (
                <div className="space-y-3">
                    {options.length === 0 ? (
                        <div className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
                            {t('common.No options configured yet.')}
                        </div>
                    ) : (
                        options.map((option) => (
                            <label
                                key={option.option_id}
                                className="flex items-center gap-3 rounded-2xl border p-4 opacity-80"
                            >
                                <input disabled type="checkbox" />
                                <span>{option.option_text}</span>
                            </label>
                        ))
                    )}
                </div>
            );
        case 'CUSTOM_SELECT':
            return (
                <div className="space-y-3">
                    {options.length === 0 ? (
                        <div className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
                            {t('common.No options configured yet.')}
                        </div>
                    ) : (
                        options.map((option) => (
                            <label
                                key={option.option_id}
                                className="flex items-center gap-3 rounded-2xl border p-4 opacity-80"
                            >
                                <input
                                    disabled
                                    name="preview-custom-select"
                                    type="radio"
                                />
                                <span>{option.option_text}</span>
                            </label>
                        ))
                    )}
                </div>
            );
        default:
            return null;
    }
}
