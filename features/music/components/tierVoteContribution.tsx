"use client";

import { useId, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import { Select } from "@/components/ui/select";
import { StatusMessage } from "@/components/ui/statusMessage";
import { goalVoteInputSchema } from "@/features/music/schemas/communitySchema";
import type {
    CommunityData,
    GoalVoteInput,
} from "@/features/music/schemas/communitySchema";
import useCommunityMutation from "@/features/music/hooks/useCommunityMutation";
import DeleteContributionDialog from "./deleteContributionDialog";

export default function TierVoteContribution({
    chartId,
    scope,
    accountId,
    hasRecord,
}: {
    chartId: number;
    scope: CommunityData["scopes"][number];
    accountId?: number;
    hasRecord: boolean;
}) {
    const t = useTranslations();
    const id = useId();
    const region = useRef<HTMLElement>(null);
    const mutation = useCommunityMutation(chartId);
    const name =
        scope.mode === "basic"
            ? `Basic ${t(`community.goal.${scope.goal}`)}`
            : "Recital";
    const form = useForm<GoalVoteInput>({
        resolver: zodResolver(goalVoteInputSchema),
        defaultValues: {
            chartId,
            mode: scope.mode,
            goal: scope.goal,
            value: scope.ownVote ?? Number.NaN,
        },
    });
    const handleSubmit = async (input: GoalVoteInput) => {
        try {
            await mutation.mutateAsync({ action: "save-vote", input });
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
    const deleteAction = (
        <DeleteContributionDialog
            kind="vote"
            scope={name}
            trigger={
                <ActionButton variant="ghost">
                    {t("community.delete.vote.action")}
                </ActionButton>
            }
            onConfirm={() =>
                mutation.mutateAsync({
                    action: "delete-vote",
                    input: { chartId, mode: scope.mode, goal: scope.goal },
                })
            }
            onDeleted={() => {
                form.reset({
                    chartId,
                    mode: scope.mode,
                    goal: scope.goal,
                    value: Number.NaN,
                });
                region.current?.focus();
            }}
        />
    );
    return (
        <section
            ref={region}
            tabIndex={-1}
            className="nl-vote-contribution"
            aria-label={t("community.contributeScope", { scope: name })}
        >
            {/* 로그아웃 · 기록 없음 · 목표 미달성은 입력을 두지 않는다(이유 문장도 없음 — 2026-09-16 A). 이미 한 투표만 보여 주고 지울 수 있게 */}
            {!accountId ? null : !hasRecord || !scope.eligible ? (
                scope.ownVote !== null ? (
                    <div className="nl-vote-form__row">
                        <p className="nl-vote-contribution__value">
                            <span className="nl-control">
                                {t("community.myVote")}
                            </span>
                            <span className="nl-metric-value">
                                {scope.ownVote.toFixed(1)}
                            </span>
                        </p>
                        {deleteAction}
                    </div>
                ) : null
            ) : (
                // 펼치면 바로 「값 선택 + 투표 저장」 한 줄 — 내 투표가 있으면 그 값이 기본 (가이드 4절 · 2026-09-18)
                <form
                    className="nl-vote-form"
                    noValidate
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <div className="nl-vote-form__row">
                        <Controller
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <Select
                                    id={id}
                                    aria-label={t("community.voteValue")}
                                    invalid={Boolean(
                                        form.formState.errors.value
                                    )}
                                    value={
                                        Number.isFinite(field.value)
                                            ? String(field.value)
                                            : ""
                                    }
                                    onValueChange={(next) =>
                                        field.onChange(
                                            next === ""
                                                ? Number.NaN
                                                : Number(next)
                                        )
                                    }
                                    onBlur={field.onBlur}
                                    triggerRef={field.ref}
                                    options={[
                                        {
                                            value: "",
                                            label: t(
                                                "community.valuePlaceholder"
                                            ),
                                        },
                                        ...Array.from(
                                            { length: 136 },
                                            (_, index) => (index + 10) / 10
                                        ).map((value) => ({
                                            value: String(value),
                                            label: value.toFixed(1),
                                        })),
                                    ]}
                                />
                            )}
                        />
                        {scope.ownVote !== null ? deleteAction : null}
                        <ActionButton
                            variant="primary"
                            size="sm"
                            type="submit"
                            busy={mutation.isPending}
                            busyLabel={t("community.saving")}
                        >
                            {t("community.saveVote")}
                        </ActionButton>
                    </div>
                    {form.formState.errors.root ||
                    form.formState.errors.value ? (
                        <StatusMessage
                            severity="danger"
                            role="alert"
                            title={
                                form.formState.errors.root?.message ??
                                t("community.selectValue")
                            }
                        />
                    ) : null}
                </form>
            )}
        </section>
    );
}
