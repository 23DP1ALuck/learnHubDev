import InputError from '@/components/input-error';
import type { ChoiceOption } from '@/components/teacher/edit-task-types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import type { TaskType } from '@/types';
type EditTaskChoiceOptionsProps = {
    correctCheckboxOptionIds: number[];
    correctSingleOptionId: number | null;
    derivedCheckboxAnswers: string[];
    derivedSingleAnswer: string;
    errors: Record<string, string | undefined>;
    onAddOption: () => void;
    onRemoveOption: (optionId: number) => void;
    onSetCorrectSingleOptionId: (optionId: number) => void;
    onToggleCheckboxAnswer: (optionId: number, checked: boolean) => void;
    onUpdateOptionValue: (optionId: number, nextValue: string) => void;
    options: ChoiceOption[];
    taskType: TaskType;
};
export default function EditTaskChoiceOptions({
    correctCheckboxOptionIds,
    correctSingleOptionId,
    derivedCheckboxAnswers,
    derivedSingleAnswer,
    errors,
    onAddOption,
    onRemoveOption,
    onSetCorrectSingleOptionId,
    onToggleCheckboxAnswer,
    onUpdateOptionValue,
    options,
    taskType,
}: EditTaskChoiceOptionsProps) {
    const { t } = useTranslation();
    return (
        <div className="grid gap-3">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <Label>{t('teacher.Answer options')}</Label>
                    <p className="text-sm text-muted-foreground">
                        {taskType === 'CHECKBOX'
                            ? 'Add at least two options and mark all correct ones.'
                            : 'Add at least two options and mark exactly one correct option.'}
                    </p>
                </div>
                <Button type="button" variant="outline" onClick={onAddOption}>
                    {t('teacher.Add option')}
                </Button>
            </div>

            <div className="grid gap-3 rounded-lg border p-3">
                {options.map((option, index) => {
                    const isCheckboxType = taskType === 'CHECKBOX';
                    const isChecked = isCheckboxType
                        ? correctCheckboxOptionIds.includes(option.option_id)
                        : correctSingleOptionId === option.option_id;
                    return (
                        <div
                            key={option.option_id}
                            className="grid gap-2 rounded-md border p-3"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <Label htmlFor={`option-${option.option_id}`}>
                                    Option {index + 1}
                                </Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    disabled={options.length <= 2}
                                    onClick={() =>
                                        onRemoveOption(option.option_id)
                                    }
                                >
                                    Remove
                                </Button>
                            </div>

                            <Input
                                id={`option-${option.option_id}`}
                                name="options[]"
                                onChange={(event) =>
                                    onUpdateOptionValue(
                                        option.option_id,
                                        event.target.value,
                                    )
                                }
                                value={option.value}
                            />

                            <label className="flex items-center gap-3 text-sm">
                                {isCheckboxType ? (
                                    <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={(checked) =>
                                            onToggleCheckboxAnswer(
                                                option.option_id,
                                                checked === true,
                                            )
                                        }
                                    />
                                ) : (
                                    <input
                                        checked={isChecked}
                                        className="size-4"
                                        name="correct_custom_select"
                                        onChange={() =>
                                            onSetCorrectSingleOptionId(
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
                <input
                    type="hidden"
                    name="correct_answers[]"
                    value={derivedSingleAnswer}
                />
            )}

            <InputError message={errors.correct_answers} />
        </div>
    );
}
