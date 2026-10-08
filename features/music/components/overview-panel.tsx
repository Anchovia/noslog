"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Fragment, type ReactNode, useId } from "react";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import type { MusicDetailProps } from "@/components/music/music-detail-types";
import ActionButton from "@/components/ui/action-button";
import BarList, { BarListSkeleton } from "@/components/ui/bar-list";
import ResultState from "@/components/ui/result-state";
import { LoadingStatus } from "@/components/ui/skeleton";
import StatStrip from "@/components/ui/stat-strip";
import { myPendingChartFieldsOptions } from "@/features/contributions/api/chart-field-proposals";
import ChartFieldFactAction from "@/features/contributions/components/chart-field-fact-action";
import {
    type ChartFieldProposalField,
    chartFieldValue,
} from "@/features/contributions/schemas/chart-field-proposal-schema";
import { communityPatternOptions } from "@/features/music/api/community";
import { PATTERN_AXES } from "@/features/music/schemas/community-schema";
import { rankTone, scoreTone } from "@/lib/music/score-tone";

import PatternCriteriaDialog from "./pattern-criteria-dialog";
import TierHistory from "./tier-history";

/**
 * 개요 탭 — ① 패턴 경향(가로 막대 5줄 · 제목 줄 오른쪽 「평가하기 ›」) ② 내 기록 요약 띠 ③ 채보 정보
 * ④ 서열 변경 이력(접힘). 값이 없는 구역은 두지 않는다 (2026-09-16).
 * 채보 정보의 BPM · 노트 수 · 길이 · 수록일은 비어 있어도 줄을 두고 「추가」 로 기여를 받는다(2026-09-23)
 */
