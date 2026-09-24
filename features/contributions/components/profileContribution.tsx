"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import {
    listMyChartDrafts,
    listMyChartFieldProposals,
} from "@/app/(nevigation)/profile/[id]/contributionActions";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import ModalDialog from "@/components/ui/modalDialog";
import ResultState from "@/components/ui/resultState";
import { SkeletonText } from "@/components/ui/skeleton";
import StatStrip from "@/components/ui/statStrip";
import {
    contributionLevel,
    contributionProgress,
    type ContributionTotals,
} from "@/features/contributions/contributionLevel";
import {
    formatProposalValue,
    type ChartFieldProposalField,
} from "@/features/contributions/schemas/chartFieldProposalSchema";
import type { MyChartDraftItem } from "@/features/contributions/server/chartDraftService";
import type { MyChartFieldProposal } from "@/features/contributions/server/chartFieldProposalService";
import type { MessageKey } from "@/lib/i18n/messageTypes";

const RECENT_COUNT = 3;
const ALL_COUNT = 100;

const FIELD_LABEL_KEYS: Record<ChartFieldProposalField, MessageKey | null> = {
    bpm: null,
    note_count: "music.info.noteCount",
    duration: "detail.duration",
    released_at: "music.info.releaseDate",
};

const STATUS_TONES: Record<string, "warning" | "success" | "danger"> = {
    pending: "warning",
    applied: "success",
    rejected: "danger",
};
// 채보 초안 상태 — 가이드 상태 태그: 검토 대기 = 경고 · 수정 요청 = 정보 · 공개 = 성공 · 작성 중 = 중립
const DRAFT_TONES: Record<string, "warning" | "info" | "success" | undefined> =
    {
        draft: undefined,
        submitted: "warning",
        changes_requested: "info",
        published: "success",
    };

type MineItem =
    | { kind: "field"; at: string; item: MyChartFieldProposal }
    | { kind: "chart"; at: string; item: MyChartDraftItem };

/** 곡 정보 제안 + 채보 초안을 최근 순으로 한 목록에 */
async function loadMine(limit: number): Promise<MineItem[]> {
    const [fields, drafts] = await Promise.all([
        listMyChartFieldProposals(limit),
        listMyChartDrafts(limit),
    ]);
    return [
        ...fields.map((item) => ({
            kind: "field" as const,
            at: item.createdAt,
            item,
        })),
        ...drafts.map((item) => ({
            kind: "chart" as const,
            at: item.updatedAt,
            item,
        })),
    ]
        .sort((left, right) => right.at.localeCompare(left.at))
        .slice(0, limit);
}

function DraftRow({ item }: { item: MyChartDraftItem }) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const base = `/music/${item.chart.musicIndex}/${item.chart.difficulty.toLowerCase()}/pattern`;
    const tone = DRAFT_TONES[item.status];
    return (
        <li className="nl-profile-contribution__item">
            <div className="nl-profile-contribution__item-head">
                <Link
                    href={href(
                        item.status === "published" ? base : `${base}/draft`
                    )}
                    className="nl-profile-contribution__what nl-control nl-link"
                >
                    {item.chart.title} · {item.chart.difficulty}{" "}
                    {item.chart.level} · {t("contribution.section.chartItem")}
                </Link>
                <span
                    className={tone ? "nl-tag nl-tag--status" : "nl-tag"}
                    data-tone={tone}
                >
                    {t(`contribution.draftStatus.${item.status}`)}
                </span>
            </div>
            <p className="nl-metadata nl-muted nl-profile-contribution__number">
                {item.status === "published" && item.publishedAt
                    ? `${t("contribution.section.publishedPoints", { points: 20 })} · ${item.publishedAt.slice(0, 10)}`
                    : item.openComments
                      ? t("contribution.section.openComments", {
                            count: item.openComments.toLocaleString(locale),
                        })
                      : new Date(item.updatedAt).toLocaleDateString(locale, {
                            timeZone: "Asia/Seoul",
                        })}
            </p>
        </li>
    );
}

function ProposalList({ items }: { items: MineItem[] }) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    return (
        <ul className="nl-profile-contribution__list">
            {items.map((entry) => {
                if (entry.kind === "chart")
                    return (
                        <DraftRow
                            key={`chart-${entry.item.id}`}
                            item={entry.item}
                        />
                    );
                const item = entry.item;
                const labelKey = FIELD_LABEL_KEYS[item.field];
                const fieldLabel = labelKey ? t(labelKey) : "BPM";
                const tone = STATUS_TONES[item.status] ?? "warning";
                const before =
                    item.previousValue === null
                        ? "—"
                        : formatProposalValue(
                              item.field,
                              item.previousValue,
                              locale
                          );
                return (
                    <li
                        key={`field-${item.id}`}
                        className="nl-profile-contribution__item"
                    >
                        <div className="nl-profile-contribution__item-head">
                            <Link
                                href={href(
                                    `/music/${item.chart.musicIndex}/${item.chart.difficulty.toLowerCase()}`
                                )}
                                className="nl-profile-contribution__what nl-control nl-link"
                            >
                                {item.chart.title} · {item.chart.difficulty}{" "}
                                {item.chart.level} · {fieldLabel}
                            </Link>
                            <span
                                className="nl-tag nl-tag--status"
                                data-tone={tone}
                            >
                                {t(
                                    `contribution.status.${item.status === "applied" || item.status === "rejected" ? item.status : "pending"}`
                                )}
                            </span>
                        </div>
                        <p className="nl-metadata nl-muted nl-profile-contribution__number">
                            {before} →{" "}
                            {formatProposalValue(
                                item.field,
                                item.value,
                                locale
                            )}
                        </p>
                        {item.status === "rejected" && item.rejectReason ? (
                            <p className="nl-metadata nl-profile-contribution__reason">
                                {t("contribution.rejectReason", {
                                    reason: item.rejectReason,
                                })}
                            </p>
                        ) : null}
                    </li>
                );
            })}
        </ul>
    );
}

