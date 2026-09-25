"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import MusicJacket from "@/components/music/musicJacket";
import { ScoreGrade } from "@/features/music/components/chartLeaderboard";
import type { ProfilePinnedRecords } from "@/features/profile/server/profilePinnedService";

/**
 * 프로필 개요 「고정 기록」(2026-09-26 S2) — 옆 열 맨 위. 줄 = 자켓 48 · 곡 / 난이도 · 점수 · 등급 + FC / 한 줄 소감 · 오른쪽 곡 순위,
 * 위아래 12 · 구분선(v2 시안). 고르지 않았으면 베스트 상위 3곡(자동) — 고르기는 설정 「프로필」 탭
 */
export default function ProfilePinned({
    pinned,
}: {
    pinned: ProfilePinnedRecords;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const mode =
        useSearchParams().get("mode") === "recital" ? "recital" : "basic";
    if (!pinned.items.length) return null;
    return (
        <section
            className="nl-profile-section nl-profile-pinned"
            aria-labelledby="profile-pinned-title"
        >
            <h2 id="profile-pinned-title" className="nl-section-title">
                {t("profile.pinned.title")}
            </h2>
            <ol className="nl-profile-pinned__list">
                {pinned.items.map((play) => (
                    <li key={play.id}>
                        <Link
                            className="nl-profile-pinned__row"
                            href={href(
                                `/music/${play.musicIndex}/${play.difficulty.toLowerCase()}`
                            )}
                        >
                            <MusicJacket
                                index={play.musicIndex}
                                title={play.title}
                                background={play.background}
                                appearance="foundation"
                                className="nl-profile-pinned__jacket"
                            />
                            <span className="nl-profile-pinned__text">
                                <span
                                    className="nl-profile-pinned__title nl-entity-title"
                                    title={play.title}
                                >
                                    {play.title}
                                </span>
                                <span className="nl-profile-play-row__meta">
                                    <span
                                        className={`nl-metadata nl-level--${play.difficulty.toLowerCase()}`}
                                    >
                                        {play.difficulty.toUpperCase()}{" "}
                                        {play.level}
                                    </span>
                                    <span className="nl-metric-value">
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
                                {play.comment ? (
                                    <q className="nl-profile-pinned__comment nl-body-secondary nl-muted">
                                        {play.comment}
                                    </q>
                                ) : null}
                            </span>
                            {/* 오른쪽 = Grd(지금 모드) 위 · 곡 순위 아래 — 베스트 성과 폰 줄과 같은 자리(2026-09-26, 사용자) */}
                            <span className="nl-profile-pinned__side">
                                {play.grades[mode] !== null ? (
                                    <span className="nl-metric-value">
                                        {Math.round(
                                            play.grades[mode]!
                                        ).toLocaleString(locale)}{" "}
                                        Grd
                                    </span>
                                ) : null}
                                {play.chartRank !== null ? (
                                    <span className="nl-profile-pinned__rank nl-metadata nl-muted">
                                        <span className="sr-only">
                                            {t("profile.column.chartRank")}{" "}
                                        </span>
                                        {t("profile.pinned.chartRank", {
                                            rank: play.chartRank.toLocaleString(
                                                locale
                                            ),
                                        })}
                                    </span>
                                ) : null}
                            </span>
                        </Link>
                    </li>
                ))}
            </ol>
        </section>
    );
}
