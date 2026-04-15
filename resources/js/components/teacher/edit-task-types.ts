import type { TaskOption, TaskType } from '@/types';

export type AssignmentTopic = {
    module_id: number;
    module_name: string | null;
    topic_id: number;
    name: string | null;
};

export type AssignmentSummary = {
    id: number;
    title: string;
    description: string | null;
    grading_policy: string | null;
    due_date: string | null;
    created_at: string | null;
    topics: AssignmentTopic[];
};

export type TaskAnswer = {
    answer_id: number;
    answer: string;
};

export type TaskSummary = {
    task_id: number;
    question_text: string;
    task_type: TaskType;
    max_points: string | number;
    correct_answers: TaskAnswer[];
    created_at: string | null;
    options: TaskOption[];
};

export type ChoiceOption = {
    option_id: number;
    value: string;
};

export function createDefaultOptions(): ChoiceOption[] {
    return [
        { option_id: 1, value: '' },
        { option_id: 2, value: '' },
    ];
}

export function mapTaskOptions(taskOptions: TaskOption[]): ChoiceOption[] {
    if (taskOptions.length === 0) {
        return createDefaultOptions();
    }

    return taskOptions.map((option) => ({
        option_id: option.option_id,
        value: option.option_text,
    }));
}

export function getInitialCorrectCheckboxOptionIds(task: TaskSummary): number[] {
    const correctValues = new Set(task.correct_answers.map((answer) => answer.answer));

    return task.options.filter((option) => correctValues.has(option.option_text)).map((option) => option.option_id);
}

export function getInitialCorrectSingleOptionId(task: TaskSummary): number | null {
    const firstCorrectAnswer = task.correct_answers[0]?.answer;

    if (!firstCorrectAnswer) {
        return null;
    }

    return task.options.find((option) => option.option_text === firstCorrectAnswer)?.option_id ?? null;
}

export function getInitialTextAnswer(task: TaskSummary): string {
    return task.correct_answers[0]?.answer ?? '';
}
