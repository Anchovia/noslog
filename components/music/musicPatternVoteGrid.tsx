"use client";

import { cn } from "@/lib/utils";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { patternItems, patternLevels } from "./musicTierVoteConfig";
import type { EvaluationFormValues } from "./musicTierVoteTypes";

interface MusicPatternVoteGridProps {
    canVote: boolean;
    control: Control<EvaluationFormValues>;
    errors: FieldErrors<EvaluationFormValues>;
}

export default function MusicPatternVoteGrid({
    canVote,
    control,
    errors,
}: MusicPatternVoteGridProps) {
    const hasPatternError = patternItems.some(
        ({ key }) => errors[key] !== undefined
    );

    return (
        <div className="border-divider mt-4 border-t pt-3">
            <div className="flex items-baseline gap-2">
                <h3 className="text-text-primary text-sm font-bold">
                    패턴 투표
                </h3>
                <span className="text-caption">필수 · 제출 시 함께 반영</span>
            </div>
            <div className="mt-3 grid grid-cols-[4rem_repeat(5,minmax(0,1fr))] items-center">
                <span />
                {patternLevels.map((label) => (
                    <span
                        key={label}
                        className="text-text-disabled text-center text-xs"
                    >
                        {label}
                    </span>
                ))}
                {patternItems.map(({ key, label }) => (
                    <Controller
                        key={key}
                        name={key}
                        control={control}
                        rules={{
                            validate: (value) =>
                                value !== null ||
                                "다섯 패턴 항목을 모두 선택해 주세요.",
                        }}
                        render={({ field }) => (
                            <div className="contents">
                                <span className="text-text-secondary text-sm">
                                    {label}
                                </span>
                                {patternLevels.map((option, value) => (
                                    <label
                                        key={option}
                                        className={cn(
                                            "flex h-9 items-center justify-center",
                                            canVote
                                                ? "cursor-pointer"
                                                : "cursor-not-allowed opacity-40"
                                        )}
                                        title={`${label} ${option}`}
                                    >
                                        <input
                                            ref={
                                                value === 0
                                                    ? field.ref
                                                    : undefined
                                            }
                                            type="radio"
                                            name={field.name}
                                            value={value}
                                            checked={field.value === value}
                                            disabled={!canVote}
                                            onBlur={field.onBlur}
                                            onChange={() =>
                                                field.onChange(value)
                                            }
                                            className="sr-only"
                                        />
                                        <span
                                            className={cn(
                                                "size-4 rounded-full border transition-colors",
                                                field.value === value
                                                    ? "border-chart bg-chart"
                                                    : "border-border",
                                                errors[key] && "border-danger"
                                            )}
                                        />
                                    </label>
                                ))}
                            </div>
                        )}
                    />
                ))}
            </div>
            {hasPatternError ? (
                <p className="text-danger mt-2 text-xs" role="alert">
                    다섯 패턴 항목을 모두 선택해 주세요.
                </p>
            ) : null}
        </div>
    );
}
