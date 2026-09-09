"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import { ScoreGrade } from "@/features/music/components/chartLeaderboard";
import JudgementMarker, {
    judgementLabels,
} from "@/components/ui/judgementMarker";
import type { ProfileUser } from "@/components/profile/dashboard/profileTypes";
import type { ProfileOverviewContext } from "@/features/profile/server/profileOverviewService";

export default function ProfileRecordOverview({
    user,
    judgement,
}: {
    user: ProfileUser;
    judgement: ProfileOverviewContext["judgement"];
}) {
    const locale = useLocale();
    const t = useTranslations();
    const [expanded, setExpanded] = useState(false);
    const [basisOpen, setBasisOpen] = useState(false);
    const rows = [
        { rank: "P", value: user.score_p },
        { rank: "S", value: user.score_s },
        { rank: "A+", value: user.score_a2 },
        { rank: "A", value: user.score_a },
        { rank: "B+", value: user.score_b2 },
        { rank: "B", value: user.score_b },
        { rank: "C", value: user.score_c },
        { rank: "D", value: user.score_d },
    ];
    const maximum = Math.max(1, ...rows.map((row) => row.value ?? 0));
    const countWidth = `${Math.max(...rows.map((row) => (row.value?.toLocaleString(locale) ?? "—").length))}ch`;
    const keys = Object.keys(
        judgementLabels
    ) as (keyof typeof judgementLabels)[];
    const total = Object.values(judgement.counts).reduce(
        (sum, value) => sum + value,
        0
    );
    return (
        <section
            className="nl-profile-section nl-profile-overview"
            aria-labelledby="profile-overview-title"
        >
            <h2 id="profile-overview-title" className="nl-section-title">
                {t("profile.recordOverview")}
            </h2>
            <h3 className="nl-control nl-muted">
                {t("profile.rankDistribution")}
            </h3>
            <dl
                id="profile-rank-distribution"
                className="nl-profile-distribution"
            >
                {(expanded ? rows : rows.slice(0, 4)).map((row) => (
                    <div key={row.rank}>
                        <dt>
                            <ScoreGrade rank={row.rank} />
                        </dt>
                        <dd
                            className="nl-profile-distribution__track"
                            aria-hidden
                        >
                            <span
                                style={{
                                    width: `${((row.value ?? 0) / maximum) * 100}%`,
                                }}
                            />
                        </dd>
                        <dd
                            className="nl-metric-value"
                            style={{ width: countWidth }}
                        >
                            {row.value?.toLocaleString(locale) ?? "—"}
                        </dd>
                    </div>
                ))}
            </dl>
            <button
                type="button"
                className="nl-profile-disclosure nl-control"
                aria-expanded={expanded}
                aria-controls="profile-rank-distribution"
                onClick={() => setExpanded((value) => !value)}
            >
                {t(expanded ? "profile.collapse" : "profile.showAllRanks")}
                <ChevronDown aria-hidden />
            </button>
            <div className="nl-profile-judgement-header">
                <h3 className="nl-control nl-muted">
                    {t("profile.judgementSummary")}
                </h3>
                <button
                    type="button"
                    className="nl-profile-judgement-basis nl-metadata nl-muted"
                    aria-expanded={basisOpen}
                    aria-controls="profile-judgement-basis"
                    onClick={() => setBasisOpen((value) => !value)}
                >
                    {t("profile.judgementChartCount", {
                        count: judgement.chartCount.toLocaleString(locale),
                    })}
                    <Info aria-hidden />
                </button>
            </div>
            {basisOpen ? (
                <p
                    id="profile-judgement-basis"
                    className="nl-body-secondary nl-muted"
                >
                    {t("profile.judgementBasis", {
                        count: judgement.chartCount.toLocaleString(locale),
                    })}
                </p>
            ) : null}
            {total > 0 ? (
                <>
                    <div className="nl-profile-judgement-stack" aria-hidden>
                        {keys.map((key) => (
                            <span
                                key={key}
                                data-judgement={key}
                                style={{
                                    width: `${(judgement.counts[key] / total) * 100}%`,
                                }}
                            />
                        ))}
                    </div>
                    <dl className="nl-profile-judgements">
                        {keys.map((key) => (
                            <div key={key}>
                                <dt>
                                    <JudgementMarker judgement={key} />
                                </dt>
                                <dd className="nl-metric-value">
                                    {judgement.counts[key].toLocaleString(
                                        locale
                                    )}
                                </dd>
                                <dd className="nl-body-secondary nl-muted">
                                    {(
                                        (judgement.counts[key] / total) *
                                        100
                                    ).toLocaleString(locale, {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 1,
                                    })}
                                    %
                                </dd>
                            </div>
                        ))}
                    </dl>
                </>
            ) : (
                <p className="nl-body-secondary nl-muted">
                    {t("profile.judgementEmpty")}
                </p>
            )}
            {user.play_count !== null && !user.hide_play_count ? (
                <dl className="nl-profile-play-count">
                    <dt className="nl-control nl-muted">
                        {t("profile.playCountLabel")}
                    </dt>
                    <dd className="nl-metric-value">
                        {user.play_count.toLocaleString(locale)}
                    </dd>
                </dl>
            ) : null}
        </section>
    );
}
