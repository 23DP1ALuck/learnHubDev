import {useTranslation} from "@/hooks/use-translation";
import {ChangeEvent, useState} from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter, DialogClose
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Form} from "@inertiajs/react"
import {store} from "@/routes/student/task-answer-files";
import {route} from "ziggy-js";
import {Field} from "@headlessui/react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from "@/components/input-error";


type AddAnswerFileProps = {
    assignmentId: number;
    taskId: number;
}
export const AddAnswerFile = ({assignmentId, taskId}: AddAnswerFileProps) => {
        const { t } = useTranslation();
        const [fileName, setFileName] = useState('');
        const [fileExtension, setFileExtension] = useState('');
        const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
            const selectedFile = event.target.files?.[0];
            if (!selectedFile) {
                setFileName('');
                return;
            }
            setFileName(selectedFile.name);
            setFileExtension(selectedFile.name.slice(selectedFile.name.lastIndexOf('.')));
        };
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">{t('learning.Add file')}</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>
                            {t('learning.Upload material file')}
                        </DialogTitle>
                        <DialogDescription>
                            {t(
                                'learning.Add a file to this material for your students. Choose a file and save your changes.',
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <Form
                        action={route('student.task-answer-files.store', [assignmentId, taskId])}
                        className="grid gap-4"
                        encType="multipart/form-data"
                        resetOnSuccess
                        validateFiles
                    >
                        {({ processing, errors }) => (
                            <>
                                <Field className="grid gap-2">
                                    <Label htmlFor="file">
                                        {t('learning.File')}
                                    </Label>
                                    <Input
                                        id="file"
                                        name="file"
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    <InputError message={errors.file} />
                                </Field>

                                <Field className="grid gap-2">
                                    <Label htmlFor="file_name">
                                        {t('common.Display name')}
                                    </Label>
                                    <Input
                                        id="file_name"
                                        name="file_name"
                                        onChange={(event) =>
                                            setFileName(event.target.value)
                                        }
                                        placeholder={t(
                                            'teacher.Introduction slides',
                                        )}
                                        value={fileName.slice(0, fileName.lastIndexOf('.'))}
                                    />
                                    <InputError message={errors.file_name} />
                                    <div className="flex text-muted-foreground">
                                    <span className="mr-1 font-bold text-muted-foreground">
                                        {t('learning.File extension:')}
                                    </span>
                                        {fileExtension}
                                    </div>
                                    <input
                                        name="file_extension"
                                        type="hidden"
                                        value={fileExtension}
                                    />
                                </Field>


                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline" type="button">
                                            {t('common.Cancel')}
                                        </Button>
                                    </DialogClose>
                                    <Button disabled={processing} type="submit">
                                        {t('teacher.Save file')}
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        );

}
