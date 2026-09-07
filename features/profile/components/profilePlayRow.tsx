"use client";

import Link from "next/link";
import { useLocale, useLocalizedHref } from "@/components/i18n/localeProvider";
import MusicJacket from "@/components/music/musicJacket";
import { ScoreGrade } from "@/features/music/components/chartLeaderboard";
import { formatProfilePlayTime } from "@/lib/profile/profilePlayTime";
import type {
    ProfileMetric,
    ProfilePlay,
} from "@/features/profile/schemas/publicProfileSchema";

export default function ProfilePlayRow({
    play,
    metric,
}: {
    play: ProfilePlay;
    metric: ProfileMetric;
}) {
    const locale = useLocale();
    const href = useLocalizedHref();
    const playedAt = formatProfilePlayTime(play.playedAt, locale);
    return (
        <li>
            <Link
                className="nl-profile-play-row"
                href={href(
                    `/music/${play.musicIndex}/${play.difficulty.toLowerCase()}`
                )}
            >
                <MusicJacket
                    index={play.musicIndex}
                    title={play.title}
                    background={play.background}
                    appearance="foundation"
                    className="nl-profile-play-row__jacket"
                >
                    {play.fullCombo ? (
                        <span className="nl-full-combo nl-metadata nl-profile-play-row__fc">
                            FC
                        </span>
                    ) : null}
                </MusicJacket>
                <span className="nl-profile-play-row__identity">
                    <span className="nl-profile-play-row__title-line">
                        <span className="nl-entity-title" title={play.title}>
                            {play.title}
                        </span>
                        {playedAt ? (
                            <time
                                className="nl-metadata nl-muted"
                                dateTime={playedAt.dateTime}
                            >
                                {playedAt.label}
                            </time>
                        ) : null}
                    </span>
                    <span className="nl-profile-play-row__meta">
                        <span
                            className={`nl-metadata nl-level--${play.difficulty.toLowerCase()}`}
                        >
                            {play.difficulty.toUpperCase()} {play.level}
                        </span>
                        <span className="nl-metric-value">
                            {play.score.toLocaleString(locale)}
                        </span>
                        <ScoreGrade rank={play.rank} />
                    </span>
                </span>
                {play.contribution !== null ? (
                    <span className="nl-metric-value nl-profile-play-row__contribution">
                        {Math.round(play.contribution).toLocaleString(locale)}{" "}
                        {metric === "grade" ? "Grd" : "pt"}
                    </span>
                ) : null}
            </Link>
        </li>
    );
}
