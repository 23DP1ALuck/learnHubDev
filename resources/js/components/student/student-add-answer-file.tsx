import { useTranslation } from '@/hooks/use-translation';
import {ChangeEvent, Dispatch, SetStateAction, useState} from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Field } from '@headlessui/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoadedFile = {
    file_name: string;
    file_extension: string;
};

type AddAnswerFileProps = {
    files: LoadedFile | null;
    setFiles: Dispatch<SetStateAction<LoadedFile|null>>; // useState setter
    openFilePicker: () => void;
};

export const AddAnswerFile = ({ files, setFiles, openFilePicker }: AddAnswerFileProps) => {
    const { t } = useTranslation();

    const [fileName, setFileName] = useState(files?.file_name ?? '');
    const fileExtension = files?.file_extension ?? '';

    const handleAddFile = () => {
        if (!files) return;

        setFiles({
            file_name: fileName,
            file_extension: fileExtension,
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">{t('learning.Add file')}</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{t('learning.Upload material file')}</DialogTitle>
                    <DialogDescription>
                        {t('learning.Add a file to this material for your students. Choose a file and save your changes.')}
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
                            {fileExtension}
                        </div>
                    </Field>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                {t('common.Cancel')}
                            </Button>
                        </DialogClose>

                        <DialogClose asChild>
                            <Button type="button" disabled={!files} onClick={handleAddFile}>
                                {t('teacher.Save file')}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};
