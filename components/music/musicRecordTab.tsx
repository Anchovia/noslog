import { cn, formatToComma, formatToGrade } from "@/lib/utils";
import { formatScoreRecordDate } from "@/lib/music/scoreTrend";
import Image from "next/image";
import Link from "next/link";
import JudgementBreakdown from "./judgementBreakdown";
import { rankAssetNames } from "./musicDetailConfig";
import RecentPlayRow from "./recentPlayRow";
import type {
    PerformanceTrendPoint,
    RecentChartPlay,
    ScoreTrendPoint,
    UserPlayData,
} from "./musicDetailTypes";
import ScoreTrend from "./scoreTrend";

interface MusicRecordTabProps {
    isLoggedIn: boolean;
    userPlayData: UserPlayData | null;
    recentChartPlays: RecentChartPlay[];
    scoreTrend: ScoreTrendPoint[];
    performanceTrend: PerformanceTrendPoint[];
}

export default function MusicRecordTab({
    isLoggedIn,
    userPlayData,
    recentChartPlays,
    scoreTrend,
    performanceTrend,
}: MusicRecordTabProps) {
    const scoreProgress = userPlayData
        ? Math.min(
              100,
              Math.max(0, ((userPlayData.score - 950000) / 50000) * 100)
          )
        : 0;
    const scoreToPerfect = userPlayData
        ? Math.max(0, 1000000 - userPlayData.score)
        : null;
    const cumulativeStats = [
        {
            label: "플레이",
            value: userPlayData?.play_count ?? null,
        },
        {
            label: "최대 콤보",
            value: userPlayData?.max_combo ?? null,
        },
        {
            label: "풀콤보",
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
                            로그인 후 내 기록을 확인할 수 있습니다.
                        </p>
                        <Link
                            href="/login"
                            className="bg-text-primary text-bg rounded-card flex h-10 items-center justify-center px-4 text-sm font-bold"
                        >
                            로그인
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
                                    alt={`${userPlayData.rank} 랭크`}
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
                            <p className="text-caption">베스트 스코어</p>
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
                        <span className="text-caption">내 그레이드</span>
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
                                    : "기록 없음"}
                            </span>
                            <span className="text-text-secondary shrink-0 tabular-nums">
                                Pianist까지{" "}
                                <strong
                                    className={cn(
                                        scoreToPerfect !== null &&
                                            "text-success"
                                    )}
                                >
                                    {scoreToPerfect === null
                                        ? "-"
                                        : scoreToPerfect === 0
                                          ? "달성"
                                          : `${formatToComma(scoreToPerfect)}점`}
                                </strong>
                            </span>
                        </div>
                    </div>
                </section>

                <section className="bg-surface rounded-card p-4">
                    <h2 className="text-section">판정 상세</h2>
                    <JudgementBreakdown
                        counts={{
                            judge_sjust: userPlayData?.judge_sjust ?? null,
                            judge_just: userPlayData?.judge_just ?? null,
                            judge_good: userPlayData?.judge_good ?? null,
                            judge_miss: userPlayData?.judge_miss ?? null,
                            judge_near: userPlayData?.judge_near ?? null,
                        }}
                        noteRates={{
                            note_rate_standard:
                                userPlayData?.note_rate_standard ?? null,
                            note_rate_tenuto:
                                userPlayData?.note_rate_tenuto ?? null,
                            note_rate_glissando:
                                userPlayData?.note_rate_glissando ?? null,
                            note_rate_trill:
                                userPlayData?.note_rate_trill ?? null,
                        }}
                    />
                </section>

                <section className="bg-surface rounded-card p-4">
                    <header>
                        <h2 className="text-section">스코어 추이</h2>
                    </header>
                    <ScoreTrend
                        points={scoreTrend}
                        performancePoints={performanceTrend}
                    />
                </section>

                <section className="bg-surface rounded-card overflow-hidden">
                    <h2 className="text-section bg-surface-muted px-4 py-3">
                        최근 플레이
                    </h2>
                    {recentChartPlays.length > 0 ? (
                        <ul className="divide-divider divide-y">
                            {[...recentChartPlays].reverse().map((play) => (
                                <RecentPlayRow key={play.id} play={play} />
                            ))}
                        </ul>
                    ) : (
                        <div className="text-text-disabled flex h-20 items-center justify-center text-sm">
                            최근 플레이 기록이 없습니다.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
