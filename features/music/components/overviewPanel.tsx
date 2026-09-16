"use client";

import { ChevronRight, Info } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useId, useState } from "react";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import type { MusicDetailProps } from "@/components/music/musicDetailTypes";
import ActionButton from "@/components/ui/actionButton";
import BarList from "@/components/ui/barList";
import ModalDialog from "@/components/ui/modalDialog";
import ResultState from "@/components/ui/resultState";
import StatStrip from "@/components/ui/statStrip";
import { rankTone, scoreTone } from "@/lib/music/scoreTone";
import { PATTERN_AXES } from "@/features/music/schemas/communitySchema";
import { communityPatternOptions } from "../api/community";
import TierHistory from "./tierHistory";

/**
 * 개요 탭 — ① 패턴 경향(가로 막대 5줄 · 제목 줄 오른쪽 「평가하기 ›」) ② 내 기록 요약 띠 ③ 채보 정보(값 있는 행만)
 * ④ 서열 변경 이력(접힘). 값이 없는 구역은 두지 않는다 (2026-09-16)
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
    const [helpOpen, setHelpOpen] = useState(false);
    const id = useId();
    const summary = pattern.data?.pattern;
    const evaluatorCount = summary
        ? Math.max(...PATTERN_AXES.map((axis) => summary[axis].count))
        : null;
    const record = data.userPlayData;
    const facts = [
        chart.bpm_min !== null
            ? {
                  label: "BPM",
                  value:
                      chart.bpm_max !== null && chart.bpm_max !== chart.bpm_min
                          ? `${chart.bpm_min}–${chart.bpm_max}`
                          : String(chart.bpm_min),
              }
            : null,
        chart.note_count !== null
            ? {
                  label: t("music.info.noteCount"),
                  value: chart.note_count.toLocaleString(locale),
              }
            : null,
        chart.duration_seconds !== null
            ? {
                  label: t("detail.duration"),
                  value: `${Math.floor(chart.duration_seconds / 60)}:${String(chart.duration_seconds % 60).padStart(2, "0")}`,
              }
            : null,
        chart.released_at
            ? {
                  label: t("music.info.releaseDate"),
                  value: chart.released_at.slice(0, 10),
              }
            : null,
        chart.unlock_condition
            ? { label: t("music.info.unlock"), value: chart.unlock_condition }
            : null,
    ].filter((fact): fact is { label: string; value: string } => Boolean(fact));
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
                    <ModalDialog
                        open={helpOpen}
                        onOpenChange={setHelpOpen}
                        title={t("pattern.criteria")}
                        trigger={
                            <button
                                type="button"
                                className="nl-info-trigger"
                                aria-label={t("pattern.criteria")}
                            >
                                <Info className="nl-icon-small" aria-hidden />
                            </button>
                        }
                    >
                        <p className="nl-body-secondary nl-muted">
                            {t("pattern.scale")}
                        </p>
                        <dl className="nl-pattern-help">
                            {PATTERN_AXES.map((axis) => (
                                <div key={axis}>
                                    <dt className="nl-control">
                                        {t(`pattern.axis.${axis}`)}
                                    </dt>
                                    <dd className="nl-body-secondary nl-muted">
                                        {t(`pattern.definition.${axis}`)}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </ModalDialog>
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
                                onClick={() => void pattern.refetch()}
                            >
                                {t("common.retry")}
                            </ActionButton>
                        }
                    />
                ) : (
                    <div
                        className="nl-overview__skeleton"
                        role="status"
                        aria-label={t("pattern.loading")}
                    />
                )}
            </section>

            <section
                className="nl-overview__section"
                aria-labelledby={`${id}-record`}
            >
                <h2 id={`${id}-record`} className="nl-section-title">
                    {t("detail.record")}
                </h2>
                {!data.isLoggedIn ? (
                    <p className="nl-body-secondary nl-muted">
                        {t("record.summaryGuest")}{" "}
                        <Link
                            className="nl-link"
                            href={href(
                                `/login?returnTo=${encodeURIComponent(href(`/music/${data.music.index}/${data.difficulty.toLowerCase()}`))}`
                            )}
                        >
                            {t("common.login")}
                        </Link>
                    </p>
                ) : !record || record.score <= 0 ? (
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
                            {
                                key: "rank",
                                label: t("rankings.myRank"),
                                value:
                                    data.ranking.userRank?.toLocaleString(
                                        locale
                                    ) ?? "—",
                                tone: rankTone(data.ranking.userRank),
                                unit: data.ranking.totalCount
                                    ? `/ ${data.ranking.totalCount.toLocaleString(locale)}`
                                    : undefined,
                            },
                            {
                                key: "plays",
                                label: t("record.playCount"),
                                value: record.play_count.toLocaleString(locale),
                            },
                        ]}
                    />
                )}
            </section>

            {facts.length ? (
                <section
                    className="nl-overview__section"
                    aria-labelledby={`${id}-facts`}
                >
                    <h2 id={`${id}-facts`} className="nl-section-title">
                        {t("detail.chartInfo")}
                    </h2>
                    <dl className="nl-facts nl-body-secondary nl-overview__card nl-overview__card--list">
                        {facts.map((fact) => (
                            <div key={fact.label}>
                                <dt>{fact.label}</dt>
                                <dd className="nl-metric-value">
                                    {fact.value}
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
