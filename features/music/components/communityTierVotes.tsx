"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { Fragment, useId, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import type { CommunityData } from "@/features/music/schemas/communitySchema";
import TierVoteDistribution from "./tierVoteDistribution";
import TierVoteContribution from "./tierVoteContribution";

export default function CommunityTierVotes({
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
    const params = useSearchParams();
    const [selected, setSelected] = useState<string | null>(() => {
        if (params.get("source") !== "tiers") return null;
        const requested = `${params.get("mode")}-${params.get("goal")}`;
        return data.scopes.some(
            (scope) => `${scope.mode}-${scope.goal}` === requested
        )
            ? requested
            : null;
    });
    const scopeLabel = (scope: CommunityData["scopes"][number]) =>
        scope.mode === "recital"
            ? "Recital"
            : `Basic · ${t(`community.goal.${scope.goal}`)}`;
    return (
        <section className="nl-community-votes" aria-labelledby={`${id}-title`}>
            {/* 탭 안 구역(패턴 투표 · 서열 투표 · 의견)은 모두 section-title */}
            {/* 로그아웃이면 제목 줄 오른쪽 끝에 「로그인하고 투표하기 ›」 — 개요 「평가하기 ›」 와 같은 제목 링크 (2026-09-16 D) */}
            <div className="nl-heading-row">
                <h2 id={`${id}-title`} className="nl-section-title">
                    {t("community.votes")}
                </h2>
                {!accountId ? (
                    <Link
                        className="nl-heading-link nl-control"
                        href={href(
                            `/login?returnTo=${encodeURIComponent(returnTo)}`
                        )}
                    >
                        {t("community.voteLoginLink")}
                        <ChevronRight aria-hidden />
                    </Link>
                ) : null}
            </div>
            {/* 여섯이 아닌 네 범위(Basic S · 990k · Pianist · Recital)를 카드 하나 안 선 목록으로 — 줄 = 컨트롤 높이 (2026-09-16) */}
            <div className="nl-vote-list">
                {data.scopes.map((scope) => {
                    const key = `${scope.mode}-${scope.goal}`;
                    // 펼칠 것 = 분포(3명 이상) 또는 내가 할 수 있는 투표 · 내 투표. 없으면 누르지 않는 줄(⌄ 없음)
                    const canVote = Boolean(
                        accountId && data.canEvaluate && scope.eligible
                    );
                    const expandable =
                        scope.average !== null ||
                        canVote ||
                        (Boolean(accountId) && scope.ownVote !== null);
                    const expanded = expandable && key === selected;
                    const Row = expandable ? "button" : "div";
                    return (
                        <Fragment key={key}>
                            <Row
                                {...(expandable
                                    ? {
                                          type: "button" as const,
                                          "aria-expanded": expanded,
                                          "aria-controls": `${id}-${key}-distribution`,
                                          onClick: () =>
                                              setSelected(
                                                  expanded ? null : key
                                              ),
                                      }
                                    : {})}
                                className="nl-vote-row"
                            >
                                <span
                                    className="nl-body-secondary nl-muted"
                                    lang="en"
                                >
                                    {scopeLabel(scope)}
                                </span>
                                <span>
                                    {scope.average === null ? (
                                        <span className="nl-metadata nl-muted">
                                            {t("pattern.aggregating")} ·{" "}
                                            {t("community.voteCount", {
                                                count: scope.count,
                                            })}
                                        </span>
                                    ) : (
                                        <>
                                            <span className="sr-only">
                                                {t("community.mean")}
                                            </span>
                                            <span className="nl-metric-value">
                                                {scope.average.toFixed(1)}
                                            </span>
                                            <span className="nl-metadata nl-muted">
                                                {t("community.voteCount", {
                                                    count: scope.count,
                                                })}
                                            </span>
                                        </>
                                    )}
                                    {expandable ? (
                                        <ChevronDown
                                            className="nl-icon nl-disclosure__chevron"
                                            aria-hidden
                                        />
                                    ) : null}
                                </span>
                            </Row>
                            {expanded ? (
                                <div
                                    id={`${id}-${key}-distribution`}
                                    className="nl-vote-list__body"
                                >
                                    {scope.average !== null ? (
                                        <TierVoteDistribution
                                            key={key}
                                            scope={scope}
                                        />
                                    ) : null}
                                    <TierVoteContribution
                                        key={`${key}-contribution`}
                                        chartId={chartId}
                                        scope={scope}
                                        accountId={accountId}
                                        hasRecord={data.canEvaluate}
                                    />
                                </div>
                            ) : null}
                        </Fragment>
                    );
                })}
            </div>
        </section>
    );
}
