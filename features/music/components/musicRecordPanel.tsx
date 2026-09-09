"use client";

import Link from "next/link";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import type { MusicDetailProps } from "@/components/music/musicDetailTypes";
import JudgementAnalysis from "./judgementAnalysis";
import RecentRecordPlay from "./recentRecordPlay";
import { foundationButtonClass } from "@/components/ui/Button";
import MetricSummary from "@/components/ui/metricSummary";
import ScoreImprovementChart from "./scoreImprovementChart";

export default function MusicRecordPanel({ data }: { data: MusicDetailProps }) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const record = data.userPlayData;
    if (!data.isLoggedIn)
        return (
            <div className="nl-record-state">
                <p className="nl-body">{t("record.guest")}</p>
                <Link
                    className={foundationButtonClass({ variant: "primary" })}
                    href={href(
                        `/login?returnTo=${encodeURIComponent(href(`/music/${data.music.index}/${data.difficulty.toLowerCase()}?tab=record`))}`
                    )}
                >
                    {t("common.login")}
                </Link>
            </div>
        );
    if (!record || record.score <= 0)
        return (
            <div className="nl-record-state">
                <p className="nl-body">{t("record.empty")}</p>
            </div>
        );
    const count = (value: number) => value.toLocaleString(locale);
    const cumulative = [
        {
            label: t("record.playCount"),
            value: record.play_count,
            unit: t("record.times"),
        },
        { label: t("music.record.maxCombo"), value: record.max_combo },
        {
            label: t("music.record.fullCombo"),
            value: record.fullcombo_count,
            unit: t("record.times"),
        },
        {
            label: "Pianist",
            value: record.pianistic_count,
            unit: t("record.times"),
        },
    ];
    return (
        <div className="nl-record-panel">
            <div className="nl-detail-columns">
                <section className="nl-detail-panel">
                    <h2 className="nl-section-title">{t("record.best")}</h2>
                    <dl>
                        <MetricSummary
                            prominent
                            label={t("music.record.bestScore")}
                            value={count(record.score)}
                            unit={t("record.pointsUnit")}
                            description={record.besttime}
                        />
                    </dl>
                </section>
                <section className="nl-detail-panel">
                    <h2 className="nl-section-title">
                        {t("record.cumulative")}
                    </h2>
                    <dl className="nl-record-metrics">
                        {cumulative.map((metric) => (
                            <MetricSummary
                                key={metric.label}
                                label={metric.label}
                                value={count(metric.value)}
                                unit={metric.unit}
                            />
                        ))}
                    </dl>
                </section>
            </div>
            <div className="nl-detail-columns">
                <section className="nl-detail-panel">
                    <h2 className="nl-section-title">{t("record.progress")}</h2>
                    <ScoreImprovementChart points={data.scoreTrend} />
                </section>
                <section className="nl-detail-panel">
                    <h2 className="nl-section-title">
                        {t("music.record.recentPlays")}
                    </h2>
                    {data.recentChartPlays.length ? (
                        <ul className="nl-recent-plays">
                            {[...data.recentChartPlays]
                                .reverse()
                                .map((play) => (
                                    <RecentRecordPlay
                                        key={play.id}
                                        play={play}
                                    />
                                ))}
                        </ul>
                    ) : (
                        <p className="nl-body-secondary nl-muted">
                            {t("music.record.noRecentPlays")}
                        </p>
                    )}
                </section>
            </div>
            <JudgementAnalysis data={data} />
        </div>
    );
}
