"use client";

import { cn, formatToComma, formatToGrade } from "@/lib/utils";
import type { PeerScoreComparison } from "@/lib/music/peerScoreComparison";
import { formatScoreRecordDate } from "@/lib/music/scoreTrend";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { rankAssetNames } from "./musicDetailConfig";
import MusicJudgementAccordion from "./musicJudgementAccordion";
import RecentPlayRow from "./recentPlayRow";
import type {
    PerformanceTrendPoint,
    RecentChartPlay,
    ScoreTrendPoint,
    UserPlayData,
} from "./musicDetailTypes";
import ScoreTrend from "./scoreTrend";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";

interface MusicRecordTabProps {
    isLoggedIn: boolean;
    userPlayData: UserPlayData | null;
    recentChartPlays: RecentChartPlay[];
    scoreTrend: ScoreTrendPoint[];
    performanceTrend: PerformanceTrendPoint[];
    peerScoreComparison: PeerScoreComparison | null;
}

export default function MusicRecordTab({
    isLoggedIn,
    userPlayData,
    recentChartPlays,
    scoreTrend,
    performanceTrend,
    peerScoreComparison,
}: MusicRecordTabProps) {
    const locale = useLocale();
    const localizedHref = useLocalizedHref();
    const t = useTranslations();
    const [showPeerComparison, setShowPeerComparison] = useState(false);
    const scoreProgress = userPlayData
        ? Math.min(
              100,
              Math.max(0, ((userPlayData.score - 950000) / 50000) * 100)
          )
        : 0;
    const scoreToPerfect = userPlayData
        ? Math.max(0, 1000000 - userPlayData.score)
        : null;
    const peerScoreDifference =
        userPlayData && peerScoreComparison
            ? userPlayData.score - peerScoreComparison.averageScore
            : null;
    const cumulativeStats = [
        {
            label: t("music.record.play"),
            value: userPlayData?.play_count ?? null,
        },
        {
            label: t("music.record.maxCombo"),
            value: userPlayData?.max_combo ?? null,
        },
        {
            label: t("music.record.fullCombo"),
            value: userPlayData?.fullcombo_count ?? null,
        },
        {
            label: "Pianist",
            value: userPlayData?.pianistic_count ?? null,
        },
    ];

    return (
        <div className="relative">
            {!isLoggedIn ? (
                <div className="bg-surface/85 rounded-card absolute inset-0 z-10 flex items-start justify-center pt-12 backdrop-blur-[1px]">
                    <div className="bg-surface-muted border-border rounded-card flex flex-col items-center gap-3 border px-5 py-4 text-center">
                        <p className="text-text-primary text-sm font-semibold">
                            {t("music.record.loginRequired")}
                        </p>
                        <Link
                            href={localizedHref("/login")}
                            className="bg-text-primary text-bg rounded-card flex h-10 items-center justify-center px-4 text-sm font-bold"
                        >
                            {t("common.login")}
                        </Link>
                    </div>
                </div>
            ) : null}

            <div
                className={cn(
                    "flex flex-col gap-3",
                    !isLoggedIn && "pointer-events-none opacity-45"
                )}
                aria-hidden={!isLoggedIn || undefined}
            >
                <dl className="grid grid-cols-4 gap-2 text-center">
                    {cumulativeStats.map(({ label, value }) => (
                        <div
                            key={label}
                            className="bg-surface rounded-card flex min-h-17 min-w-0 flex-col items-center justify-center px-1 py-2.5"
                        >
                            <dt className="text-caption flex h-5 items-center justify-center whitespace-nowrap">
                                {label}
                            </dt>
                            <dd className="text-label mt-1 font-bold tabular-nums">
                                {value === null ? "-" : formatToComma(value)}
                            </dd>
                        </div>
                    ))}
                </dl>

                <section className="bg-surface rounded-card flex flex-col gap-4 p-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-surface-muted rounded-card flex size-14 shrink-0 items-center justify-center">
                            {userPlayData &&
                            rankAssetNames[userPlayData.rank] ? (
                                <Image
                                    src={`https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_${rankAssetNames[userPlayData.rank]}.png`}
                                    alt={t("music.record.rankLabel", {
                                        rank: userPlayData.rank,
                                    })}
                                    width={38}
                                    height={38}
                                />
                            ) : (
                                <span className="text-text-disabled text-xl font-black">
                                    -
                                </span>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-caption">
                                    {t("music.record.bestScore")}
                                </p>
                                {peerScoreComparison ? (
                                    <button
                                        aria-checked={showPeerComparison}
                                        className="focus-visible:ring-focus -my-2 flex min-h-11 shrink-0 items-center gap-1.5 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
                                        onClick={() =>
                                            setShowPeerComparison(
                                                (value) => !value
                                            )
                                        }
                                        role="switch"
                                        type="button"
                                    >
                                        <span className="text-micro whitespace-nowrap">
                                            {t("music.record.comparePeers")}
                                        </span>
                                        <span
                                            aria-hidden
                                            className={cn(
                                                "relative h-5 w-9 rounded-full transition-colors",
                                                showPeerComparison
                                                    ? "bg-chart"
                                                    : "bg-divider"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "bg-text-primary absolute top-0.5 left-0.5 size-4 rounded-full transition-transform",
                                                    showPeerComparison &&
                                                        "translate-x-4"
                                                )}
                                            />
                                        </span>
                                    </button>
                                ) : null}
                            </div>
                            <div className="flex items-center gap-2">
                                <strong className="text-score-display block truncate">
                                    {userPlayData
                                        ? formatToComma(userPlayData.score)
                                        : "-"}
                                </strong>
                                {userPlayData?.fc_type ? (
                                    <span className="border-rank-fc text-rank-fc rounded border px-1 py-0.5 text-[10px] leading-none font-black">
                                        FC
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-baseline justify-end gap-2">
                        <span className="text-caption">
                            {t("music.record.myGrade")}
                        </span>
                        <strong className="text-score text-xl font-black whitespace-nowrap tabular-nums">
                            Grd{" "}
                            {userPlayData
                                ? formatToGrade(userPlayData.grade_basic)
                                : "-"}
                        </strong>
                    </div>

                    <div>
                        <div className="bg-divider h-2 overflow-hidden rounded-full">
                            <div
                                className="bg-chart h-full rounded-full"
                                style={{ width: `${scoreProgress}%` }}
                            />
                        </div>
                        <div className="text-caption mt-1.5 flex items-center justify-between gap-3">
                            <span className="text-text-disabled truncate tabular-nums">
                                {userPlayData
                                    ? formatScoreRecordDate(
                                          userPlayData.besttime
                                      )
                                    : t("music.record.noRecord")}
                            </span>
                            <span className="text-text-secondary shrink-0 tabular-nums">
                                {t("music.record.toPianist")}{" "}
                                <strong
                                    className={cn(
                                        scoreToPerfect !== null &&
                                            "text-success"
                                    )}
                                >
                                    {scoreToPerfect === null
                                        ? "-"
                                        : scoreToPerfect === 0
                                          ? t("music.record.achieved")
                                          : t("music.record.points", {
                                                count: formatToComma(
                                                    scoreToPerfect
                                                ),
                                            })}
                                </strong>
                            </span>
                        </div>
                    </div>

                    {showPeerComparison &&
                    peerScoreComparison &&
                    peerScoreDifference !== null ? (
                        <div className="bg-surface-muted rounded-card flex items-center justify-between gap-3 p-3">
                            <div className="min-w-0">
                                <p className="text-caption">
                                    {t("music.record.peerAverage")}
                                </p>
                                <p className="text-micro mt-1 tabular-nums">
                                    {t("music.record.peerBasis", {
                                        range: peerScoreComparison.gradeRange,
                                        count: peerScoreComparison.sampleCount.toLocaleString(
                                            locale
                                        ),
                                    })}
                                </p>
                            </div>
                            <div className="shrink-0 text-right">
                                <strong className="text-label tabular-nums">
                                    {formatToComma(
                                        peerScoreComparison.averageScore
                                    )}
                                </strong>
                                <p
                                    className={cn(
                                        "text-micro mt-1 tabular-nums",
                                        peerScoreDifference > 0 &&
                                            "text-success"
                                    )}
                                >
                                    {peerScoreDifference === 0
                                        ? t("music.record.sameAsMine")
                                        : t("music.record.mineDifference", {
                                              difference: `${
                                                  peerScoreDifference > 0
                                                      ? "+"
                                                      : ""
                                              }${formatToComma(
                                                  peerScoreDifference
                                              )}`,
                                          })}
                                </p>
                            </div>
                        </div>
                    ) : null}

                    <div className="border-divider border-t pt-4">
                        <h2 className="text-section">
                            {t("music.record.scoreTrend")}
                        </h2>
                        <ScoreTrend
                            points={scoreTrend}
                            performancePoints={performanceTrend}
                            variant="score"
                        />
                    </div>
                </section>

                <MusicJudgementAccordion
                    userPlayData={userPlayData}
                    scoreTrend={scoreTrend}
                    performanceTrend={performanceTrend}
                    peerComparison={
                        showPeerComparison
                            ? (peerScoreComparison?.judgement ?? null)
                            : null
                    }
                    peerNoteRates={
                        showPeerComparison
                            ? (peerScoreComparison?.noteRates ?? null)
                            : null
                    }
                />

                <section className="bg-surface rounded-card overflow-hidden">
                    <h2 className="text-section bg-surface-muted px-4 py-3">
                        {t("music.record.recentPlays")}
                    </h2>
                    {recentChartPlays.length > 0 ? (
                        <ul className="divide-divider divide-y">
                            {[...recentChartPlays].reverse().map((play) => (
                                <RecentPlayRow key={play.id} play={play} />
                            ))}
                        </ul>
                    ) : (
                        <div className="text-text-disabled flex h-20 items-center justify-center text-sm">
                            {t("music.record.noRecentPlays")}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
