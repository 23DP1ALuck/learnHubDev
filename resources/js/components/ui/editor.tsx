import { useEffect, useState } from 'react';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import { $getRoot, type LexicalEditor } from 'lexical';

import { cn } from '@/lib/utils';

const theme = {
    heading: {
        h1: 'text-2xl font-semibold tracking-tight',
        h2: 'text-xl font-semibold tracking-tight',
        h3: 'text-lg font-semibold tracking-tight',
    },
    link: 'text-primary underline underline-offset-4',
    list: {
        listitem: 'ml-4',
        nested: {
            listitem: 'ml-4',
        },
        ol: 'list-decimal pl-5',
        ul: 'list-disc pl-5',
    },
    paragraph: 'leading-6',
    quote: 'border-l-2 border-border pl-4 italic text-muted-foreground',
    text: {
        bold: 'font-semibold',
        code: 'rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]',
        italic: 'italic',
        strikethrough: 'line-through',
        underline: 'underline',
    },
};

export const EMPTY_EDITOR_STATE = JSON.stringify({
    root: {
        children: [],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
    },
});

type EditorProps = {
    autoFocus?: boolean;
    className?: string;
    disabled?: boolean;
    editorClassName?: string;
    id?: string;
    initialValue?: string | null;
    name?: string;
    onChange?: (value: string, meta: { editor: LexicalEditor; isEmpty: boolean }) => void;
    placeholder?: string;
};

function normalizeInitialValue(value?: string | null): string {
    if (!value) {
        return EMPTY_EDITOR_STATE;
    }

    try {
        JSON.parse(value);
        return value;
    } catch {
        return EMPTY_EDITOR_STATE;
    }
}

function onError(error: Error) {
    console.error(error);
}

function EditableStatePlugin({ disabled = false }: { disabled?: boolean }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        editor.setEditable(!disabled);
    }, [disabled, editor]);

    return null;
}

export default function Editor({
    autoFocus = false,
    className,
    disabled = false,
    editorClassName,
    id,
    initialValue,
    name,
    onChange,
    placeholder = 'Write here...',
}: EditorProps) {
    const normalizedInitialValue = normalizeInitialValue(initialValue);
    const [serializedValue, setSerializedValue] = useState(normalizedInitialValue);
    const placeholderElement = <div className="pointer-events-none absolute top-2 left-3 text-sm text-muted-foreground">{placeholder}</div>;

    useEffect(() => {
        setSerializedValue(normalizedInitialValue);
    }, [normalizedInitialValue]);

    const initialConfig: InitialConfigType = {
        editable: !disabled,
        editorState: normalizedInitialValue,
        namespace: 'learnhub-editor',
        nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
        onError,
        theme,
    };

    return (
        <div className={cn('grid gap-2', className)}>
            {name ? <input name={name} readOnly type="hidden" value={serializedValue} /> : null}

            <LexicalComposer key={normalizedInitialValue} initialConfig={initialConfig}>
                <EditableStatePlugin disabled={disabled} />
                <div
                    className={cn(
                        'relative rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
                        disabled && 'cursor-not-allowed opacity-60',
                    )}
                >
                    <RichTextPlugin
                        ErrorBoundary={LexicalErrorBoundary}
                        contentEditable={
                            <ContentEditable
                                aria-placeholder={placeholder}
                                className={cn('min-h-32 w-full px-3 py-2 text-sm outline-none', editorClassName)}
                                id={id}
                                placeholder={placeholderElement}
                            />
                        }
                        placeholder={placeholderElement}
                    />
                </div>
                <OnChangePlugin
                    onChange={(editorState, editor) => {
                        const nextValue = JSON.stringify(editorState.toJSON());
                        const isEmpty = editorState.read(() => $getRoot().getTextContent().trim().length === 0);

                        setSerializedValue(nextValue);
                        onChange?.(nextValue, { editor, isEmpty });
                    }}
                />
                <HistoryPlugin />
                {autoFocus ? <AutoFocusPlugin /> : null}
            </LexicalComposer>
        </div>
    );
}
