"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import MusicJacket from "@/components/music/musicJacket";
import { serializeTierBrowserQuery } from "@/features/tiers/schemas/tierBrowserSchema";
import type {
    TierBrowserEntry,
    TierBrowserQuery,
} from "@/features/tiers/schemas/tierBrowserSchema";

const ranks: Record<string, string> = {
    P: "p",
    S: "s",
    "A+": "a2",
    A: "a",
    "B+": "b2",
    B: "b",
    C: "c",
    D: "d",
};

export default function TierBrowserCard({
    entry,
    query,
    signedIn,
    pending,
}: {
    entry: TierBrowserEntry;
    query: TierBrowserQuery;
    signedIn: boolean;
    pending: boolean;
}) {
    const locale = useLocale();
    const href = useLocalizedHref();
    const t = useTranslations();
    const { chart, record } = entry;
    const pianist = Boolean(
        record && (record.fc_type === 3 || record.score >= 1_000_000)
    );
    const fc = Boolean(record && record.fc_type >= 2 && !pianist);
    const rank = record
        ? pianist
            ? "p"
            : ranks[record.rank.toUpperCase()]
        : undefined;
    const score = record
        ? record.score.toLocaleString(locale)
        : t("tiers.unplayed");
    const params = new URLSearchParams({
        tab: "tier",
        source: "tiers",
        mode: query.mode,
        goal: query.goal,
        returnTo: href(`/tiers?${serializeTierBrowserQuery(query)}`),
    });
    return (
        <Link
            className="nl-tier-card"
            data-detailed={query.detailed}
            aria-disabled={pending || undefined}
            tabIndex={pending ? -1 : undefined}
            href={href(
                `/music/${encodeURIComponent(chart.music.index)}/${chart.difficulty.toLowerCase()}?${params}`
            )}
            aria-label={`${chart.music.title} · ${chart.difficulty} ${chart.level} · ${t("detail.tier")}${signedIn ? ` · ${score}${pianist ? " · Pianist" : fc ? " · Full Combo" : ""}` : ""}`}
            onClick={(event) => {
                if (pending) event.preventDefault();
            }}
        >
            <MusicJacket
                appearance="foundation"
                {...chart.music}
                className="nl-tier-card__jacket"
            >
                <span
                    className="nl-tier-card__outline"
                    data-achievement={
                        pianist ? "pianist" : fc ? "fc" : undefined
                    }
                    aria-hidden
                />
                {signedIn && rank ? (
                    <img
                        className="nl-tier-card__rank"
                        src={`/grade/grade_${rank}.png`}
                        alt=""
                    />
                ) : null}
                {signedIn && query.detailed ? (
                    <span className="nl-tier-card__score-band nl-metric-value">
                        {fc ? <span>FC</span> : null}
                        <span>{score}</span>
                    </span>
                ) : null}
            </MusicJacket>
            {signedIn && !query.detailed ? (
                <span className="nl-tier-card__score nl-metric-value">
                    {fc ? <span>FC</span> : null}
                    <span>{score}</span>
                </span>
            ) : null}
            {query.detailed ? (
                <>
                    <span className="nl-component-title">
                        {chart.music.title}
                    </span>
                    {chart.music.localizedTitle ? (
                        <span className="nl-metadata nl-muted">
                            {chart.music.localizedTitle}
                        </span>
                    ) : null}
                    <span className="nl-body-secondary nl-muted">
                        {chart.difficulty} {chart.level}
                    </span>
                    {signedIn &&
                    record?.grade !== null &&
                    record?.grade !== undefined ? (
                        <span className="nl-control nl-muted">
                            {t("rankings.metric.grade")} +
                            {record.grade.toLocaleString(locale, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    ) : null}
                    {signedIn &&
                    record?.rating !== null &&
                    record?.rating !== undefined ? (
                        <span className="nl-control nl-muted">
                            {t("rankings.metric.rating")} +
                            {record.rating.toLocaleString(locale, {
                                minimumFractionDigits: 1,
                                maximumFractionDigits: 1,
                            })}
                        </span>
                    ) : null}
                </>
            ) : null}
        </Link>
    );
}
