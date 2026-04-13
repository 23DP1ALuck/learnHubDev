import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store as storeAssignments } from '@/routes/assignments';
import { Form } from '@inertiajs/react';
import { useState } from 'react';

const textareaClassName =
    'min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

const nativeSelectClassName =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

type TopicAssignmentCreateProps = {
    moduleId: number;
    topicId: number;
    availableTopics: {
        topic_id: number;
        module_id: number;
        name: string;
    }[];
};

export default function TopicAssignmentCreate({ moduleId, topicId, availableTopics }: TopicAssignmentCreateProps) {
    const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([]);
    const currentTopic = availableTopics.find((topic) => topic.topic_id === topicId);
    const additionalTopics = availableTopics.filter((topic) => topic.topic_id !== topicId);

    const toggleTopic = (nextTopicId: number, checked: boolean) => {
        setSelectedTopicIds((currentIds) =>
            checked ? [...currentIds.filter((id) => id !== nextTopicId), nextTopicId] : currentIds.filter((id) => id !== nextTopicId),
        );
    };

    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Create assignment</CardTitle>
                <CardDescription>
                    The current topic is always linked. You can also attach this assignment to additional topics in the same module.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form
                    {...storeAssignments.form()}
                    className="grid gap-4"
                    onSuccess={() => setSelectedTopicIds([])}
                    resetOnSuccess={['title', 'description', 'grading_policy', 'due_date']}
                >
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="topics[0][module_id]" value={moduleId} />
                            <input type="hidden" name="topics[0][topic_id]" value={topicId} />
                            {selectedTopicIds.map((selectedTopicId, index) => (
                                <div key={selectedTopicId} className="hidden">
                                    <input type="hidden" name={`topics[${index + 1}][module_id]`} value={moduleId} />
                                    <input type="hidden" name={`topics[${index + 1}][topic_id]`} value={selectedTopicId} />
                                </div>
                            ))}
                            <div className="grid gap-2">
                                <Label htmlFor="assignment-title">Assignment title</Label>
                                <Input id="assignment-title" name="title" placeholder="Homework 1" />
                                <InputError message={errors.title} />
                                <InputError message={errors.topics} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="assignment-description">Description</Label>
                                <textarea
                                    id="assignment-description"
                                    name="description"
                                    className={textareaClassName}
                                    placeholder="Explain what students need to submit or answer."
                                />
                                <InputError message={errors.description} />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="grading_policy">Grading policy</Label>
                                    <select id="grading_policy" name="grading_policy" className={nativeSelectClassName} defaultValue="FORMATIVE">
                                        <option value="FORMATIVE">Formative</option>
                                        <option value="SUMMATIVE">Summative</option>
                                    </select>
                                    <InputError message={errors.grading_policy} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="due_date">Due date</Label>
                                    <Input id="due_date" name="due_date" type="date" />
                                    <InputError message={errors.due_date} />
                                </div>
                            </div>
                            <div className="grid gap-3">
                                <div className="grid gap-1">
                                    <Label>Linked topics</Label>
                                    <p className="text-sm text-muted-foreground">This topic is required. Add more topics if the assignment covers them too.</p>
                                </div>
                                <div className="rounded-md border px-3 py-2 text-sm">
                                    <span className="font-medium">Current topic</span>: {currentTopic?.name ?? `Topic ${topicId}`}
                                </div>
                                {additionalTopics.length > 0 ? (
                                    <div className="grid gap-2 rounded-md border p-3">
                                        {additionalTopics.map((topic) => {
                                            const isChecked = selectedTopicIds.includes(topic.topic_id);

                                            return (
                                                <label key={topic.topic_id} className="flex items-center gap-3 text-sm">
                                                    <Checkbox checked={isChecked} onCheckedChange={(checked) => toggleTopic(topic.topic_id, checked === true)} />
                                                    <span>{topic.name}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Add assignment
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}
