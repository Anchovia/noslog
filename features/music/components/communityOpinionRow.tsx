"use client";

import Link from "next/link";
import { ThumbsUp } from "lucide-react";
import { useId, useState } from "react";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import ActionMenu from "@/components/ui/actionMenu";
import Avatar from "@/components/ui/avatar";
import { StatusMessage } from "@/components/ui/statusMessage";
import useCommunityMutation from "@/features/music/hooks/useCommunityMutation";
import type { OpinionPage } from "@/features/music/schemas/communitySchema";
import DeleteContributionDialog from "./deleteContributionDialog";
import ReportOpinionDialog from "./reportOpinionDialog";

export default function CommunityOpinionRow({
    item,
    chartId,
    accountId,
    returnTo,
    onEdit,
    onDeleted,
}: {
    item: OpinionPage["items"][number];
    chartId: number;
    accountId?: number;
    returnTo: string;
    onEdit: () => void;
    onDeleted: () => void;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const locale = useLocale();
    const id = useId();
    const [action, setAction] = useState<"delete" | "report" | null>(null);
    const [reported, setReported] = useState(false);
    const mutation = useCommunityMutation(chartId);
    const name = item.user.username ?? t("ranking.unknownPlayer");
    const writtenAt = new Date(item.updatedAt);
    return (
        <article
            className="nl-opinion-row"
            tabIndex={-1}
            aria-labelledby={`${id}-name`}
        >
            <div className="nl-opinion-row__header">
                <div className="nl-opinion-row__author">
                    <Avatar src={item.user.avatar} size={32} />
                    <div className="nl-opinion-row__identity">
                        <Link
                            id={`${id}-name`}
                            href={href(`/profile/${item.user.id}`)}
                            className="nl-emphasis-label"
                        >
                            {name}
                        </Link>
                        <p className="nl-metadata nl-muted">
                            <time
                                dateTime={item.updatedAt}
                                title={writtenAt.toLocaleString(locale)}
                            >
                                {writtenAt.toLocaleDateString(locale, {
                                    month: "numeric",
                                    day: "numeric",
                                    timeZone: "Asia/Seoul",
                                })}
                            </time>
                            {item.edited ? ` · ${t("community.edited")}` : ""}
                        </p>
                    </div>
                </div>
                <ActionMenu
                    label={t("community.opinionActions", { name })}
                    items={
                        item.own
                            ? [
                                  {
                                      label: t("community.edit"),
                                      onSelect: onEdit,
                                  },
                                  {
                                      label: t(
                                          "community.delete.opinion.action"
                                      ),
                                      onSelect: () => setAction("delete"),
                                      destructive: true,
                                  },
                              ]
                            : [
                                  {
                                      label: t("community.report"),
                                      onSelect: () => setAction("report"),
                                  },
                              ]
                    }
                />
            </div>
            <p className="nl-body nl-opinion-row__body">{item.opinion}</p>
            <button
                type="button"
                className="nl-opinion-helpful nl-control"
                aria-label={`${t("community.helpful")} ${item.helpfulCount}`}
                aria-pressed={item.viewerHelpful}
                disabled={!item.canReact}
                aria-disabled={mutation.isPending || undefined}
                aria-describedby={
                    !item.canReact ? `${id}-unavailable` : undefined
                }
                onClick={() => {
                    if (!mutation.isPending)
                        void mutation
                            .mutateAsync({
                                action: "helpful",
                                evaluationId: item.id,
                                selected: !item.viewerHelpful,
                            })
                            .catch(() => undefined);
                }}
            >
                <ThumbsUp aria-hidden />
                <span>{item.helpfulCount.toLocaleString(locale)}</span>
            </button>
            {!item.canReact ? (
                <span id={`${id}-unavailable`} className="sr-only">
                    {t(
                        item.own
                            ? "community.helpfulUnavailable"
                            : accountId
                              ? "community.evaluationRecord"
                              : "community.action.login"
                    )}
                </span>
            ) : null}
            {mutation.isError ? (
                <StatusMessage
                    severity="danger"
                    role="alert"
                    title={mutation.error.message}
                />
            ) : null}
            {reported ? (
                <p className="nl-body-secondary" role="status">
                    {t("community.reportReceived")}
                </p>
            ) : null}
            <DeleteContributionDialog
                kind="opinion"
                open={action === "delete"}
                onOpenChange={(open) => {
                    if (!open) setAction(null);
                }}
                onConfirm={() =>
                    mutation.mutateAsync({ action: "delete-opinion", chartId })
                }
                onDeleted={onDeleted}
            />
            {action === "report" ? (
                <ReportOpinionDialog
                    chartId={chartId}
                    evaluationId={item.id}
                    accountId={accountId}
                    returnTo={returnTo}
                    onClose={() => setAction(null)}
                    onReported={() => setReported(true)}
                />
            ) : null}
        </article>
    );
}
