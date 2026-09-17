"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { Fragment, useId, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import Disclosure from "@/components/ui/disclosure";
import { foundationButtonClass } from "@/components/ui/Button";
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
                    // 모든 줄을 펼칠 수 있게 — 줄마다 ⌄ 자리가 같아야 값이 밀리지 않는다.
                    // 투표할 수 없는 줄은 펼치면 패턴 투표처럼 흐린 폼 + 이유 카드 (2026-09-18 사용자 결정)
                    const expandable = true;
                    const lockReason = !canVote
                        ? scope.mode === "recital"
                            ? "community.voteLock.recital"
                            : scope.goal === "990k"
                              ? "community.voteLock.990k"
                              : scope.goal === "pianist"
                                ? "community.voteLock.pianist"
                                : !accountId
                                  ? "community.evaluationLogin"
                                  : "community.evaluationRecord"
                        : null;
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
                                    {lockReason && scope.ownVote === null ? (
                                        // 투표할 수 없으면 값 · 저장을 비활성으로 두고 이유를 한 줄로 (2026-09-18 사용자 결정)
                                        <div className="nl-vote-form">
                                            <div className="nl-vote-form__row">
                                                <button
                                                    type="button"
                                                    className="nl-input nl-select"
                                                    data-placeholder
                                                    disabled
                                                >
                                                    <span>
                                                        {t(
                                                            "community.valuePlaceholder"
                                                        )}
                                                    </span>
                                                    <ChevronDown
                                                        className="nl-icon"
                                                        aria-hidden
                                                    />
                                                </button>
                                                <button
                                                    type="button"
                                                    className={foundationButtonClass(
                                                        {
                                                            variant: "primary",
                                                            size: "sm",
                                                        }
                                                    )}
                                                    disabled
                                                >
                                                    {t("community.saveVote")}
                                                </button>
                                            </div>
                                            <p className="nl-body-secondary nl-muted">
                                                {t(lockReason)}
                                            </p>
                                        </div>
                                    ) : (
                                        <TierVoteContribution
                                            key={`${key}-contribution`}
                                            chartId={chartId}
                                            scope={scope}
                                            accountId={accountId}
                                            hasRecord={data.canEvaluate}
                                        />
                                    )}
                                </div>
                            ) : null}
                        </Fragment>
                    );
                })}
            </div>
        </Disclosure>
    );
}
