"use client";

import { X } from "lucide-react";
import { useId, useState } from "react";

import ActionButton from "@/components/ui/actionButton";
import { Checkbox } from "@/components/ui/checkbox";
import Disclosure from "@/components/ui/disclosure";
import { FormField, Input } from "@/components/ui/formField";
import IconButton from "@/components/ui/iconButton";
import ResponsiveDialog from "@/components/ui/responsiveDialog";
import { Select } from "@/components/ui/select";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import {
    POLL_MAX_OPTIONS,
    POLL_OPTION_MAX_LENGTH,
    POLL_QUESTION_MAX_LENGTH,
    POLL_RESULT_VISIBILITIES,
    validatePollInput,
    type PollInput,
    type PollValidationError,
} from "@/features/polls/schemas/pollSchema";
import type { Locale } from "@/lib/i18n/routing";

export interface PollBuilderLabels {
    title: string;
    question: string;
    options: string;
    addOption: string;
    pasteOptions: string;
    pasteHelp: string;
    optionHelp: string;
    removeOption: string;
    single: string;
    multiple: string;
    choiceWay: string;
    maxChoices: string;
    voters: string;
    votersHidden: string;
    votersShown: string;
    advanced: string;
    closesAt: string;
    closesHelp: string;
    results: string;
    resultOptions: Record<(typeof POLL_RESULT_VISIBILITIES)[number], string>;
    allowAddOptions: string;
    cancel: string;
    submit: string;
    locked: string;
    errors: Record<PollValidationError, string>;
    localeLabels?: Record<Locale, string>;
}

/**
 * 투표 만들기 창 (2026-09-23 W1) — 고르는 방법 → 질문 → 선택지 → 익명 → 「자세히」(마감 · 결과 공개 · 선택지 추가).
 * 미리보기는 두지 않는다(Discourse · Strawpoll 둘 다 없음). 엔터 · 「선택지 추가」 · 여러 줄 붙여넣기 세 경로를 모두 준다.
 * 표가 들어온 뒤(`locked`)에는 마감 시각과 선택지 추가만 열어 둔다.
 */
