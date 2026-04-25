import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { store as storeTasks } from '@/routes/tasks';
import { TaskType } from '@/types';
import { Form } from '@inertiajs/react';
import { useRef, useState } from 'react';
const textareaClassName =
    'min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';
const nativeSelectClassName =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';
type AssignmentTaskCreateProps = {
    assignmentId: number;
};
type ChoiceOption = {
    option_id: number;
    value: string;
};
const createDefaultOptions = (): ChoiceOption[] => [
    {
        option_id: 1,
        value: '',
    },
    {
        option_id: 2,
        value: '',
    },
];
export default function AssignmentTaskCreate({
    assignmentId,
}: AssignmentTaskCreateProps) {
    const { t } = useTranslation();
    const [taskType, setTaskType] = useState<TaskType>('CHECKBOX');
    const [options, setOptions] =
        useState<ChoiceOption[]>(createDefaultOptions);
    const [correctCheckboxOptionIds, setCorrectCheckboxOptionIds] = useState<
        number[]
    >([]);
    const [correctSingleOptionId, setCorrectSingleOptionId] = useState<
        number | null
    >(null);
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
                option.option_id === optionId
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
                option_id: nextId,
                value: '',
            },
        ]);
        nextOptionId.current += 1;
    };
    const removeOption = (optionId: number) => {
        setOptions((currentOptions) =>
            currentOptions.filter((option) => option.option_id !== optionId),
        );
        setCorrectCheckboxOptionIds((currentIds) =>
            currentIds.filter((id) => id !== optionId),
        );
        if (correctSingleOptionId === optionId) {
            setCorrectSingleOptionId(null);
        }
    };
    const toggleCheckboxAnswer = (optionId: number, checked: boolean) => {
        setCorrectCheckboxOptionIds((currentIds) =>
            checked
                ? [...currentIds.filter((id) => id !== optionId), optionId]
                : currentIds.filter((id) => id !== optionId),
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
    const shouldShowChoiceOptions =
        taskType === 'CHECKBOX' || taskType === 'CUSTOM_SELECT';
    const derivedCheckboxAnswers = options
        .filter((option) => correctCheckboxOptionIds.includes(option.option_id))
        .map((option) => option.value);
    const derivedSingleAnswer =
        options.find((option) => option.option_id === correctSingleOptionId)
            ?.value ?? '';
    return (
        <Card className="border-sidebar-border/70">
            <CardHeader>
                <CardTitle>{t('teacher.Create task')}</CardTitle>
                <CardDescription>
                    {t(
                        'teacher.Task fields now adapt to the selected type so you only fill in what that question actually needs.',
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form
                    {...storeTasks.form()}
                    className="grid gap-4"
                    onSuccess={resetTaskBuilder}
                    resetOnSuccess={[
                        'question_text',
                        'max_points',
                        'correct_answers',
                        'options',
                    ]}
                >
                    {({ processing, errors }) => (
                        <>
                            <input
                                type="hidden"
                                name="assignment_id"
                                value={assignmentId}
                            />
                            <div className="grid gap-2">
                                <Label htmlFor="question_text">
                                    {t('teacher.Task question')}
                                </Label>
                                <textarea
                                    id="question_text"
                                    name="question_text"
                                    className={textareaClassName}
                                    placeholder={t(
                                        'teacher.Write the question, prompt, or submission instructions.',
                                    )}
                                />
                                <InputError message={errors.question_text} />
                                <InputError message={errors.assignment_id} />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="task_type">
                                        {t('teacher.Task type')}
                                    </Label>
                                    <select
                                        id="task_type"
                                        name="task_type"
                                        className={nativeSelectClassName}
                                        onChange={(event) =>
                                            handleTaskTypeChange(
                                                event.target.value as TaskType,
                                            )
                                        }
                                        value={taskType}
                                    >
                                        <option value="CHECKBOX">
                                            {t('common.Checkbox')}
                                        </option>
                                        <option value="TEXT">
                                            {t('learning.Text answer')}
                                        </option>
                                        <option value="FILE">
                                            {t('learning.File upload')}
                                        </option>
                                        <option value="TRUE_FALSE">
                                            {t('common.True / False')}
                                        </option>
                                        <option value="NUMBER">
                                            {t('common.Number')}
                                        </option>
                                        <option value="CUSTOM_SELECT">
                                            {t('common.Custom select')}
                                        </option>
                                    </select>
                                    <InputError message={errors.task_type} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="max_points">
                                        {t('learning.Max points')}
                                    </Label>
                                    <Input
                                        id="max_points"
                                        name="max_points"
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        defaultValue="10"
                                    />
                                    <InputError message={errors.max_points} />
                                </div>
                            </div>

                            {shouldShowChoiceOptions && (
                                <div className="grid gap-3">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <Label>
                                                {t('teacher.Answer options')}
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                {taskType === 'CHECKBOX'
                                                    ? 'Add at least two options and mark all correct ones.'
                                                    : 'Add at least two options and mark exactly one correct option.'}
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addOption}
                                        >
                                            {t('teacher.Add option')}
                                        </Button>
                                    </div>
                                    <div className="grid gap-3 rounded-lg border p-3">
                                        {options.map((option, index) => {
                                            const isCheckboxType =
                                                taskType === 'CHECKBOX';
                                            const isChecked = isCheckboxType
                                                ? correctCheckboxOptionIds.includes(
                                                      option.option_id,
                                                  )
                                                : correctSingleOptionId ===
                                                  option.option_id;
                                            return (
                                                <div
                                                    key={option.option_id}
                                                    className="grid gap-2 rounded-md border p-3"
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <Label
                                                            htmlFor={`option-${option.option_id}`}
                                                        >
                                                            Option {index + 1}
                                                        </Label>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            disabled={
                                                                options.length <=
                                                                2
                                                            }
                                                            onClick={() =>
                                                                removeOption(
                                                                    option.option_id,
                                                                )
                                                            }
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                    <Input
                                                        id={`option-${option.option_id}`}
                                                        name="options[]"
                                                        onChange={(event) =>
                                                            updateOptionValue(
                                                                option.option_id,
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        placeholder={`Option ${index + 1}`}
                                                        value={option.value}
                                                    />
                                                    <label className="flex items-center gap-3 text-sm">
                                                        {isCheckboxType ? (
                                                            <Checkbox
                                                                checked={
                                                                    isChecked
                                                                }
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    toggleCheckboxAnswer(
                                                                        option.option_id,
                                                                        checked ===
                                                                            true,
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <input
                                                                checked={
                                                                    isChecked
                                                                }
                                                                className="size-4"
                                                                name="correct_custom_select"
                                                                onChange={() =>
                                                                    setCorrectSingleOptionId(
                                                                        option.option_id,
                                                                    )
                                                                }
                                                                type="radio"
                                                            />
                                                        )}
                                                        <span>
                                                            {isCheckboxType
                                                                ? 'Correct answer'
                                                                : 'Correct option'}
                                                        </span>
                                                    </label>
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `options.${index}`
                                                            ]
                                                        }
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <InputError message={errors.options} />
                                    {derivedCheckboxAnswers.map(
                                        (answer, index) => (
                                            <input
                                                key={`${answer}-${index}`}
                                                type="hidden"
                                                name="correct_answers[]"
                                                value={answer}
                                            />
                                        ),
                                    )}
                                    {taskType === 'CUSTOM_SELECT' &&
                                        derivedSingleAnswer !== '' && (
                                            <input
                                                type="hidden"
                                                name="correct_answers[]"
                                                value={derivedSingleAnswer}
                                            />
                                        )}
                                    <InputError
                                        message={errors.correct_answers}
                                    />
                                </div>
                            )}

                            {taskType === 'TEXT' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="text-correct-answer">
                                        {t('teacher.Expected answer')}
                                    </Label>
                                    <textarea
                                        id="text-correct-answer"
                                        name="correct_answers[]"
                                        className={textareaClassName}
                                        placeholder={t(
                                            'teacher.Write the expected full text answer.',
                                        )}
                                    />
                                    <InputError
                                        message={errors.correct_answers}
                                    />
                                </div>
                            )}

                            {taskType === 'NUMBER' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="number-correct-answer">
                                        {t('teacher.Correct number')}
                                    </Label>
                                    <Input
                                        id="number-correct-answer"
                                        name="correct_answers[]"
                                        type="number"
                                        step="any"
                                        placeholder="42"
                                    />
                                    <InputError
                                        message={errors.correct_answers}
                                    />
                                </div>
                            )}

                            {taskType === 'TRUE_FALSE' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="true-false-answer">
                                        {t('teacher.Correct answer')}
                                    </Label>
                                    <select
                                        id="true-false-answer"
                                        name="correct_answers[]"
                                        className={nativeSelectClassName}
                                        defaultValue="TRUE"
                                    >
                                        <option value="TRUE">
                                            {t('common.True')}
                                        </option>
                                        <option value="FALSE">
                                            {t('common.False')}
                                        </option>
                                    </select>
                                    <InputError
                                        message={errors.correct_answers}
                                    />
                                </div>
                            )}

                            {taskType === 'FILE' && (
                                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                    {t(
                                        'teacher.File tasks are reviewed manually, so correct answers are disabled for this type.',
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {t('teacher.Create task')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}
