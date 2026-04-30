import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { Field } from '@headlessui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type LoadedFile = {
    file_name: string;
    file_extension: string | null;
};

type AddAnswerFileProps = {
    files: LoadedFile | null;
    setFiles: Dispatch<SetStateAction<LoadedFile | null>>; // useState setter
    openFilePicker: () => void;
    setFileName: Dispatch<SetStateAction<string | null>>; // useState setter
    fileName: string;
    fileExtension: string;
};

export const AddAnswerFile = ({
    files,
    setFiles,
    openFilePicker,
    fileName,
    setFileName,
    fileExtension,
}: AddAnswerFileProps) => {
    const { t } = useTranslation();


    const handleAddFile = () => {
        if (!files) return;

        setFiles({
            file_name: fileName,
            file_extension: fileExtension,
        });
    };
    useEffect(() => {
        console.log(files);
    }, [files]);
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

                <div className="grid gap-4">
                    <Field className="grid gap-2">
                        <Label>{t('learning.File')}</Label>

                        <Button type="button" variant="outline" onClick={openFilePicker}>
                            {files
                                ? `${files.file_name}${files.file_extension}`
                                : t('learning.Choose file')}
                        </Button>
                    </Field>

                    <Field className="grid gap-2">
                        <Label htmlFor="file_name">
                            {t('common.Display name')}
                        </Label>

                        <Input
                            id="file_name"
                            value={fileName}
                            onChange={(event) => setFileName(event.target.value)}
                            placeholder={t('teacher.Introduction slides')}
                        />

                        <div className="flex text-muted-foreground">
                            <span className="mr-1 font-bold">
                                {t('learning.File extension:')}
                            </span>
                            {files?.file_extension}
                        </div>
                    </Field>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                {t('common.Cancel')}
                            </Button>
                        </DialogClose>

                        <DialogClose asChild>
                            <Button
                                type="button"
                                disabled={!files}
                                onClick={handleAddFile}
                            >
                                {t('teacher.Save file')}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};
