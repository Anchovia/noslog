"use client";

import { SkeletonText } from "@/components/ui/skeleton";
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

/**
 * 기록 줄 스켈레톤(2026-09-19 로딩 시안 S1) — 같은 줄 틀(64 높이 · 자켓 64 · 두 줄 그리드)에 자켓 · 이름 · 날짜 · 난이도 · 점수 · 등급 자리.
 * 기여(Grd · pt) 칸은 값을 모르면 두지 않는다
 */
function ProfilePlayRowSkeleton() {
    return (
        <li aria-hidden="true">
            <span className="nl-profile-play-row">
                <span className="nl-jacket nl-profile-play-row__jacket nl-skeleton" />
                <span className="nl-profile-play-row__identity">
                    <span className="nl-profile-play-row__title-line">
                        <SkeletonText className="nl-entity-title" width="m" />
                        <SkeletonText className="nl-metadata" width="s" />
                    </span>
                    {/* 둘째 줄 높이 = 가장 큰 요소인 점수(metric-value 20) */}
                    <span className="nl-profile-play-row__meta">
                        <SkeletonText className="nl-metric-value" width="m" />
                    </span>
                </span>
            </span>
        </li>
    );
}

/** 기록 목록 스켈레톤 — 실제 목록(`nl-profile-play-list`, 줄 사이 8)과 같은 틀 */
export function ProfilePlayListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <ol className="nl-profile-play-list" aria-hidden="true">
            {Array.from({ length: count }, (_, index) => (
                <ProfilePlayRowSkeleton key={index} />
            ))}
        </ol>
    );
}
