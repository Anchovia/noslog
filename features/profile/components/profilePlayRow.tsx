"use client";

import { SkeletonText } from "@/components/ui/skeleton";
import Link from "next/link";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import MusicJacket from "@/components/music/musicJacket";
import { ScoreGrade } from "@/features/music/components/chartLeaderboard";
import {
    formatProfilePlayTime,
    formatProfileRecordDate,
} from "@/lib/profile/profilePlayTime";
import type {
    ProfileMetric,
    ProfilePlay,
} from "@/features/profile/schemas/publicProfileSchema";

/**
 * 기록 줄(2026-09-25 B2) — 좁은 칸(폰)은 두 줄(자켓 44 · 곡 / 난이도 · 점수 · 등급 · 오른쪽 값), 넓은 칸은 열 고정 표 행
 * (베스트: 순번 · 자켓 36 · 곡 · 난이도 · 점수 · 등급 · 날짜 · Grd, 최근: 자켓 · 곡 · 난이도 · 점수 · 등급 · 플레이 시각).
 * 같은 마크업에 칸 폭(container query)만 다르다 — profile.css `nl-profile-play-row`
 */
export default function ProfilePlayRow({
    play,
    metric,
    position,
}: {
    play: ProfilePlay;
    metric: ProfileMetric;
    /** 베스트 순번을 보일지(베스트 목록) — 값은 서버가 준 베스트 안 순번(`play.position`) */
    position?: boolean;
}) {
    const locale = useLocale();
    const href = useLocalizedHref();
    const t = useTranslations();
    // 베스트 · 기록 탭 = 달성 날짜만, 최근 플레이 = 플레이 시각
    const playedAt =
        play.chartRank !== null || play.position !== null
            ? formatProfileRecordDate(play.playedAt, locale)
            : formatProfilePlayTime(play.playedAt, locale);
    return (
        <li>
            <Link
                className="nl-profile-play-row"
                href={href(
                    `/music/${play.musicIndex}/${play.difficulty.toLowerCase()}`
                )}
            >
                {position ? (
                    <span className="nl-profile-play-row__position nl-metadata nl-muted">
                        {play.position ?? ""}
                    </span>
                ) : null}
                <MusicJacket
                    index={play.musicIndex}
                    title={play.title}
                    background={play.background}
                    appearance="foundation"
                    className="nl-profile-play-row__jacket"
                />
                <span
                    className="nl-profile-play-row__title nl-entity-title"
                    title={play.title}
                >
                    {play.title}
                </span>
                <span className="nl-profile-play-row__meta">
                    <span
                        className={`nl-profile-play-row__difficulty nl-metadata nl-level--${play.difficulty.toLowerCase()}`}
                    >
                        {play.difficulty.toUpperCase()} {play.level}
                    </span>
                    <span className="nl-profile-play-row__score nl-metric-value">
                        {play.score.toLocaleString(locale)}
                    </span>
                    <span className="nl-profile-play-row__grade">
                        <ScoreGrade rank={play.rank} />
                        {play.fullCombo ? (
                            <span className="nl-full-combo nl-metadata">
                                {t("profile.fullComboShort")}
                            </span>
                        ) : null}
                    </span>
                </span>
                {play.chartRank !== null ? (
                    <span className="nl-profile-play-row__chart nl-metric-value nl-muted">
                        <span className="sr-only">
                            {t("profile.column.chartRank")}{" "}
                        </span>
                        #{play.chartRank.toLocaleString(locale)}
                    </span>
                ) : null}
                {playedAt ? (
                    <time
                        className="nl-profile-play-row__time nl-metadata nl-muted"
                        dateTime={playedAt.dateTime}
                    >
                        {playedAt.label}
                    </time>
                ) : null}
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

/** 표 머리(넓은 칸에서만 보인다) — 줄마다 글자가 스스로 설명해 화면 읽기에는 숨긴다 */
export function ProfilePlayListHead({
    kind,
    metric,
}: {
    /** best = 순번 · 곡 순위 · 날짜 · 값, all = 순번 없이, recent = 플레이 시각까지 */
    kind: "best" | "all" | "recent";
    metric: ProfileMetric;
}) {
    const t = useTranslations();
    const record = kind !== "recent";
    return (
        <div
            className="nl-profile-play-head nl-metadata nl-muted"
            aria-hidden="true"
        >
            {kind === "best" ? (
                <span className="nl-profile-play-row__position">#</span>
            ) : null}
            <span className="nl-profile-play-head__song">
                {t("profile.column.song")}
            </span>
            <span className="nl-profile-play-row__difficulty">
                {t("profile.column.difficulty")}
            </span>
            <span className="nl-profile-play-row__score">
                {t("profile.column.score")}
            </span>
            <span className="nl-profile-play-row__grade">
                {t("profile.column.rank")}
            </span>
            {record ? (
                <span className="nl-profile-play-row__chart">
                    {t("profile.column.chartRank")}
                </span>
            ) : null}
            <span className="nl-profile-play-row__time">
                {t(record ? "profile.column.date" : "profile.column.playedAt")}
            </span>
            {record ? (
                <span className="nl-profile-play-row__contribution">
                    {metric === "grade" ? "Grd" : "pt"}
                </span>
            ) : null}
        </div>
    );
}

/**
 * 기록 줄 스켈레톤(2026-09-19 로딩 시안 S1) — 같은 줄 틀에 자켓 · 이름 · 점수 자리. 값(Grd · pt) · 날짜 칸은 모르면 두지 않는다
 */
function ProfilePlayRowSkeleton() {
    return (
        <li aria-hidden="true">
            <span className="nl-profile-play-row">
                <span className="nl-jacket nl-profile-play-row__jacket nl-skeleton" />
                <SkeletonText
                    className="nl-profile-play-row__title nl-entity-title"
                    width="m"
                />
                <span className="nl-profile-play-row__meta">
                    <SkeletonText className="nl-metric-value" width="m" />
                </span>
            </span>
        </li>
    );
}

/** 기록 목록 스켈레톤 — 실제 목록(`nl-profile-play-list`, 구분선 줄)과 같은 틀 */
export function ProfilePlayListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <ol className="nl-profile-play-list" aria-hidden="true">
            {Array.from({ length: count }, (_, index) => (
                <ProfilePlayRowSkeleton key={index} />
            ))}
        </ol>
    );
}
