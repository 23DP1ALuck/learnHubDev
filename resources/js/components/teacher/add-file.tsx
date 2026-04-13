import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store as storeMaterialFiles } from '@/routes/material-files';
import { Field } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import { useState, type ChangeEvent } from 'react';

export const AddFile = ({ materialContext }: { materialContext: Record<string, number> }) => {
    const [fileName, setFileName] = useState('');

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            setFileName('');
            return;
        }

        setFileName(selectedFile.name);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Add file</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Upload material file</DialogTitle>
                    <DialogDescription>Add a file to this material for your students. Choose a file and save your changes.</DialogDescription>
                </DialogHeader>
                <Form
                    {...storeMaterialFiles.form()}
                    className="grid gap-4"
                    encType="multipart/form-data"
                    resetOnSuccess
                    validateFiles
                >
                    {({ processing, errors }) => (
                        <>
                            <Field className="grid gap-2">
                                <Label htmlFor="file">File</Label>
                                <Input id="file" name="file" type="file" onChange={handleFileChange} />
                                <InputError message={errors.file} />
                            </Field>

                            <Field className="grid gap-2">
                                <Label htmlFor="file_name">Display name</Label>
                                <Input
                                    id="file_name"
                                    name="file_name"
                                    onChange={(event) => setFileName(event.target.value)}
                                    placeholder="Introduction slides"
                                    value={fileName.slice(0, fileName.lastIndexOf('.'))}
                                />
                                <InputError message={errors.file_name} />
                                <div className="flex text-muted-foreground">
                                    <span className="text-muted-foreground font-bold mr-1">File extension:  </span>{fileName.slice(fileName.lastIndexOf('.'))}
                                </div>
                                <input name="file_extension" type="hidden" value={fileName.slice(fileName.lastIndexOf('.'))}/>
                            </Field>

                            <input name="material_id" type="hidden" value={materialContext.material_id} />
                            <input name="module_id" type="hidden" value={materialContext.module_id} />
                            <input name="topic_id" type="hidden" value={materialContext.topic_id} />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button disabled={processing} type="submit">
                                    Save file
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};
