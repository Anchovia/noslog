import { cn, formatToComma, formatToGrade } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { rankAssetNames } from "./musicDetailConfig";
import type { RecentChartPlay, UserPlayData } from "./musicDetailTypes";
import ScoreTrend from "./scoreTrend";

interface MusicRecordTabProps {
    isLoggedIn: boolean;
    userPlayData: UserPlayData | null;
    recentChartPlays: RecentChartPlay[];
}

export default function MusicRecordTab({
    isLoggedIn,
    userPlayData,
    recentChartPlays,
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
                            className="bg-text-primary text-bg rounded-card flex h-9 items-center justify-center px-4 text-sm font-bold"
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
                                <strong className="text-text-primary block truncate text-3xl font-black tabular-nums">
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

                        <div className="text-right">
                            <p className="text-caption">내 그레이드</p>
                            <strong className="text-score text-xl font-black whitespace-nowrap tabular-nums">
                                Grd{" "}
                                {userPlayData
                                    ? formatToGrade(userPlayData.grade_basic)
                                    : "-"}
                            </strong>
                        </div>
                    </div>

                    <div>
                        <div className="bg-divider h-2 overflow-hidden rounded-full">
                            <div
                                className="bg-chart h-full rounded-full"
                                style={{ width: `${scoreProgress}%` }}
                            />
                        </div>
                        <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px]">
                            <span className="text-text-disabled truncate tabular-nums">
                                {userPlayData
                                    ? `S 950k · ${userPlayData.besttime.split(" ")[0].replaceAll("-", ".").replaceAll("/", ".")} 달성`
                                    : "기록 없음"}
                            </span>
                            <span className="text-score shrink-0 tabular-nums">
                                {scoreToPerfect === null
                                    ? "P(1000k)까지 -"
                                    : scoreToPerfect === 0
                                      ? "Perfect 달성"
                                      : `P(1000k)까지 -${formatToComma(scoreToPerfect)}`}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="bg-surface rounded-card p-4">
                    <h2 className="text-sm font-bold">판정 상세</h2>
                    <div className="text-text-disabled flex h-16 items-center justify-center text-sm">
                        판정 데이터가 제공되지 않습니다.
                    </div>
                </section>

                <dl className="grid grid-cols-4 gap-2 text-center">
                    {[
                        ["플레이", userPlayData?.play_count ?? "-"],
                        ["콤보", userPlayData?.max_combo ?? "-"],
                        ["풀콤보", userPlayData?.fullcombo_count ?? "-"],
                        ["Pianist", userPlayData?.pianistic_count ?? "-"],
                    ].map(([label, value]) => (
                        <div
                            key={label}
                            className="bg-surface rounded-card flex min-h-15 flex-col items-center justify-center px-1 py-3"
                        >
                            <dt className="text-text-secondary text-xs">
                                {label}
                            </dt>
                            <dd className="text-text-primary mt-1 text-sm font-bold tabular-nums">
                                {typeof value === "number"
                                    ? formatToComma(value)
                                    : value}
                            </dd>
                        </div>
                    ))}
                </dl>

                <section className="bg-surface rounded-card p-4">
                    <header className="flex items-center justify-between">
                        <h2 className="text-sm font-bold">스코어 추이</h2>
                        <span className="text-caption">최근 4회 갱신</span>
                    </header>
                    <ScoreTrend plays={recentChartPlays} />
                </section>

                <section className="bg-surface rounded-card overflow-hidden">
                    <h2 className="bg-surface-muted px-4 py-3 text-sm font-bold">
                        최근 플레이
                    </h2>
                    {recentChartPlays.length > 0 ? (
                        <ul className="divide-divider divide-y">
                            {[...recentChartPlays]
                                .reverse()
                                .map((play, index, plays) => {
                                    const previous = plays[index + 1];
                                    const difference = previous
                                        ? play.score - previous.score
                                        : null;
                                    const rankName =
                                        rankAssetNames[play.rank.toUpperCase()];

                                    return (
                                        <li
                                            key={play.id}
                                            className="flex h-11 items-center gap-3 px-4 text-sm"
                                        >
                                            <time className="text-text-disabled w-14 shrink-0 text-xs tabular-nums">
                                                {play.play_time
                                                    .split(" ")[0]
                                                    .replaceAll("/", ".")}
                                            </time>
                                            <strong className="text-text-primary tabular-nums">
                                                {formatToComma(play.score)}
                                            </strong>
                                            {rankName ? (
                                                <Image
                                                    src={`https://p.eagate.573.jp/game/nostalgia/op3/img/pdata/music_data/grade/grade_${rankName}.png`}
                                                    alt={`${play.rank} 랭크`}
                                                    width={20}
                                                    height={20}
                                                />
                                            ) : null}
                                            <span
                                                className={cn(
                                                    "ml-auto text-xs tabular-nums",
                                                    difference !== null &&
                                                        difference > 0
                                                        ? "text-success"
                                                        : "text-text-disabled"
                                                )}
                                            >
                                                {difference === null
                                                    ? "-"
                                                    : `${difference > 0 ? "+" : ""}${formatToComma(difference)}`}
                                            </span>
                                        </li>
                                    );
                                })}
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
