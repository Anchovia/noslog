"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import { foundationButtonClass } from "@/components/ui/Button";
import { FormField, TextArea } from "@/components/ui/formField";
import RatingScale from "@/components/ui/ratingScale";
import { StatusMessage } from "@/components/ui/statusMessage";
import useCommunityMutation from "@/features/music/hooks/useCommunityMutation";
import {
    PATTERN_AXES,
    EMPTY_PATTERN_RATINGS,
    communityEvaluationInputSchema,
} from "@/features/music/schemas/communitySchema";
import type {
    CommunityData,
    CommunityEvaluationInput,
} from "@/features/music/schemas/communitySchema";
import DeleteContributionDialog from "./deleteContributionDialog";

export default function PatternEvaluationForm({
    chartId,
    data,
    accountId,
    returnTo,
}: {
    chartId: number;
    data: CommunityData;
    accountId?: number;
    returnTo: string;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const id = useId();
    const heading = useRef<HTMLHeadingElement>(null);
    const mutation = useCommunityMutation(chartId);
    const form = useForm<CommunityEvaluationInput>({
        resolver: zodResolver(communityEvaluationInputSchema),
        defaultValues: {
            chartId,
            ...EMPTY_PATTERN_RATINGS,
            ...data.currentEvaluation,
            opinion: data.currentEvaluation?.opinion ?? "",
        },
    });
    const opinion = useWatch({ control: form.control, name: "opinion" });
    const {
        reset,
        formState: { isDirty },
    } = form;
    useEffect(() => {
        if (!isDirty)
            reset({
                chartId,
                ...EMPTY_PATTERN_RATINGS,
                ...data.currentEvaluation,
                opinion: data.currentEvaluation?.opinion ?? "",
            });
    }, [chartId, data.currentEvaluation, isDirty, reset]);
    const disabled =
        !accountId ||
        !data.canEvaluate ||
        Boolean(data.currentEvaluation?.excluded);
    const handleSubmit = async (input: CommunityEvaluationInput) => {
        try {
            await mutation.mutateAsync({ action: "save-evaluation", input });
            form.reset(input);
        } catch (error) {
            form.setError("root", {
                message:
                    error instanceof Error
                        ? error.message
                        : t("community.action.failed"),
            });
        }
    };
    return (
        <section className="nl-pattern-form" aria-labelledby={`${id}-title`}>
            <h2
                id={`${id}-title`}
                ref={heading}
                tabIndex={-1}
                className="nl-section-title"
            >
                {t("community.patternVote")}
            </h2>
            {disabled ? (
                <div className="nl-vote-contribution">
                    <p className="nl-body-secondary nl-muted">
                        {t(
                            !accountId
                                ? "community.evaluationLogin"
                                : data.currentEvaluation?.excluded
                                  ? "community.action.unavailable"
                                  : "community.evaluationRecord"
                        )}
                    </p>
                    {!accountId ? (
                        <Link
                            href={href(
                                `/login?returnTo=${encodeURIComponent(returnTo)}`
                            )}
                            className={foundationButtonClass({
                                variant: "secondary",
                            })}
                        >
                            {t("common.login")}
                        </Link>
                    ) : null}
                </div>
            ) : null}
            <form
                className="nl-pattern-form__card"
                noValidate
                onSubmit={form.handleSubmit(handleSubmit)}
                aria-describedby={disabled ? `${id}-title` : undefined}
            >
                {PATTERN_AXES.map((axis) => (
                    <Controller
                        key={axis}
                        name={axis}
                        control={form.control}
                        render={({ field }) => (
                            <div className="nl-pattern-axis">
                                <div className="nl-pattern-axis__header">
                                    <p
                                        id={`${id}-${axis}`}
                                        className="nl-control"
                                    >
                                        {t(`pattern.axis.${axis}`)}
                                    </p>
                                    {field.value !== null ? (
                                        <ActionButton
                                            variant="ghost"
                                            disabled={
                                                disabled || mutation.isPending
                                            }
                                            onClick={() => {
                                                field.onChange(null);
                                                form.setFocus(axis);
                                            }}
                                        >
                                            {t("community.clearRating")}
                                        </ActionButton>
                                    ) : null}
                                </div>
                                <RatingScale
                                    name={field.name}
                                    value={field.value}
                                    inputRef={field.ref}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    labelId={`${id}-${axis}`}
                                    disabled={disabled || mutation.isPending}
                                />
                            </div>
                        )}
                    />
                ))}
                <div className="nl-pattern-form__opinion">
                    <FormField
                        id={`${id}-opinion`}
                        label={t("community.opinionOptional")}
                        help={
                            <span className="nl-pattern-form__counter">
                                <span>{t("community.opinionHelp")}</span>
                                <span>{opinion.length}/120</span>
                            </span>
                        }
                        error={
                            form.formState.errors.opinion
                                ? t(
                                      opinion.length > 120
                                          ? "community.opinionTooLong"
                                          : "community.evaluationEmpty"
                                  )
                                : undefined
                        }
                    >
                        <TextArea
                            id={`${id}-opinion`}
                            {...form.register("opinion")}
                            placeholder={t("community.opinionPlaceholder")}
                            disabled={disabled || mutation.isPending}
                            aria-invalid={Boolean(
                                form.formState.errors.opinion
                            )}
                            aria-describedby={`${id}-opinion-help${form.formState.errors.opinion ? ` ${id}-opinion-error` : ""}`}
                        />
                    </FormField>
                </div>
                {form.formState.errors.root?.message ? (
                    <StatusMessage
                        severity="danger"
                        role="alert"
                        title={form.formState.errors.root.message}
                    />
                ) : null}
                <div className="nl-community-actions nl-pattern-form__actions">
                    {data.currentEvaluation ? (
                        <DeleteContributionDialog
                            kind="evaluation"
                            trigger={
                                <ActionButton
                                    variant="ghost"
                                    disabled={mutation.isPending}
                                >
                                    {t("community.delete.evaluation.action")}
                                </ActionButton>
                            }
                            onConfirm={() =>
                                mutation.mutateAsync({
                                    action: "delete-evaluation",
                                    chartId,
                                })
                            }
                            onDeleted={() => {
                                form.reset({
                                    chartId,
                                    ...EMPTY_PATTERN_RATINGS,
                                    opinion: "",
                                });
                                heading.current?.focus();
                            }}
                        />
                    ) : null}
                    <ActionButton
                        variant="primary"
                        type="submit"
                        disabled={disabled}
                        busy={mutation.isPending}
                    >
                        {t("community.saveEvaluation")}
                    </ActionButton>
                </div>
                <span className="sr-only" role="status">
                    {mutation.isSuccess ? t("community.action.saved") : ""}
                </span>
            </form>
        </section>
    );
}
