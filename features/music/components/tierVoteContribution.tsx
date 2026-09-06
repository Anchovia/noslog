"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import { foundationButtonClass } from "@/components/ui/Button";
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
    returnTo,
}: {
    chartId: number;
    scope: CommunityData["scopes"][number];
    accountId?: number;
    hasRecord: boolean;
    returnTo: string;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const id = useId();
    const region = useRef<HTMLElement>(null);
    const [editing, setEditing] = useState(false);
    const mutation = useCommunityMutation(chartId);
    const name = `${scope.mode === "basic" ? "Basic" : "Recital"} ${t(`community.goal.${scope.goal}`)}`;
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
            setEditing(false);
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
                <ActionButton variant="ghost" disabled={mutation.isPending}>
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
                setEditing(false);
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
            {!accountId ? (
                <>
                    <p className="nl-body-secondary nl-muted">
                        {t("community.voteLogin")}
                    </p>
                    <div className="nl-community-actions">
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
                    </div>
                </>
            ) : !hasRecord ? (
                <p className="nl-body-secondary nl-muted">
                    {t("community.voteRecord")}
                </p>
            ) : !scope.eligible ? (
                <>
                    <p className="nl-body-secondary nl-muted">
                        {t("community.voteIneligible", { scope: name })}
                    </p>
                    {scope.ownVote !== null ? deleteAction : null}
                </>
            ) : editing ? (
                <form
                    className="nl-vote-form"
                    noValidate
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <Select
                        id={id}
                        aria-label={t("community.voteValue")}
                        aria-describedby={`${id}-help`}
                        aria-invalid={Boolean(form.formState.errors.value)}
                        disabled={mutation.isPending}
                        {...form.register("value", { valueAsNumber: true })}
                    >
                        <option value="">{t("community.selectValue")}</option>
                        {Array.from(
                            { length: 136 },
                            (_, index) => (index + 10) / 10
                        ).map((value) => (
                            <option key={value} value={value}>
                                {value.toFixed(1)}
                            </option>
                        ))}
                    </Select>
                    <p id={`${id}-help`} className="nl-metadata nl-muted">
                        {t("community.valueHelp")}
                    </p>
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
                    <div className="nl-community-actions">
                        {scope.ownVote !== null ? deleteAction : null}
                        <ActionButton
                            variant="primary"
                            type="submit"
                            busy={mutation.isPending}
                        >
                            {t("community.saveVote")}
                        </ActionButton>
                    </div>
                </form>
            ) : (
                <>
                    {scope.ownVote !== null ? (
                        <p className="nl-vote-contribution__value">
                            <span className="nl-control">
                                {t("community.myVote")}
                            </span>
                            <span className="nl-metric-value">
                                {scope.ownVote.toFixed(1)}
                            </span>
                        </p>
                    ) : null}
                    <div className="nl-community-actions">
                        <ActionButton
                            variant="secondary"
                            onClick={() => {
                                form.reset({
                                    chartId,
                                    mode: scope.mode,
                                    goal: scope.goal,
                                    value: scope.ownVote ?? Number.NaN,
                                });
                                setEditing(true);
                            }}
                        >
                            {t(
                                scope.ownVote !== null
                                    ? "community.edit"
                                    : "community.vote"
                            )}
                        </ActionButton>
                        {scope.ownVote !== null ? deleteAction : null}
                    </div>
                </>
            )}
        </section>
    );
}
