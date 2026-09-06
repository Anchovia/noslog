"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import type { MessageKey } from "@/components/i18n/localeProvider";
import type { MusicDetailProps } from "@/components/music/musicDetailTypes";
import { Checkbox } from "@/components/ui/checkbox";
import Disclosure from "@/components/ui/disclosure";
import {
    peerJudgementKeys,
    peerNoteRateKeys,
} from "@/lib/music/peerScoreComparison";
import PerformanceChart from "./performanceChart";

const judgementLabels = ["S-Just", "Just", "Good", "Miss", "Near"];
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
    const [compare, setCompare] = useState(false);
    const record = data.userPlayData;
    if (!record) return null;
    const peer = compare ? data.peerScoreComparison : null;
    const complete = peerJudgementKeys.every((key) => record[key] !== null);
    const total = complete
        ? peerJudgementKeys.reduce((sum, key) => sum + record[key]!, 0)
        : null;
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
        >
            <div className="nl-analysis-content">
                <div className="nl-stack">
                    <Checkbox
                        label={t("record.compare")}
                        checked={compare}
                        onChange={(event) => setCompare(event.target.checked)}
                    />
                    {compare ? (
                        <p className="nl-body-secondary nl-muted">
                            {peer
                                ? t("record.peerBasis", {
                                      range: peer.gradeRange,
                                      count: peer.sampleCount.toLocaleString(
                                          locale
                                      ),
                                  })
                                : t("record.peerUnavailable")}
                        </p>
                    ) : null}
                </div>
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
                            {peerJudgementKeys.map((key, index) => (
                                <div key={key}>
                                    <dt>
                                        <span
                                            className="nl-judgement-label"
                                            data-judgement={key}
                                        >
                                            {judgementLabels[index]}
                                        </span>
                                    </dt>
                                    <dd>
                                        <span className="nl-inline">
                                            <span className="nl-metric-value">
                                                {record[key]?.toLocaleString(
                                                    locale
                                                ) ?? "—"}
                                            </span>
                                            <span className="nl-muted">
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
                                        {compare ? (
                                            <span className="nl-metadata nl-muted">
                                                {t("music.judgement.average", {
                                                    value: percentage(
                                                        peer?.judgement
                                                            ?.averages[key] ??
                                                            null
                                                    ),
                                                })}
                                            </span>
                                        ) : null}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                        {peer?.judgement ? (
                            <p className="nl-metadata nl-muted">
                                {t("music.judgement.peerBasis", {
                                    count: peer.judgement.sampleCount.toLocaleString(
                                        locale
                                    ),
                                })}
                            </p>
                        ) : null}
                    </section>
                    <section className="nl-detail-panel">
                        <h3 className="nl-component-title">
                            {t("music.judgement.noteSuccess")}
                        </h3>
                        <dl className="nl-facts nl-analysis-values nl-body-secondary">
                            {peerNoteRateKeys.map((key, index) => (
                                <div key={key}>
                                    <dt>{t(noteLabels[index])}</dt>
                                    <dd>
                                        <span className="nl-metric-value">
                                            {noteRate(record[key])}
                                        </span>
                                        {compare ? (
                                            <span className="nl-metadata nl-muted">
                                                {t("music.judgement.average", {
                                                    value: noteRate(
                                                        peer?.noteRates
                                                            .averages[key] ??
                                                            null
                                                    ),
                                                })}
                                                {peer
                                                    ? ` · ${t("music.info.players", { count: peer.noteRates.sampleCounts[key].toLocaleString(locale) })}`
                                                    : ""}
                                            </span>
                                        ) : null}
                                    </dd>
                                </div>
                            ))}
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
