import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store as storeTasks } from '@/routes/tasks';
import { Form } from '@inertiajs/react';
import { useRef, useState } from 'react';

const textareaClassName =
    'min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

const nativeSelectClassName =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

type AssignmentTaskCreateProps = {
    assignmentId: number;
};

type TaskType = 'CHECKBOX' | 'TEXT' | 'FILE' | 'TRUE_FALSE' | 'NUMBER' | 'CUSTOM_SELECT';

type ChoiceOption = {
    id: number;
    value: string;
};

const createDefaultOptions = (): ChoiceOption[] => [
    { id: 1, value: '' },
    { id: 2, value: '' },
];

export default function AssignmentTaskCreate({ assignmentId }: AssignmentTaskCreateProps) {
    const [taskType, setTaskType] = useState<TaskType>('CHECKBOX');
    const [options, setOptions] = useState<ChoiceOption[]>(createDefaultOptions);

    const [correctCheckboxOptionIds, setCorrectCheckboxOptionIds] = useState<number[]>([]);
    const [correctSingleOptionId, setCorrectSingleOptionId] = useState<number | null>(null);

    const nextOptionId = useRef(3);

    const resetTaskBuilder = () => {
        setTaskType('CHECKBOX');
        setOptions(createDefaultOptions());
        setCorrectCheckboxOptionIds([]);
        setCorrectSingleOptionId(null);
        nextOptionId.current = 3;
    };

    const updateOptionValue = (optionId: number, nextValue: string) => {
        setOptions((currentOptions) =>
            currentOptions.map((option) =>
                option.id === optionId
                    ? {
                          ...option,
                          value: nextValue, // change selected option value to nextValue
                      }
                    : option,
            ),
        );
    };

    const addOption = () => {
        const nextId = nextOptionId.current;

        setOptions((currentOptions) => [
            ...currentOptions,
            {
                id: nextId,
                value: '',
            },
        ]);

        nextOptionId.current += 1;
    };

    const removeOption = (optionId: number) => {
        setOptions((currentOptions) => currentOptions.filter((option) => option.id !== optionId));
        setCorrectCheckboxOptionIds((currentIds) => currentIds.filter((id) => id !== optionId));

        if (correctSingleOptionId === optionId) {
            setCorrectSingleOptionId(null);
        }
    };

    const toggleCheckboxAnswer = (optionId: number, checked: boolean) => {
        setCorrectCheckboxOptionIds((currentIds) =>
            checked ? [...currentIds.filter((id) => id !== optionId), optionId] : currentIds.filter((id) => id !== optionId),
        );
    };

    const handleTaskTypeChange = (nextTaskType: TaskType) => {
        setTaskType(nextTaskType);

        if (nextTaskType === 'CHECKBOX' || nextTaskType === 'CUSTOM_SELECT') {
            if (options.length < 2) {
                setOptions(createDefaultOptions());
                setCorrectCheckboxOptionIds([]);
                setCorrectSingleOptionId(null);
                nextOptionId.current = 3;
            }

            return;
        }

        setCorrectCheckboxOptionIds([]);
        setCorrectSingleOptionId(null);
    };

    const shouldShowChoiceOptions = taskType === 'CHECKBOX' || taskType === 'CUSTOM_SELECT';
    const derivedCheckboxAnswers = options.filter((option) => correctCheckboxOptionIds.includes(option.id)).map((option) => option.value);
    const derivedSingleAnswer = options.find((option) => option.id === correctSingleOptionId)?.value ?? '';

    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Create task</CardTitle>
                <CardDescription>
                    Task fields now adapt to the selected type so you only fill in what that question actually needs.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form
                    {...storeTasks.form()}
                    className="grid gap-4"
                    onSuccess={resetTaskBuilder}
                    resetOnSuccess={['question_text', 'max_points', 'correct_answers', 'options']}
                >
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="assignment_id" value={assignmentId} />
                            <div className="grid gap-2">
                                <Label htmlFor="question_text">Task question</Label>
                                <textarea
                                    id="question_text"
                                    name="question_text"
                                    className={textareaClassName}
                                    placeholder="Write the question, prompt, or submission instructions."
                                />
                                <InputError message={errors.question_text} />
                                <InputError message={errors.assignment_id} />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="task_type">Task type</Label>
                                    <select
                                        id="task_type"
                                        name="task_type"
                                        className={nativeSelectClassName}
                                        onChange={(event) => handleTaskTypeChange(event.target.value as TaskType)}
                                        value={taskType}
                                    >
                                        <option value="CHECKBOX">Checkbox</option>
                                        <option value="TEXT">Text answer</option>
                                        <option value="FILE">File upload</option>
                                        <option value="TRUE_FALSE">True / False</option>
                                        <option value="NUMBER">Number</option>
                                        <option value="CUSTOM_SELECT">Custom select</option>
                                    </select>
                                    <InputError message={errors.task_type} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="max_points">Max points</Label>
                                    <Input id="max_points" name="max_points" type="number" min="0" step="0.5" defaultValue="10" />
                                    <InputError message={errors.max_points} />
                                </div>
                            </div>

                            {shouldShowChoiceOptions && (
                                <div className="grid gap-3">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <Label>Answer options</Label>
                                            <p className="text-sm text-muted-foreground">
                                                {taskType === 'CHECKBOX'
                                                    ? 'Add at least two options and mark all correct ones.'
                                                    : 'Add at least two options and mark exactly one correct option.'}
                                            </p>
                                        </div>
                                        <Button type="button" variant="outline" onClick={addOption}>
                                            Add option
                                        </Button>
                                    </div>
                                    <div className="grid gap-3 rounded-lg border p-3">
                                        {options.map((option, index) => {
                                            const isCheckboxType = taskType === 'CHECKBOX';
                                            const isChecked = isCheckboxType
                                                ? correctCheckboxOptionIds.includes(option.id)
                                                : correctSingleOptionId === option.id;

                                            return (
                                                <div key={option.id} className="grid gap-2 rounded-md border p-3">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <Label htmlFor={`option-${option.id}`}>Option {index + 1}</Label>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            disabled={options.length <= 2}
                                                            onClick={() => removeOption(option.id)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                    <Input
                                                        id={`option-${option.id}`}
                                                        name="options[]"
                                                        onChange={(event) => updateOptionValue(option.id, event.target.value)}
                                                        placeholder={`Option ${index + 1}`}
                                                        value={option.value}
                                                    />
                                                    <label className="flex items-center gap-3 text-sm">
                                                        {isCheckboxType ? (
                                                            <Checkbox checked={isChecked} onCheckedChange={(checked) => toggleCheckboxAnswer(option.id, checked === true)} />
                                                        ) : (
                                                            <input
                                                                checked={isChecked}
                                                                className="size-4"
                                                                name="correct_custom_select"
                                                                onChange={() => setCorrectSingleOptionId(option.id)}
                                                                type="radio"
                                                            />
                                                        )}
                                                        <span>{isCheckboxType ? 'Correct answer' : 'Correct option'}</span>
                                                    </label>
                                                    <InputError message={errors[`options.${index}`]} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <InputError message={errors.options} />
                                    {derivedCheckboxAnswers.map((answer, index) => (
                                        <input key={`${answer}-${index}`} type="hidden" name="correct_answers[]" value={answer} />
                                    ))}
                                    {taskType === 'CUSTOM_SELECT' && derivedSingleAnswer !== '' && (
                                        <input type="hidden" name="correct_answers[]" value={derivedSingleAnswer} />
                                    )}
                                    <InputError message={errors.correct_answers} />
                                </div>
                            )}

                            {taskType === 'TEXT' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="text-correct-answer">Expected answer</Label>
                                    <textarea
                                        id="text-correct-answer"
                                        name="correct_answers[]"
                                        className={textareaClassName}
                                        placeholder="Write the expected full text answer."
                                    />
                                    <InputError message={errors.correct_answers} />
                                </div>
                            )}

                            {taskType === 'NUMBER' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="number-correct-answer">Correct number</Label>
                                    <Input id="number-correct-answer" name="correct_answers[]" type="number" step="any" placeholder="42" />
                                    <InputError message={errors.correct_answers} />
                                </div>
                            )}

                            {taskType === 'TRUE_FALSE' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="true-false-answer">Correct answer</Label>
                                    <select id="true-false-answer" name="correct_answers[]" className={nativeSelectClassName} defaultValue="TRUE">
                                        <option value="TRUE">True</option>
                                        <option value="FALSE">False</option>
                                    </select>
                                    <InputError message={errors.correct_answers} />
                                </div>
                            )}

                            {taskType === 'FILE' && (
                                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                    File tasks are reviewed manually, so correct answers are disabled for this type.
                                </div>
                            )}

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Create task
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}
