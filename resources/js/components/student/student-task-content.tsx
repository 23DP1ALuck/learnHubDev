import { AddAnswerFile } from '@/components/student/student-add-answer-file';
import type { StudentTaskSummary } from '@/components/student/student-types';
import { Badge } from '@/components/ui/badge';
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
import { Form } from '@inertiajs/react';
import { File } from 'lucide-react';
import { useRef, useState } from 'react';
import { route } from 'ziggy-js';
type StudentTaskContentProps = {
    assignmentId: number;
    task: StudentTaskSummary;
};
type LoadedFile = {
    file_name: string;
    file_extension: string | null;
};
type SubmittedFile = {
    file_name: string;
    file_path: string | null;
};
export default function StudentTaskContent({
    assignmentId,
    task,
}: StudentTaskContentProps) {
    const { t } = useTranslation();
    const isAnswered = task.answer !== null && task.answer !== undefined;
    const [files, setFiles] = useState<LoadedFile | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileExtension, setFileExtension] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const selectedAnswers = Array.isArray(task.answer) // for next comparing logic
        ? task.answer
        : [task.answer];

    const submittedFile: SubmittedFile | null = files
        ? {
            file_name: `${files.file_name}${files.file_extension ?? ''}`,
            file_path: null,
        }
        : task.answer_files?.[0] ?? null;
    return (
        <Card className="min-h-[28rem] border-sidebar-border/70">
            <CardHeader className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <CardTitle className="text-xl">
                            {t('student.Task #')}
                            {task.task_id}
                        </CardTitle>
                        <CardDescription>
                            {task.task_type.replace('_', ' ')}
                        </CardDescription>
                    </div>
                    <Badge variant="secondary">{task.max_points} pts</Badge>
                </div>
            </CardHeader>

            <CardContent className="grid gap-6">
                <div className="rounded-3xl border bg-card p-6">
                    <p className="text-base leading-7 whitespace-pre-wrap text-foreground/90">
                        {task.question_text || 'Task content is empty.'}
                    </p>
                </div>

                <Form
                    key={task.task_id}
                    action={route('student.answers.store', [
                        assignmentId,
                        task.task_id,
                    ])}
                    method="post"
                    className="space-y-4"
                    encType="multipart/form-data"
                >
                    <input
                        type="hidden"
                        name="task_type"
                        value={task.task_type}
                    />

                    <h2 className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                        {t('student.Your answer')}
                    </h2>

                    {task.task_type === 'TEXT' && (
                        <textarea
                            name="answer_text[]"
                            className="min-h-40 w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none"
                            placeholder={t(
                                'student.Students type their answer here.',
                            )}
                            defaultValue={selectedAnswers[0] ?? ''}
                            disabled={isAnswered}
                        />
                    )}

                    {task.task_type === 'NUMBER' && (
                        <Input
                            name="answer_text[]"
                            placeholder={t(
                                'student.Students enter a numeric answer here.',
                            )}
                            type="number"
                            defaultValue={selectedAnswers[0] ?? ''}
                            disabled={isAnswered}
                        />
                    )}

                    {task.task_type === 'TRUE_FALSE' && (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {['TRUE', 'FALSE'].map((value) => (
                                <label
                                    key={value}
                                    className="flex items-center gap-3 rounded-2xl border p-4"
                                >
                                    <input
                                        name="answer_text[]"
                                        value={value}
                                        type="radio"
                                        defaultChecked={
                                            selectedAnswers[0] === value
                                        }
                                        disabled={isAnswered}
                                    />
                                    <span className="font-medium">{value}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {(task.task_type === 'CHECKBOX' ||
                        task.task_type === 'CUSTOM_SELECT') && (
                        <div className="space-y-3">
                            {task.options.length === 0 ? (
                                <div className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
                                    {t('common.No options configured yet.')}
                                </div>
                            ) : (
                                task.options.map((option) => (
                                    <label
                                        key={option.option_id}
                                        className="flex items-center gap-3 rounded-2xl border p-4"
                                    >
                                        <input
                                            name={'answer_text[]'}
                                            value={option.option_text}
                                            type={
                                                task.task_type === 'CHECKBOX'
                                                    ? 'checkbox'
                                                    : 'radio'
                                            }
                                            defaultChecked={selectedAnswers.includes(
                                                option.option_text,
                                            )}
                                            disabled={isAnswered}
                                        />
                                        <span>{option.option_text}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    )}

                    {task.task_type === 'FILE' && !task.answer_files &&(
                        <>
                            <input
                                ref={fileInputRef}
                                type={'file'}
                                name={'file'}
                                className={'hidden'}
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (!file) return;
                                    const dotIndex = file.name.lastIndexOf('.');
                                    // if no dot found in file name take full name, otherwise take everything before a dot
                                    const fileName = dotIndex === -1 ? file.name : file.name.slice(0, dotIndex);
                                    // if no dot found in file name set empty extension otherwise take everything after a dot
                                    const fileExtension = dotIndex === -1 ? '' : file.name.slice(dotIndex);
                                    setFiles({
                                        file_name: fileName,
                                        file_extension: fileExtension
                                    });
                                    setFileExtension(fileExtension);
                                    setFileName(fileName);
                                }}
                            />
                            <AddAnswerFile
                                files={files}
                                setFiles={setFiles}
                                openFilePicker={() =>
                                    fileInputRef.current?.click()
                                }
                                setFileName={setFileName}
                                fileExtension={fileExtension ?? ""}
                                fileName={fileName ?? ""}
                            />
                        </>
                    )}
                    {task.task_type === 'FILE' && files && (
                        <>
                            <input
                                type="hidden"
                                name="file_name"
                                value={files.file_name}
                            />
                            <input
                                type="hidden"
                                name="file_extension"
                                value={files.file_extension ?? ''}
                            />
                        </>
                    )}

                    {!task.answer && (
                        <div className="flex justify-end">
                            <Button type="submit">
                                {t('student.Submit answer')}
                            </Button>
                        </div>
                    )}
                </Form>
                <div className="flex items-center justify-center">
                    {submittedFile && (
                        <Card className="aspect-square max-w-40">
                            <div
                                className={
                                    'flex flex-col items-center justify-center gap-2'
                                }
                            >
                                <File />
                                <h1 className="text-center break-all text-muted-foreground">
                                    {submittedFile.file_name}
                                </h1>
                            </div>
                        </Card>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
