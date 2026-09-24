"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useId, type ReactNode } from "react";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import type { MusicDetailProps } from "@/components/music/musicDetailTypes";
import ActionButton from "@/components/ui/actionButton";
import BarList, { BarListSkeleton } from "@/components/ui/barList";
import { LoadingStatus } from "@/components/ui/skeleton";
import ResultState from "@/components/ui/resultState";
import StatStrip from "@/components/ui/statStrip";
import { rankTone, scoreTone } from "@/lib/music/scoreTone";
import { PATTERN_AXES } from "@/features/music/schemas/communitySchema";
import { myPendingChartFieldsOptions } from "@/features/contributions/api/chartFieldProposals";
import ChartFieldFactAction from "@/features/contributions/components/chartFieldFactAction";
import {
    chartFieldValue,
    type ChartFieldProposalField,
} from "@/features/contributions/schemas/chartFieldProposalSchema";
import { communityPatternOptions } from "../api/community";
import PatternCriteriaDialog from "./patternCriteriaDialog";
import TierHistory from "./tierHistory";

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
                    <dl className="nl-facts nl-body-secondary nl-overview__card nl-overview__card--list">
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
                                        <span className="nl-facts__value">
                                            {fact.value ?? (
                                                <span className="nl-facts__empty">
                                                    —
                                                </span>
                                            )}
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
