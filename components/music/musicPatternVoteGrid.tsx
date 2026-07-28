"use client";

import { cn } from "@/lib/utils";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { patternItems, patternLevelKeys } from "./musicTierVoteConfig";
import type { EvaluationFormValues } from "./musicTierVoteTypes";
import { useTranslations } from "@/components/i18n/localeProvider";

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
    const t = useTranslations();
    const hasPatternError = patternItems.some(
        ({ key }) => errors[key] !== undefined
    );

    return (
        <div className="border-divider mt-4 border-t pt-3">
            <div className="flex items-baseline gap-2">
                <h3 className="text-section">{t("music.tier.patternVote")}</h3>
                <span className="text-caption">
                    {t("music.tier.patternRequired")}
                </span>
            </div>
            <div className="mt-3 grid grid-cols-[4rem_repeat(5,minmax(0,1fr))] items-center">
                <span />
                {patternLevelKeys.map((labelKey) => (
                    <span
                        key={labelKey}
                        className="text-text-disabled text-center text-xs"
                    >
                        {t(labelKey)}
                    </span>
                ))}
                {patternItems.map(({ key, labelKey }) => (
                    <Controller
                        key={key}
                        name={key}
                        control={control}
                        rules={{
                            validate: (value) =>
                                value !== null ||
                                t("music.tier.patternMissing"),
                        }}
                        render={({ field }) => (
                            <div className="contents">
                                <span className="text-text-secondary text-sm">
                                    {t(labelKey)}
                                </span>
                                {patternLevelKeys.map((optionKey, value) => (
                                    <label
                                        key={optionKey}
                                        className={cn(
                                            "flex h-9 items-center justify-center",
                                            canVote
                                                ? "cursor-pointer"
                                                : "cursor-not-allowed opacity-40"
                                        )}
                                        title={`${t(labelKey)} ${t(optionKey)}`}
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
                    {t("music.tier.patternMissing")}
                </p>
            ) : null}
        </div>
    );
}
