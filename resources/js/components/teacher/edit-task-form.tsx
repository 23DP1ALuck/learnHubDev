import { type AssignmentSummary, type TaskSummary } from '@/components/teacher/edit-task-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { update } from '@/routes/tasks';
import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { TaskType } from '@/types';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TaskOption } from '@/components/teacher/task-preview-types';
import { Checkbox } from '@/components/ui/checkbox';

const textareaClassName =
    'min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

const nativeSelectClassName =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

type EditTaskFormProps = {
    assignment: AssignmentSummary;
    task: TaskSummary;
};

const createDefaultOptions = (): TaskOption[] => [
    { option_id: 1, option_text: '' },
    { option_id: 2, option_text: '' },
];

export default function EditTaskForm({ assignment, task }: EditTaskFormProps) {
    const [taskType, setTaskType] = useState<TaskType>(task.task_type);
    const [options, setOptions] = useState<TaskOption[]>(
        task.options.length > 0 ? task.options : createDefaultOptions(),
    );

    const [correctCheckboxOptionIds, setCorrectCheckboxOptionIds] = useState<number[]>(
        task.task_type === 'CHECKBOX' ? task.correct_answers.map((answer) => answer.answer_id) : [],
    );

    const [correctSingleOptionId, setCorrectSingleOptionId] = useState<number | null>(
        task.task_type === 'CUSTOM_SELECT' && task.correct_answers.length > 0
            ? task.correct_answers[0].answer_id
            : null,
    );

    const nextOptionId = useRef(
        options.length > 0
            ? Math.max(...options.map((option) => option.option_id)) + 1
            : 3,
    );

    const resetTaskBuilder = () => {
        setTaskType(task.task_type);
        setOptions(task.options.length > 0 ? task.options : createDefaultOptions());
        setCorrectCheckboxOptionIds(
            task.task_type === 'CHECKBOX' ? task.correct_answers.map((answer) => answer.answer_id) : [],
        );
        setCorrectSingleOptionId(
            task.task_type === 'CUSTOM_SELECT' && task.correct_answers.length > 0
                ? task.correct_answers[0].answer_id
                : null,
        );
        nextOptionId.current =
            task.options.length > 0
                ? Math.max(...task.options.map((option) => option.option_id)) + 1
                : 3;
    };

    const addOption = () => {
        setOptions((currentOptions) => [
            ...currentOptions,
            {
                option_id: nextOptionId.current,
                option_text: '',
            },
        ]);
        nextOptionId.current += 1;
    };

    const updateOptionValue = (optionId: number, nextValue: string) => {
        setOptions((currentOptions) =>
            currentOptions.map((option) =>
                option.option_id === optionId
                    ? {
                        ...option,
                        option_text: nextValue,
                    }
                    : option,
            ),
        );
    };

    const toggleCheckboxAnswer = (optionId: number, checked: boolean) => {
        setCorrectCheckboxOptionIds((currentIds) =>
            checked
                ? [...currentIds.filter((id) => id !== optionId), optionId]
                : currentIds.filter((id) => id !== optionId),
        );
    };

    const removeOption = (optionId: number) => {
        setOptions((currentOptions) => currentOptions.filter((option) => option.option_id !== optionId));
        setCorrectCheckboxOptionIds((currentIds) => currentIds.filter((id) => id !== optionId));

        if (correctSingleOptionId === optionId) {
            setCorrectSingleOptionId(null);
        }
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

    const derivedCheckboxAnswers = options
        .filter((option) => correctCheckboxOptionIds.includes(option.option_id))
        .map((option) => option.option_text);

    const derivedSingleAnswer =
        options.find((option) => option.option_id === correctSingleOptionId)?.option_text ?? '';

    const textAnswerDefault =
        task.task_type === 'TEXT' && task.correct_answers.length > 0
            ? task.correct_answers[0].answer
            : '';

    const numberAnswerDefault =
        task.task_type === 'NUMBER' && task.correct_answers.length > 0
            ? task.correct_answers[0].answer
            : '';

    const trueFalseDefault =
        task.task_type === 'TRUE_FALSE' && task.correct_answers.length > 0
            ? task.correct_answers[0].answer
            : 'TRUE';

    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>Edit task</CardTitle>
                <CardDescription>
                    Modify information below to update the task.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Card className="border-sidebar-border/70">
                    <CardContent className="pt-6">
                        <Form
                            {...update.form([assignment.id, task.task_id])}
                            className="grid gap-4"
                            onSuccess={resetTaskBuilder}
                        >
                            {({ processing, errors }) => (
                                <>
                                    <input type="hidden" name="assignment_id" value={assignment.id} />
                                    <input type="hidden" name="task_id" value={task.task_id} />

                                    <div className="grid gap-2">
                                        <label htmlFor="question_text" className="block text-sm font-medium leading-none">
                                            Question text
                                        </label>
                                        <textarea
                                            id="question_text"
                                            name="question_text"
                                            className={textareaClassName}
                                            defaultValue={task.question_text}
                                        />
                                        <InputError message={errors.question_text} />
                                        <InputError message={errors.assignment_id} />
                                        <InputError message={errors.task_id} />
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
                                            <Input
                                                id="max_points"
                                                name="max_points"
                                                type="number"
                                                min="0"
                                                step="0.5"
                                                defaultValue={task.max_points}
                                            />
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
                                                        ? correctCheckboxOptionIds.includes(option.option_id)
                                                        : correctSingleOptionId === option.option_id;

                                                    return (
                                                        <div key={option.option_id} className="grid gap-2 rounded-md border p-3">
                                                            <div className="flex items-center justify-between gap-4">
                                                                <Label htmlFor={`option-${option.option_id}`}>
                                                                    Option {index + 1}
                                                                </Label>

                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    disabled={options.length <= 2}
                                                                    onClick={() => removeOption(option.option_id)}
                                                                >
                                                                    Remove
                                                                </Button>
                                                            </div>

                                                            <Input
                                                                id={`option-${option.option_id}`}
                                                                name="options[]"
                                                                onChange={(event) =>
                                                                    updateOptionValue(option.option_id, event.target.value)
                                                                }
                                                                placeholder={`Option ${index + 1}`}
                                                                value={option.option_text}
                                                            />

                                                            <label className="flex items-center gap-3 text-sm">
                                                                {isCheckboxType ? (
                                                                    <Checkbox
                                                                        checked={isChecked}
                                                                        onCheckedChange={(checked) =>
                                                                            toggleCheckboxAnswer(option.option_id, checked === true)
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <input
                                                                        checked={isChecked}
                                                                        className="size-4"
                                                                        name="correct_custom_select"
                                                                        onChange={() => setCorrectSingleOptionId(option.option_id)}
                                                                        type="radio"
                                                                    />
                                                                )}

                                                                <span>
                                                                    {isCheckboxType ? 'Correct answer' : 'Correct option'}
                                                                </span>
                                                            </label>

                                                            <InputError message={errors[`options.${index}`]} />
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <InputError message={errors.options} />

                                            {derivedCheckboxAnswers.map((answer, index) => (
                                                <input
                                                    key={`${answer}-${index}`}
                                                    type="hidden"
                                                    name="correct_answers[]"
                                                    value={answer}
                                                />
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
                                                defaultValue={textAnswerDefault}
                                            />
                                            <InputError message={errors.correct_answers} />
                                        </div>
                                    )}

                                    {taskType === 'NUMBER' && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="number-correct-answer">Correct number</Label>
                                            <Input
                                                id="number-correct-answer"
                                                name="correct_answers[]"
                                                type="number"
                                                step="any"
                                                placeholder="42"
                                                defaultValue={numberAnswerDefault}
                                            />
                                            <InputError message={errors.correct_answers} />
                                        </div>
                                    )}

                                    {taskType === 'TRUE_FALSE' && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="true-false-answer">Correct answer</Label>
                                            <select
                                                id="true-false-answer"
                                                name="correct_answers[]"
                                                className={nativeSelectClassName}
                                                defaultValue={trueFalseDefault}
                                            >
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
                                            Save changes
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}
