"use client";

import { cn } from "@/lib/utils";
import { Check, Minus, Plus } from "lucide-react";
import type {
    Control,
    FieldErrors,
    UseFormRegisterReturn,
} from "react-hook-form";
import MusicPatternVoteGrid from "./musicPatternVoteGrid";
import type { EvaluationFormValues } from "./musicTierVoteTypes";

interface MusicEvaluationFormProps {
    canVote: boolean;
    isPending: boolean;
    hasCurrentEvaluation: boolean;
    isCommentExpanded: boolean;
    message: string | null;
    control: Control<EvaluationFormValues>;
    errors: FieldErrors<EvaluationFormValues>;
    perceivedConstantField: UseFormRegisterReturn<"perceivedConstant">;
    commentField: UseFormRegisterReturn<"comment">;
    onChangeConstant: (amount: number) => void;
    onCommentExpandedChange: (expanded: boolean) => void;
    onSubmit: () => Promise<void>;
}

export default function MusicEvaluationForm({
    canVote,
    isPending,
    hasCurrentEvaluation,
    isCommentExpanded,
    message,
    control,
    errors,
    perceivedConstantField,
    commentField,
    onChangeConstant,
    onCommentExpandedChange,
    onSubmit,
}: MusicEvaluationFormProps) {
    return (
        <section className="bg-surface rounded-card p-4">
            <h2 className="text-section">체감 난이도 투표</h2>
            {!canVote ? (
                <p className="bg-danger/10 text-danger mt-3 rounded-md px-3 py-2 text-xs font-medium">
                    해당 채보의 플레이 기록 연동 후 투표할 수 있습니다.
                </p>
            ) : null}
            <div
                className={cn(
                    "mt-3 gap-2",
                    isCommentExpanded ? "block" : "flex"
                )}
            >
                {!isCommentExpanded ? (
                    <div
                        className={cn(
                            "border-border flex h-10 shrink-0 overflow-hidden rounded-lg border",
                            errors.perceivedConstant &&
                                "border-danger ring-danger ring-1"
                        )}
                    >
                        <button
                            type="button"
                            disabled={!canVote}
                            aria-label="체감 난이도 0.1 낮추기"
                            className="text-text-secondary hover:bg-surface-muted flex w-10 items-center justify-center disabled:opacity-40"
                            onClick={() => onChangeConstant(-0.1)}
                        >
                            <Minus size={16} aria-hidden />
                        </button>
                        <input
                            {...perceivedConstantField}
                            type="number"
                            min="1"
                            max="14"
                            step="0.1"
                            inputMode="decimal"
                            disabled={!canVote}
                            aria-label="체감 난이도 직접 입력"
                            aria-invalid={Boolean(errors.perceivedConstant)}
                            className="bg-surface-muted text-text-primary h-full w-16 appearance-none px-1 text-center text-base font-extrabold tabular-nums outline-none disabled:opacity-40 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                            type="button"
                            disabled={!canVote}
                            aria-label="체감 난이도 0.1 높이기"
                            className="text-text-secondary hover:bg-surface-muted flex w-10 items-center justify-center disabled:opacity-40"
                            onClick={() => onChangeConstant(0.1)}
                        >
                            <Plus size={16} aria-hidden />
                        </button>
                    </div>
                ) : null}
                <textarea
                    {...commentField}
                    disabled={!canVote}
                    maxLength={120}
                    rows={isCommentExpanded ? 4 : 1}
                    placeholder="짧은 코멘트"
                    aria-label="체감 난이도 코멘트"
                    aria-invalid={Boolean(errors.comment)}
                    onFocus={() => onCommentExpandedChange(true)}
                    onBlur={(event) => {
                        commentField.onBlur(event);
                        onCommentExpandedChange(false);
                    }}
                    className={cn(
                        "border-border bg-bg text-input placeholder:text-text-disabled focus:border-focus min-w-0 flex-1 resize-none rounded-lg border border-dashed px-3 py-2 transition-[height] outline-none disabled:opacity-40",
                        isCommentExpanded
                            ? "h-24 w-full overflow-y-auto"
                            : "h-10 overflow-hidden",
                        errors.comment && "border-danger ring-danger ring-1"
                    )}
                />
                {!isCommentExpanded ? (
                    <button
                        type="button"
                        disabled={isPending || !canVote}
                        onClick={() => void onSubmit()}
                        className="bg-text-primary text-bg flex h-10 shrink-0 items-center gap-1 rounded-lg px-3 text-sm font-bold disabled:opacity-50"
                    >
                        {hasCurrentEvaluation ? (
                            <Check size={14} aria-hidden />
                        ) : null}
                        {isPending
                            ? "처리 중"
                            : hasCurrentEvaluation
                              ? "수정"
                              : "제출"}
                    </button>
                ) : null}
            </div>
            {errors.perceivedConstant ? (
                <p className="text-danger mt-1 text-xs" role="alert">
                    {errors.perceivedConstant.message}
                </p>
            ) : null}
            {errors.comment ? (
                <p className="text-danger mt-1 text-xs" role="alert">
                    {errors.comment.message}
                </p>
            ) : null}

            <MusicPatternVoteGrid
                canVote={canVote}
                control={control}
                errors={errors}
            />

            {message ? (
                <p
                    className="text-caption mt-3"
                    role="status"
                    aria-live="polite"
                >
                    {message}
                </p>
            ) : null}
        </section>
    );
}
