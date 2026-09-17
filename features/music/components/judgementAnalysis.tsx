"use client";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import type { MessageKey } from "@/components/i18n/localeProvider";
import type { MusicDetailProps } from "@/components/music/musicDetailTypes";
import Disclosure from "@/components/ui/disclosure";
import StackedBar from "@/components/ui/stackedBar";
import { judgementLabels as marks } from "@/components/ui/judgementMarker";
import {
    peerJudgementKeys,
    peerNoteRateKeys,
} from "@/lib/music/peerScoreComparison";
import PerformanceChart from "./performanceChart";

// 악곡 상세 판정 표시는 NEAR 를 뺀다 — 게임에서 거의 켜지 않는 옵션(2026-09-18 사용자 결정). 합계에는 그대로 넣는다
const shownKeys = peerJudgementKeys.filter((key) => key !== "judge_near");
const judgementLabels: Record<(typeof shownKeys)[number], string> = {
    judge_sjust: marks.sjust,
    judge_just: marks.just,
    judge_good: marks.good,
    judge_miss: marks.miss,
};
const judgementColors = {
    judge_sjust: "var(--nl-judgement-s-just)",
    judge_just: "var(--nl-judgement-just)",
    judge_good: "var(--nl-judgement-good)",
    judge_miss: "var(--nl-judgement-miss)",
} as const;
// 값이 없는 줄 — 비어 보이지 않게 비활성 회색 한 조각
const emptySegments = [
    { key: "empty", value: 1, color: "var(--nl-content-disabled)" },
];
const noteLabels: MessageKey[] = [
    "music.filter.standard",
    "music.filter.tenuto",
    "music.filter.glissando",
    "music.filter.trill",
];

export default function JudgementAnalysis({
    data,
}: {
    data: MusicDetailProps;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const record = data.userPlayData;
    if (!record) return null;
    // 유사 Grd 평균은 켜기 없이 늘 보여 주고, 비교할 기록이 없으면 평균 줄 자체를 그리지 않는다 (2026-09-16 A)
    const peer = data.peerScoreComparison;
    const complete = shownKeys.every((key) => record[key] !== null);
    const total = complete
        ? peerJudgementKeys.reduce((sum, key) => sum + (record[key] ?? 0), 0)
        : null;
    const count = (value: number) => value.toLocaleString(locale);
    const percentage = (value: number | null) =>
        value === null
            ? "—"
            : `${value.toLocaleString(locale, { maximumFractionDigits: 1 })}%`;
    const noteRate = (value: number | null) =>
        value === null
            ? "—"
            : `${(value / 100).toLocaleString(locale, { maximumFractionDigits: 2 })}%`;
    return (
        <Disclosure
            title={t("record.analysis")}
            heading="section"
            className="nl-record-analysis"
            // 기록 탭에서 가장 먼저 보는 구역이라 기본으로 펼친다 (2026-09-17)
            open
        >
            <div className="nl-analysis-content">
                {/* 요약 = 나 · 평균 누적 막대 두 줄. 값이 없는 줄은 비활성 회색으로 채운 한 줄 (2026-09-16) */}
                <section className="nl-detail-panel">
                    <div className="nl-heading-row">
                        <h3 className="nl-component-title">
                            {t("music.judgement.summary")}
                        </h3>
                        {peer?.judgement ? (
                            <span className="nl-metadata nl-muted nl-heading-row__end">
                                {t("music.judgement.peerBasis", {
                                    count: count(peer.judgement.sampleCount),
                                })}
                            </span>
                        ) : null}
                    </div>
                    <StackedBar
                        rows={[
                            {
                                key: "me",
                                label: t("music.judgement.meLabel"),
                                segments: complete
                                    ? shownKeys.map((key) => ({
                                          key,
                                          value: record[key]!,
                                          color: judgementColors[key],
                                      }))
                                    : emptySegments,
                            },
                            {
                                key: "average",
                                label: t("community.mean"),
                                segments: peer?.judgement
                                    ? shownKeys.map((key) => ({
                                          key,
                                          value: peer.judgement!.averages[key],
                                          color: judgementColors[key],
                                      }))
                                    : emptySegments,
                            },
                        ]}
                    />
                </section>
                <div className="nl-detail-columns">
                    <section className="nl-detail-panel">
                        <h3 className="nl-component-title">
                            {t("music.recent.judgement")}
                        </h3>
                        {complete ? null : (
                            <p className="nl-body-secondary nl-muted">
                                {t("music.judgement.syncRequired")}
                            </p>
                        )}
                        <dl className="nl-facts nl-analysis-values nl-body-secondary">
                            {shownKeys.map((key) => (
                                <div key={key}>
                                    <dt>
                                        <span
                                            className="nl-judgement-label"
                                            data-judgement={key}
                                        >
                                            {judgementLabels[key]}
                                        </span>
                                    </dt>
                                    <dd>
                                        <span className="nl-inline">
                                            <span className="nl-metric-value">
                                                {record[key]?.toLocaleString(
                                                    locale
                                                ) ?? "—"}
                                            </span>
                                            <span className="nl-metric-value nl-muted">
                                                {percentage(
                                                    total &&
                                                        record[key] !== null
                                                        ? (record[key] /
                                                              total) *
                                                              100
                                                        : null
                                                )}
                                            </span>
                                        </span>
                                        {peer?.judgement ? (
                                            <span className="nl-metadata nl-muted">
                                                {t("music.judgement.average", {
                                                    value: percentage(
                                                        peer.judgement.averages[
                                                            key
                                                        ]
                                                    ),
                                                })}
                                            </span>
                                        ) : null}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                    <section className="nl-detail-panel">
                        <h3 className="nl-component-title">
                            {t("music.judgement.noteSuccess")}
                        </h3>
                        <dl className="nl-facts nl-analysis-values nl-body-secondary">
                            {peerNoteRateKeys.map((key, index) => {
                                const average =
                                    peer?.noteRates.averages[key] ?? null;
                                return (
                                    <div key={key}>
                                        <dt>{t(noteLabels[index])}</dt>
                                        <dd>
                                            <span className="nl-metric-value">
                                                {noteRate(record[key])}
                                            </span>
                                            {peer && average !== null ? (
                                                <span className="nl-metadata nl-muted">
                                                    {t(
                                                        "music.judgement.average",
                                                        {
                                                            value: noteRate(
                                                                average
                                                            ),
                                                        }
                                                    )}
                                                    {` · ${t("music.info.players", { count: count(peer.noteRates.sampleCounts[key]) })}`}
                                                </span>
                                            ) : null}
                                        </dd>
                                    </div>
                                );
                            })}
                        </dl>
                    </section>
                </div>
                <section className="nl-detail-panel">
                    <h3 className="nl-component-title">
                        {t("music.judgement.recentTrend")}
                    </h3>
                    <PerformanceChart points={data.performanceTrend} />
                </section>
            </div>
        </Disclosure>
    );
}
