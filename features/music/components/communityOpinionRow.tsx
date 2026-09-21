"use client";

import { SkeletonText } from "@/components/ui/skeleton";
import Link from "next/link";
import { useId, useState } from "react";
import type { ReactNode } from "react";
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
    editor,
}: {
    item: OpinionPage["items"][number];
    chartId: number;
    accountId?: number;
    returnTo: string;
    onEdit: () => void;
    onDeleted: () => void;
    /** 내 의견을 고치는 중이면 본문 자리에 작성 칸 */
    editor?: ReactNode;
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
    // 상자 없는 목록 줄 — 아바타 32 열 + 내용 열(사이 12). 첫 줄 = 이름 · 날짜 · ⋯, 아래 본문. 추천은 없앴다(2026-09-16)
    return (
        <article
            className="nl-opinion-row"
            tabIndex={-1}
            aria-labelledby={`${id}-name`}
        >
            <Avatar src={item.user.avatar} size={32} />
            <div className="nl-opinion-row__content">
                <div className="nl-opinion-row__header">
                    <Link
                        id={`${id}-name`}
                        href={href(`/profile/${item.user.id}`)}
                        className="nl-opinion-row__name nl-emphasis-label"
                    >
                        {name}
                    </Link>
                    <span className="nl-metadata nl-muted">
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
                    </span>
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
                {editor ?? (
                    <p className="nl-body-secondary nl-opinion-row__body">
                        {item.opinion}
                    </p>
                )}
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
            </div>
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

/** 의견 줄 스켈레톤(2026-09-19 로딩 시안 S1) — 같은 줄 틀(사진 32 열 + 내용 열 사이 12 · 이름 줄 →4→ 본문) */
export function CommunityOpinionRowSkeleton() {
    return (
        <div className="nl-opinion-row" aria-hidden="true">
            <span className="nl-avatar nl-avatar--compact nl-skeleton" />
            <div className="nl-opinion-row__content">
                <div className="nl-opinion-row__header">
                    <SkeletonText className="nl-emphasis-label" width="s" />
                </div>
                <SkeletonText className="nl-body-secondary" width="l" />
            </div>
        </div>
    );
}
