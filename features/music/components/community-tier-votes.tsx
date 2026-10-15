"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment, useId, useState } from "react";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import Disclosure from "@/components/ui/disclosure";
import type { CommunityData } from "@/features/music/schemas/community-schema";

import TierVoteContribution from "./tier-vote-contribution";
import TierVoteDistribution from "./tier-vote-distribution";

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
        <Disclosure
            className="nl-community-votes"
            heading="section"
            open
            title={t("community.votes")}
            titleId={`${id}-title`}
        >
            {/* 제목 줄이 펼침 줄이 되면서 로그인 링크는 내용 첫 줄로 (2026-09-18 아코디언) */}
            {!accountId ? (
                <div className="nl-heading-row">
                    <Link
                        className="nl-heading-link nl-control"
                        href={href(
                            `/login?returnTo=${encodeURIComponent(returnTo)}`
                        )}
                    >
                        {t("community.voteLoginLink")}
                        <ChevronRight aria-hidden />
                    </Link>
                </div>
            ) : null}
            {/* 여섯이 아닌 네 범위(Basic S · 990k · Pianist · Recital)를 카드 하나 안 선 목록으로 — 줄 = 컨트롤 높이 (2026-09-16) */}
            <div className="nl-vote-list">
                {data.scopes.map((scope) => {
                    const key = `${scope.mode}-${scope.goal}`;
                    // 펼칠 것 = 분포(3명 이상) 또는 내가 할 수 있는 투표 · 내 투표. 없으면 누르지 않는 줄(⌄ 없음)
                    const canVote = Boolean(
                        accountId && data.canEvaluate && scope.eligible
                    );
                    // 투표할 수 없는 줄(분포 평균 · 내 투표 · 투표 자격 모두 없음)은 보통 줄 — 잠긴 폼 · 이유 문장 없음(2026-10-01 D3)
                    const hasOwnVote =
                        Boolean(accountId) && scope.ownVote !== null;
                    const expandable =
                        scope.average !== null || hasOwnVote || canVote;
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
                                        // 평균 없음 = 값 자리 「—」 + 인원, 사이는 가운뎃점 대신 간격 8 (2026-09-18 사용자 결정)
                                        <>
                                            <span className="sr-only">
                                                {t("community.mean")}
                                            </span>
                                            <span className="nl-metric-value nl-muted">
                                                —
                                            </span>
                                            <span className="nl-metadata nl-muted">
                                                {t("community.voteCount", {
                                                    count: scope.count,
                                                })}
                                            </span>
                                        </>
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
                                    {canVote || hasOwnVote ? (
                                        <TierVoteContribution
                                            key={`${key}-contribution`}
                                            chartId={chartId}
                                            scope={scope}
                                            accountId={accountId}
                                            hasRecord={data.canEvaluate}
                                        />
                                    ) : null}
                                </div>
                            ) : null}
                        </Fragment>
                    );
                })}
            </div>
        </Disclosure>
    );
}