/** 불러오는 동안 — 제안 줄과 같은 틀(제목 · 값), 글자 자리만 스켈레톤 */
function ProposalListSkeleton({ count }: { count: number }) {
    return (
        <ul className="nl-profile-contribution__list" aria-busy="true">
            {Array.from({ length: count }, (_, index) => (
                <li key={index} className="nl-profile-contribution__item">
                    <SkeletonText className="nl-control" width="l" />
                    <SkeletonText className="nl-metadata" width="s" />
                </li>
            ))}
        </ul>
    );
}

/** 내 제안(본인만) — 최근 3건 + 「모두 보기」 창(최근 100건) */
function MyProposals() {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const recent = useQuery({
        queryKey: ["contribution", "mine", "recent"],
        queryFn: () => loadMine(RECENT_COUNT + 1),
        staleTime: 60_000,
        retry: false,
    });
    const all = useQuery({
        queryKey: ["contribution", "mine", "all"],
        queryFn: () => loadMine(ALL_COUNT),
        enabled: open,
        staleTime: 60_000,
        retry: false,
    });
    const items = recent.data ?? [];
    return (
        <div className="nl-profile-contribution__mine">
            <p className="nl-metadata nl-muted">
                {t("contribution.section.mine")}
            </p>
            {recent.isPending ? (
                <ProposalListSkeleton count={RECENT_COUNT} />
            ) : recent.isError ? (
                <ResultState
                    error
                    message={t("contribution.section.loadError")}
                />
            ) : items.length ? (
                <>
                    <ProposalList items={items.slice(0, RECENT_COUNT)} />
                    {items.length > RECENT_COUNT ? (
                        <ModalDialog
                            open={open}
                            onOpenChange={setOpen}
                            width="wide"
                            title={t("contribution.section.allTitle")}
                            trigger={
                                <Button variant="secondary" size="sm">
                                    {t("contribution.section.all")}
                                </Button>
                            }
                        >
                            {all.isPending ? (
                                <ProposalListSkeleton count={6} />
                            ) : all.isError ? (
                                <ResultState
                                    error
                                    message={t(
                                        "contribution.section.loadError"
                                    )}
                                />
                            ) : (
                                <ProposalList items={all.data ?? []} />
                            )}
                        </ModalDialog>
                    ) : null}
                </>
            ) : (
                <p className="nl-body-secondary nl-muted">
                    {t("contribution.section.mineEmpty")}
                </p>
            )}
        </div>
    );
}

/**
 * 프로필 「기여」 구역(2026-09-24 P1) — 넓은 화면은 오른쪽 열(기록 개요 · 최근 플레이 아래), 폰은 맨 아래.
 * 모두에게: 등급 · 점수 · 다음 등급까지 · 종류별 반영 수. 본인에게만: 내 제안(반려 사유 포함).
 * 남의 프로필에서 기여가 없으면 구역을 두지 않는다.
 */
export default function ProfileContribution({
    totals,
    isOwner,
}: {
    totals: ContributionTotals | undefined;
    isOwner: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const value = contributionLevel(totals?.points ?? 0);
    if (!value.level && !isOwner) return null;
    const progress = contributionProgress(value);
    return (
        <section
            id="profile-contribution"
            className="nl-profile-section nl-profile-contribution"
            aria-labelledby="profile-contribution-title"
        >
            <div className="nl-profile-section__header">
                <h2
                    id="profile-contribution-title"
                    className="nl-section-title"
                >
                    {t("contribution.section.title")}
                </h2>
            </div>
            <div className="nl-profile-contribution__card">
                {value.level ? (
                    <>
                        <div className="nl-profile-contribution__level">
                            <span className="nl-tag">
                                <span className="nl-contribution-label__prefix">
                                    {t("contribution.label.prefix")}
                                </span>
                                Lv.{value.level}
                            </span>
                            <span className="nl-metadata nl-muted nl-profile-contribution__number">
                                {t("contribution.label.points", {
                                    points: value.points.toLocaleString(locale),
                                })}{" "}
                                ·{" "}
                                {value.next === null
                                    ? t("contribution.section.max")
                                    : t("contribution.section.progress", {
                                          next: value.level + 1,
                                          remaining: (
                                              value.next - value.points
                                          ).toLocaleString(locale),
                                      })}
                            </span>
                        </div>
                        <div
                            className="nl-bar-list__track"
                            role="progressbar"
                            aria-label={t("contribution.section.progressAria")}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(progress * 100)}
                        >
                            <span
                                className="nl-bar-list__fill"
                                style={{ width: `${progress * 100}%` }}
                            />
                        </div>
                        <StatStrip
                            items={(
                                [
                                    "chart_field",
                                    "chart",
                                    "chart_comment",
                                    "arcade_report",
                                    "cabinet_check",
                                ] as const
                            ).map((kind) => ({
                                key: kind,
                                label: t(`contribution.section.kind.${kind}`),
                                value: (totals?.[kind] ?? 0).toLocaleString(
                                    locale
                                ),
                            }))}
                        />
                    </>
                ) : (
                    <>
                        <p className="nl-body-secondary">
                            {t("contribution.section.none")}
                        </p>
                        {isOwner ? (
                            <p className="nl-body-secondary nl-muted">
                                {t("contribution.section.hint")}
                            </p>
                        ) : null}
                    </>
                )}
            </div>
            {isOwner ? <MyProposals /> : null}
        </section>
    );
}