export default function PollBuilderDialog({
    open,
    onOpenChange,
    value,
    onSave,
    onCancel,
    labels,
    locales,
    locked = false,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    value: PollInput;
    onSave: (poll: PollInput) => void;
    /** 저장하지 않고 닫았을 때 — 만들다 만 빈 투표를 여는 쪽이 치운다 */
    onCancel?: () => void;
    labels: PollBuilderLabels;
    /** 공지는 ko · ja · en 세 벌, 이벤트는 쓴 언어 한 벌 */
    locales: Locale[];
    locked?: boolean;
}) {
    const id = useId();
    const [draft, setDraft] = useState(value);
    const [locale, setLocale] = useState<Locale>(locales[0]);
    const [error, setError] = useState<PollValidationError | null>(null);
    const [paste, setPaste] = useState(false);
    const [pasted, setPasted] = useState("");
    // 엔터로 만든 칸으로 커서를 옮긴다 — 안 옮기면 앞 칸에 계속 써진다(2026-09-23 확인)
    const [focusIndex, setFocusIndex] = useState<number | null>(null);

    const setOption = (index: number, text: string) =>
        setDraft((prev) => ({
            ...prev,
            options: prev.options.map((option, item) =>
                item === index
                    ? { ...option, text: { ...option.text, [locale]: text } }
                    : option
            ),
        }));
    const addOption = (index = draft.options.length) => {
        setDraft((prev) => ({
            ...prev,
            options: [
                ...prev.options.slice(0, index),
                { text: {} },
                ...prev.options.slice(index),
            ],
        }));
        setFocusIndex(index);
    };
    const removeOption = (index: number) =>
        setDraft((prev) => ({
            ...prev,
            options: prev.options.filter((_, item) => item !== index),
        }));

    function applyPaste() {
        const lines = pasted
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .slice(0, POLL_MAX_OPTIONS);
        if (lines.length === 0) return;
        setDraft((prev) => ({
            ...prev,
            options: lines.map((text) => ({ text: { [locale]: text } })),
        }));
        setPaste(false);
        setPasted("");
    }

    function save() {
        const invalid = validatePollInput(draft);
        if (invalid) {
            setError(invalid);
            return;
        }
        setError(null);
        onSave(draft);
        onOpenChange(false);
    }

    const close = () => {
        onCancel?.();
        onOpenChange(false);
    };

    const footer = (
        <>
            <ActionButton variant="secondary" onClick={close}>
                {labels.cancel}
            </ActionButton>
            <ActionButton onClick={save}>{labels.submit}</ActionButton>
        </>
    );

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={(next) => (next ? onOpenChange(true) : close())}
            title={labels.title}
            footer={footer}
        >
            <div className="nl-poll-builder">
                {locked ? (
                    <p className="nl-body-secondary nl-muted" role="status">
                        {labels.locked}
                    </p>
                ) : null}
                {locales.length > 1 && labels.localeLabels ? (
                    <div
                        role="tablist"
                        aria-label={labels.question}
                        className="nl-tabs"
                    >
                        {locales.map((item) => (
                            <button
                                key={item}
                                type="button"
                                role="tab"
                                aria-selected={locale === item}
                                data-state={
                                    locale === item ? "active" : "inactive"
                                }
                                className="nl-tabs__item nl-control"
                                onClick={() => setLocale(item)}
                            >
                                {labels.localeLabels?.[item]}
                            </button>
                        ))}
                    </div>
                ) : null}

                <FormField id={`${id}-way`} label={labels.choiceWay}>
                    <SegmentedControl
                        label={labels.choiceWay}
                        value={draft.multiple ? "multiple" : "single"}
                        onValueChange={(next) => {
                            // 표가 들어온 뒤에는 고르는 방법을 바꾸지 못한다
                            if (locked) return;
                            setDraft((prev) => ({
                                ...prev,
                                multiple: next === "multiple",
                                maxChoices:
                                    next === "multiple"
                                        ? prev.maxChoices
                                        : null,
                            }));
                        }}
                        options={[
                            { value: "single", label: labels.single },
                            { value: "multiple", label: labels.multiple },
                        ]}
                    />
                </FormField>

                <FormField
                    id={`${id}-question`}
                    label={labels.question}
                    error={
                        error === "question"
                            ? labels.errors.question
                            : undefined
                    }
                >
                    <Input
                        id={`${id}-question`}
                        lang={locale}
                        maxLength={POLL_QUESTION_MAX_LENGTH}
                        value={draft.question[locale] ?? ""}
                        readOnly={locked}
                        onChange={(event) =>
                            setDraft((prev) => ({
                                ...prev,
                                question: {
                                    ...prev.question,
                                    [locale]: event.target.value,
                                },
                            }))
                        }
                    />
                </FormField>

                <FormField
                    id={`${id}-options`}
                    label={labels.options}
                    help={labels.optionHelp}
                    error={
                        error === "options"
                            ? labels.errors.options
                            : error === "duplicate"
                              ? labels.errors.duplicate
                              : undefined
                    }
                >
                    <div className="nl-poll-builder__options">
                        {draft.options.map((option, index) => {
                            const saved = option.id !== undefined;
                            return (
                                <div
                                    className="nl-poll-builder__option"
                                    key={option.id ?? `new-${index}`}
                                >
                                    <Input
                                        id={
                                            index === 0
                                                ? `${id}-options`
                                                : undefined
                                        }
                                        ref={(
                                            node: HTMLInputElement | null
                                        ) => {
                                            if (!node || focusIndex !== index)
                                                return;
                                            node.focus();
                                            setFocusIndex(null);
                                        }}
                                        lang={locale}
                                        maxLength={POLL_OPTION_MAX_LENGTH}
                                        value={option.text[locale] ?? ""}
                                        readOnly={locked && saved}
                                        onChange={(event) =>
                                            setOption(index, event.target.value)
                                        }
                                        onKeyDown={(event) => {
                                            if (event.key !== "Enter") return;
                                            event.preventDefault();
                                            if (
                                                draft.options.length >=
                                                POLL_MAX_OPTIONS
                                            )
                                                return;
                                            addOption(index + 1);
                                        }}
                                    />
                                    <IconButton
                                        label={labels.removeOption}
                                        disabled={
                                            (locked && saved) ||
                                            draft.options.length <= 2
                                        }
                                        onClick={() => removeOption(index)}
                                    >
                                        <X className="nl-icon" aria-hidden />
                                    </IconButton>
                                </div>
                            );
                        })}
                    </div>
                    <div className="nl-poll-builder__option-actions">
                        <ActionButton
                            variant="secondary"
                            size="sm"
                            disabled={draft.options.length >= POLL_MAX_OPTIONS}
                            onClick={() => addOption()}
                        >
                            {labels.addOption}
                        </ActionButton>
                        {!locked ? (
                            <ActionButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setPaste((prev) => !prev)}
                            >
                                {labels.pasteOptions}
                            </ActionButton>
                        ) : null}
                    </div>
                    {paste ? (
                        <FormField
                            id={`${id}-paste`}
                            label={labels.pasteOptions}
                            help={labels.pasteHelp}
                        >
                            <textarea
                                id={`${id}-paste`}
                                className="nl-input"
                                rows={4}
                                value={pasted}
                                onChange={(event) =>
                                    setPasted(event.target.value)
                                }
                                onBlur={applyPaste}
                            />
                        </FormField>
                    ) : null}
                </FormField>

                {draft.multiple ? (
                    <FormField
                        id={`${id}-max`}
                        label={labels.maxChoices}
                        error={
                            error === "maxChoices"
                                ? labels.errors.maxChoices
                                : undefined
                        }
                    >
                        <Input
                            id={`${id}-max`}
                            type="number"
                            min={2}
                            max={draft.options.length}
                            value={draft.maxChoices ?? ""}
                            onChange={(event) =>
                                setDraft((prev) => ({
                                    ...prev,
                                    maxChoices: event.target.value
                                        ? Number(event.target.value)
                                        : null,
                                }))
                            }
                        />
                    </FormField>
                ) : null}

                <FormField id={`${id}-voters`} label={labels.voters}>
                    <SegmentedControl
                        label={labels.voters}
                        value={draft.showVoters ? "shown" : "hidden"}
                        onValueChange={(next) =>
                            setDraft((prev) => ({
                                ...prev,
                                showVoters: next === "shown",
                            }))
                        }
                        options={[
                            { value: "hidden", label: labels.votersHidden },
                            { value: "shown", label: labels.votersShown },
                        ]}
                    />
                </FormField>

                <Disclosure compact title={labels.advanced}>
                    <FormField
                        id={`${id}-closes`}
                        label={labels.closesAt}
                        help={labels.closesHelp}
                        error={
                            error === "closesAt"
                                ? labels.errors.closesAt
                                : undefined
                        }
                    >
                        <Input
                            id={`${id}-closes`}
                            type="date"
                            value={draft.closesAt ?? ""}
                            onChange={(event) =>
                                setDraft((prev) => ({
                                    ...prev,
                                    closesAt: event.target.value || null,
                                }))
                            }
                        />
                    </FormField>
                    <FormField id={`${id}-results`} label={labels.results}>
                        <Select
                            id={`${id}-results`}
                            value={draft.results}
                            onValueChange={(next) =>
                                setDraft((prev) => ({
                                    ...prev,
                                    results: next as PollInput["results"],
                                }))
                            }
                            options={POLL_RESULT_VISIBILITIES.map((item) => ({
                                value: item,
                                label: labels.resultOptions[item],
                            }))}
                        />
                    </FormField>
                    <Checkbox
                        label={labels.allowAddOptions}
                        checked={draft.allowAddOptions}
                        onChange={(event) =>
                            setDraft((prev) => ({
                                ...prev,
                                allowAddOptions: event.target.checked,
                            }))
                        }
                    />
                </Disclosure>
            </div>
        </ResponsiveDialog>
    );
}