export default function OverviewPanel({
    data,
    onEvaluate,
}: {
    data: MusicDetailProps;
    onEvaluate: () => void;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const chart = data.chartDetail;
    const pattern = useQuery(communityPatternOptions(chart.id));
    const id = useId();
    const summary = pattern.data?.pattern;
    const evaluatorCount = summary
        ? Math.max(...PATTERN_AXES.map((axis) => summary[axis].count))
        : null;
    const record = data.userPlayData;
    const pendingOptions = myPendingChartFieldsOptions(
        chart.id,
        data.accountId
    );
    const pending = useQuery(pendingOptions).data;
    const loginHref = href(
        `/login?returnTo=${encodeURIComponent(
            href(`/music/${data.music.index}/${data.difficulty.toLowerCase()}`)
        )}`
    );
    const facts: ({
        label: string;
        value: ReactNode;
        numeric: boolean;
        field?: ChartFieldProposalField;
    } | null)[] = [
        {
            label: "BPM",
            numeric: true,
            field: "bpm",
            value:
                chart.bpm_min === null
                    ? null
                    : chart.bpm_max !== null && chart.bpm_max !== chart.bpm_min
                      ? `${chart.bpm_min}–${chart.bpm_max}`
                      : String(chart.bpm_min),
        },
        {
            label: t("music.info.noteCount"),
            numeric: true,
            field: "note_count",
            value: chart.note_count?.toLocaleString(locale) ?? null,
        },
        {
            label: t("detail.duration"),
            numeric: true,
            field: "duration",
            value:
                chart.duration_seconds === null
                    ? null
                    : `${Math.floor(chart.duration_seconds / 60)}:${String(chart.duration_seconds % 60).padStart(2, "0")}`,
        },
        {
            label: t("music.info.releaseDate"),
            numeric: false,
            field: "released_at",
            value: chart.released_at?.slice(0, 10) ?? null,
        },
        chart.unlockSteps.length
            ? {
                  label: t("music.info.unlock"),
                  numeric: false,
                  // 한 단계 = 한 줄: 「→」 옮겨 간 이벤트 · 이 난이도의 별가루 수 (2026-09-18)
                  value: chart.unlockSteps.map((step, index) => (
                      <Fragment key={index}>
                          {index ? <br /> : null}
                          {step.requires
                              ? t("music.info.unlockRequires", {
                                    title: step.requires.title,
                                    difficulty: step.requires.difficulty,
                                })
                              : `${step.moved ? "→ " : ""}${step.name}${
                                    step.stardust !== null
                                        ? ` · ${t("music.info.stardust", {
                                              count: step.stardust.toLocaleString(
                                                  locale
                                              ),
                                          })}`
                                        : ""
                                }`}
                      </Fragment>
                  )),
              }
            : null,
    ];
    const shownFacts = facts.filter((fact) => fact !== null);
    const sourced = new Set(chart.sourced_fields ?? []);
    return (
        <div className="nl-overview">
            <section
                className="nl-overview__section"
                aria-labelledby={`${id}-pattern`}
            >
                <div className="nl-heading-row">
                    <h2 id={`${id}-pattern`} className="nl-section-title">
                        {t("pattern.title")}
                    </h2>
                    <PatternCriteriaDialog />
                    {evaluatorCount !== null ? (
                        <span className="nl-metadata nl-muted">
                            {t("pattern.count", { count: evaluatorCount })}
                        </span>
                    ) : null}
                    <button
                        type="button"
                        className="nl-heading-link nl-control"
                        onClick={onEvaluate}
                    >
                        {t("pattern.evaluate")}
                        <ChevronRight aria-hidden />
                    </button>
                </div>
                {/* 집계가 없어도 빈 막대 그래프를 그대로 — 값 자리는 「—」 (2026-09-16) */}
                {summary ? (
                    <div className="nl-overview__card">
                        <BarList
                            max={4}
                            label={t("pattern.title")}
                            rows={PATTERN_AXES.map((axis) => ({
                                key: axis,
                                label: t(`pattern.axis.${axis}`),
                                value: summary[axis].average,
                                display: summary[axis].average?.toFixed(1),
                                // 평균의 가장 가까운 정수 단계 색 — 파랑 → 하늘 → 노랑 → 주황 → 빨강 (2026-09-17 E2)
                                color:
                                    summary[axis].average === null
                                        ? undefined
                                        : `var(--nl-pattern-level-${Math.round(summary[axis].average)})`,
                            }))}
                        />
                    </div>
                ) : pattern.isError ? (
                    <ResultState
                        error
                        message={t("detail.error")}
                        action={
                            <ActionButton
                                size="sm"
                                onClick={() => void pattern.refetch()}
                            >
                                {t("common.retry")}
                            </ActionButton>
                        }
                    />
                ) : (
                    // 불러오는 동안 — 같은 막대 목록 틀에 항목 이름은 실제 글자, 값 자리만 스켈레톤
                    <div className="nl-overview__card" aria-busy="true">
                        <LoadingStatus label={t("pattern.loading")} />
                        <BarListSkeleton
                            labels={PATTERN_AXES.map((axis) =>
                                t(`pattern.axis.${axis}`)
                            )}
                        />
                    </div>
                )}
            </section>

            <section
                className="nl-overview__section"
                aria-labelledby={`${id}-record`}
            >
                {/* 로그아웃이면 구역 행동을 제목 줄 오른쪽 끝 제목 링크로 권한다(가이드 2절 · 2026-09-18) */}
                <div className="nl-heading-row">
                    <h2 id={`${id}-record`} className="nl-section-title">
                        {t("detail.record")}
                    </h2>
                    {!data.isLoggedIn ? (
                        <Link
                            className="nl-heading-link nl-control"
                            href={href(
                                `/login?returnTo=${encodeURIComponent(href(`/music/${data.music.index}/${data.difficulty.toLowerCase()}`))}`
                            )}
                            aria-label={t("record.summaryGuest")}
                        >
                            {t("detail.myBestLogin")}
                            <ChevronRight aria-hidden />
                        </Link>
                    ) : null}
                </div>
                {!data.isLoggedIn ? null : !record || record.score <= 0 ? (
                    <p className="nl-body-secondary nl-muted">
                        {t("record.empty")}
                    </p>
                ) : (
                    <StatStrip
                        label={t("detail.record")}
                        items={[
                            {
                                key: "best",
                                label: t("music.record.bestScore"),
                                value: record.score.toLocaleString(locale),
                                tone: scoreTone(record.score),
                            },
                            // 순위가 없으면 칸을 만들지 않는다(수치 띠 규칙)
                            data.ranking.userRank
                                ? {
                                      key: "rank",
                                      label: t("rankings.myRank"),
                                      value: data.ranking.userRank.toLocaleString(
                                          locale
                                      ),
                                      tone: rankTone(data.ranking.userRank),
                                      unit: data.ranking.totalCount
                                          ? `/ ${data.ranking.totalCount.toLocaleString(locale)}`
                                          : undefined,
                                  }
                                : null,
                            {
                                key: "plays",
                                label: t("record.playCount"),
                                value: record.play_count.toLocaleString(locale),
                            },
                        ]}
                    />
                )}
            </section>

            {shownFacts.length ? (
                <section
                    className="nl-overview__section"
                    aria-labelledby={`${id}-facts`}
                >
                    <h2 id={`${id}-facts`} className="nl-section-title">
                        {t("detail.chartInfo")}
                    </h2>
                    {/* 면 없는 구분선 줄 목록(2026-09-28 인상 점검 A6 — 구역 제목이 이미 묶음, 줄 글자가 제목과 같은 선) */}
                    <dl className="nl-facts nl-body-secondary">
                        {shownFacts.map((fact) => (
                            <div key={fact.label}>
                                <dt>{fact.label}</dt>
                                <dd
                                    className={
                                        fact.numeric
                                            ? "nl-metric-value"
                                            : undefined
                                    }
                                >
                                    {fact.field ? (
                                        <span
                                            className="nl-facts__value"
                                            data-verified={
                                                fact.value === null ||
                                                sourced.has(fact.field)
                                                    ? undefined
                                                    : "false"
                                            }
                                        >
                                            {fact.value ?? (
                                                <span className="nl-facts__empty">
                                                    —
                                                </span>
                                            )}
                                            {/* 출처가 없는 값은 「확인 전」(2026-10-01 E2) — 추정값과 확인된 값을 구분한다 */}
                                            {fact.value !== null &&
                                            !sourced.has(fact.field) ? (
                                                <span className="nl-tag">
                                                    {t(
                                                        "contribution.unverified"
                                                    )}
                                                </span>
                                            ) : null}
                                            <ChartFieldFactAction
                                                chartId={chart.id}
                                                field={fact.field}
                                                fieldLabel={fact.label}
                                                currentValue={chartFieldValue(
                                                    chart,
                                                    fact.field
                                                )}
                                                pendingValue={
                                                    pending?.[fact.field]
                                                }
                                                signedIn={Boolean(
                                                    data.accountId
                                                )}
                                                loginHref={loginHref}
                                                queryKey={
                                                    pendingOptions.queryKey
                                                }
                                            />
                                        </span>
                                    ) : (
                                        fact.value
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            ) : null}

            <TierHistory history={chart.tierHistory} />
        </div>
    );
}
