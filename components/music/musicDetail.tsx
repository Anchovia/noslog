import { cn, formatToComma, formatToGrade } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Play, ScanSearch } from "lucide-react";
import MusicRankTable from "./musicRankTable";
import MusicTierVote from "./musicTierVote";
import PatternProfileChart from "./patternProfileChart";
import ScoreTrend from "./scoreTrend";

type Difficulty = "Normal" | "Hard" | "Expert" | "Real";
export type DetailTab = "record" | "detail" | "ranking" | "tier";

interface MusicInfo {
    index: string;
    background: string | null;
    title: string;
    artist: string | null;
    category_short: string;
    normal: number;
    hard: number;
    expert: number;
    real: number | null;
}

interface UserPlayData {
    user_id: number;
    user: {
        id: number;
        username: string | null;
        avatar: string | null;
    };
    rank: string;
    fc_type: number;
    grade_basic: number;
    grade_recital: number;
    level: number;
    score: number;
    max_combo: number;
    play_count: number;
    fullcombo_count: number;
    pianistic_count: number;
    besttime: string;
}

interface RankingRow {
    rank: string;
    score: number;
    fc_type: number;
    user_id: number;
    user: {
        username: string | null;
        id: number;
        avatar: string | null;
    };
}

interface RecentChartPlay {
    id: number;
    score: number;
    rank: string;
    play_time: string;
}

interface ChartDetail {
    id: number;
    level: number;
    level_constant: number | null;
    bpm_min: number | null;
    bpm_max: number | null;
    note_count: number | null;
    duration_seconds: number | null;
    released_at: string | null;
    unlock_condition: string | null;
    play_video_url: string | null;
    chart_preview_url: string | null;
    evaluationCount: number;
    patternAverages: {
        stairs: number;
        chord: number;
        trill: number;
        glissando: number;
        repetition: number;
    };
    scoreDistribution: {
        key: string;
        label: string;
        count: number;
    }[];
    playerCount: number;
    userTopPercent: number | null;
}

interface MusicDetailProps {
    music: MusicInfo;
    difficulty: Difficulty;
    activeTab: DetailTab;
    userPlayData: UserPlayData | null;
    recentChartPlays: RecentChartPlay[];
    chartDetail: ChartDetail;
    ranking: {
        rows: RankingRow[];
        page: number;
        pageSize: number;
        totalCount: number;
        userRank: number | null;
    };
    tier: {
        constantHistory: {
            id: number;
            value: number;
            effectiveAt: string;
        }[];
        community: {
            average: number | null;
            count: number;
            distribution: { value: number; count: number }[];
        };
        currentEvaluation: {
            perceived_constant: number;
            stairs: number;
            chord: number;
            trill: number;
            glissando: number;
            repetition: number;
            comment: string | null;
        } | null;
        opinionCount: number;
        opinions: {
            id: number;
            perceivedConstant: number;
            comment: string;
            updatedAt: string;
            user: { id: number; username: string | null };
            positiveCount: number;
            negativeCount: number;
            viewerReaction: number | null;
        }[];
    };
}

const difficultyStyles: Record<Difficulty, string> = {
    Normal: "text-normal",
    Hard: "text-hard",
    Expert: "text-expert",
    Real: "text-real",
};

const tabItems: { value: DetailTab; label: string }[] = [
    { value: "record", label: "내 기록" },
    { value: "detail", label: "상세" },
    { value: "ranking", label: "랭킹" },
    { value: "tier", label: "서열 및 투표" },
];

const rankAssetNames: Record<string, string> = {
    P: "p",
    S: "s",
    A2: "a2",
    "A+": "a2",
    A: "a",
    B2: "b2",
    "B+": "b2",
    B: "b",
    C: "c",
    D: "d",
};

export default function MusicDetail({
    music,
    difficulty,
    activeTab,
    userPlayData,
    recentChartPlays,
    chartDetail,
    ranking,
    tier,
}: MusicDetailProps) {
    const jacketImageUrl =
        music.background ||
        `https://p.eagate.573.jp/game/nostalgia/op3/img/jacket.html?c=${music.index}`;
    const difficultyLevels: Record<Difficulty, number | null> = {
        Normal: music.normal,
        Hard: music.hard,
        Expert: music.expert,
        Real: music.real,
    };
    const scoreProgress = userPlayData
        ? Math.min(
              100,
              Math.max(0, ((userPlayData.score - 950000) / 50000) * 100)
          )
        : 0;
    const scoreToPerfect = userPlayData
        ? Math.max(0, 1000000 - userPlayData.score)
        : null;
    const bpm =
        chartDetail.bpm_min === null
            ? "-"
            : chartDetail.bpm_max !== null &&
                chartDetail.bpm_max !== chartDetail.bpm_min
              ? `${chartDetail.bpm_min}-${chartDetail.bpm_max}`
              : String(chartDetail.bpm_min);
    const duration =
        chartDetail.duration_seconds === null
            ? "-"
            : `${Math.floor(chartDetail.duration_seconds / 60)}:${String(
                  chartDetail.duration_seconds % 60
              ).padStart(2, "0")}`;
    const releasedAt = chartDetail.released_at
        ? chartDetail.released_at.slice(0, 10).replaceAll("-", ".")
        : "-";
    const maxDistributionCount = Math.max(
        1,
        ...chartDetail.scoreDistribution.map((item) => item.count)
    );

    return (
        <main className="mx-auto flex min-h-screen max-w-(--breakpoint-sm) flex-col gap-3 px-4 py-4">
            <section className="flex min-w-0 items-center gap-3">
                <div
                    className="bg-surface-muted rounded-card size-24 shrink-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${jacketImageUrl})` }}
                    aria-hidden="true"
                />

                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="bg-surface-muted text-text-secondary w-fit rounded px-2 py-1 text-xs font-bold">
                        {music.category_short}
                    </span>
                    <h1 className="text-text-primary truncate text-xl font-extrabold">
                        {music.title}
                    </h1>
                    <p className="text-text-secondary truncate text-sm">
                        {music.artist || "아티스트 미상"}
                    </p>
                </div>

                <div className="shrink-0 text-right">
                    <p className="text-text-disabled text-[10px]">레벨 상수</p>
                    <strong
                        className={cn(
                            "text-xl font-black tabular-nums",
                            difficultyStyles[difficulty]
                        )}
                    >
                        {chartDetail.level_constant?.toFixed(1) ?? "-"}
                    </strong>
                </div>
            </section>

            <nav className="grid grid-cols-4 gap-2">
                {(Object.keys(difficultyLevels) as Difficulty[]).map((item) => {
                    const level = difficultyLevels[item];
                    const isAvailable = level !== null;
                    const isActive = difficulty === item;

                    if (!isAvailable) {
                        return (
                            <div
                                key={item}
                                className="bg-surface rounded-card flex h-14 flex-col items-center justify-center gap-1 opacity-40"
                            >
                                <span
                                    className={cn(
                                        "text-xs font-bold",
                                        difficultyStyles[item]
                                    )}
                                >
                                    {item}
                                </span>
                                <span className="text-text-secondary text-xs">
                                    Lv -
                                </span>
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item}
                            href={`/music/${music.index}/${item}?tab=${activeTab}`}
                            className={cn(
                                "bg-surface rounded-card flex h-14 flex-col items-center justify-center gap-1 border",
                                isActive
                                    ? "border-text-primary"
                                    : "border-transparent"
                            )}
                        >
                            <span
                                className={cn(
                                    "text-xs font-bold",
                                    difficultyStyles[item]
                                )}
                            >
                                {item}
                            </span>
                            <span
                                className={cn(
                                    "text-xs",
                                    isActive
                                        ? "text-text-primary"
                                        : "text-text-secondary"
                                )}
                            >
                                Lv {level}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <nav className="flex gap-1 overflow-x-auto">
                {tabItems.map((tab) => (
                    <Link
                        key={tab.value}
                        href={`/music/${music.index}/${difficulty}?tab=${tab.value}`}
                        className={cn(
                            "rounded-card shrink-0 px-3 py-2 text-sm font-semibold",
                            activeTab === tab.value
                                ? "bg-text-primary text-bg"
                                : "bg-surface text-text-secondary"
                        )}
                    >
                        {tab.label}
                    </Link>
                ))}
            </nav>

            {activeTab === "record" && (
                <div className="flex flex-col gap-3">
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
                                        ? formatToGrade(
                                              userPlayData.grade_basic
                                          )
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
                                            rankAssetNames[
                                                play.rank.toUpperCase()
                                            ];

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
            )}

            {activeTab === "detail" && (
                <div className="flex flex-col gap-3">
                    <dl className="bg-surface rounded-card overflow-hidden text-sm">
                        {[
                            ["BPM", bpm],
                            [
                                "노트 수",
                                chartDetail.note_count === null
                                    ? "-"
                                    : formatToComma(chartDetail.note_count),
                            ],
                            ["곡 길이", duration],
                            ["수록일", releasedAt],
                            ["언락 조건", chartDetail.unlock_condition || "-"],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="border-divider flex min-h-10 items-center justify-between gap-4 border-t px-4 first:border-t-0"
                            >
                                <dt className="text-text-secondary shrink-0">
                                    {label}
                                </dt>
                                <dd className="text-text-primary min-w-0 text-right">
                                    {value}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <section className="bg-surface rounded-card p-4">
                        <header className="flex items-center justify-between gap-3">
                            <h2 className="text-sm font-bold">패턴 경향</h2>
                            <span className="text-caption">
                                {difficulty} · 투표{" "}
                                {chartDetail.evaluationCount}
                            </span>
                        </header>

                        {chartDetail.evaluationCount > 0 ? (
                            <div className="mt-2 flex items-center gap-3">
                                <PatternProfileChart
                                    values={chartDetail.patternAverages}
                                />
                                <dl className="flex w-1/2 flex-col gap-2">
                                    {[
                                        [
                                            "계단",
                                            chartDetail.patternAverages.stairs,
                                        ],
                                        [
                                            "동치",
                                            chartDetail.patternAverages.chord,
                                        ],
                                        [
                                            "트릴",
                                            chartDetail.patternAverages.trill,
                                        ],
                                        [
                                            "글리산도",
                                            chartDetail.patternAverages
                                                .glissando,
                                        ],
                                        [
                                            "연타",
                                            chartDetail.patternAverages
                                                .repetition,
                                        ],
                                    ].map(([label, value]) => (
                                        <div
                                            key={label}
                                            className="flex items-center gap-2 text-xs"
                                        >
                                            <dt className="text-text-secondary w-12 shrink-0">
                                                {label}
                                            </dt>
                                            <div className="bg-surface-muted h-1.5 min-w-0 flex-1 overflow-hidden rounded-full">
                                                <div
                                                    className="bg-chart h-full rounded-full"
                                                    style={{
                                                        width: `${(Number(value) / 4) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                            <dd className="text-text-primary w-6 text-right tabular-nums">
                                                {Number(value).toFixed(1)}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        ) : (
                            <div className="text-text-disabled flex h-32 items-center justify-center text-sm">
                                아직 등록된 패턴 투표가 없습니다.
                            </div>
                        )}

                        <Link
                            href={`/music/${music.index}/${difficulty}?tab=tier`}
                            className="text-text-secondary mt-2 block text-right text-xs font-semibold"
                        >
                            패턴 투표 →
                        </Link>
                    </section>

                    <section className="bg-surface rounded-card p-4">
                        <header className="flex items-center justify-between gap-3">
                            <h2 className="text-sm font-bold">점수 분포</h2>
                            <span className="text-caption">
                                {difficulty} · 전체 {chartDetail.playerCount}명
                            </span>
                        </header>

                        {chartDetail.playerCount > 0 ? (
                            <>
                                <div className="mt-4 grid h-20 grid-cols-7 items-end gap-1">
                                    {chartDetail.scoreDistribution.map(
                                        (item) => (
                                            <div
                                                key={item.key}
                                                className="flex h-full min-w-0 flex-col justify-end"
                                            >
                                                <div
                                                    className={cn(
                                                        "mx-auto w-full max-w-10 rounded-t-sm",
                                                        item.key === "pianist"
                                                            ? "bg-score"
                                                            : item.key === "990"
                                                              ? "bg-real"
                                                              : "bg-border"
                                                    )}
                                                    style={{
                                                        height:
                                                            item.count === 0
                                                                ? 0
                                                                : `${Math.max(4, (item.count / maxDistributionCount) * 56)}px`,
                                                    }}
                                                    title={`${item.label}: ${item.count}명`}
                                                />
                                                <span
                                                    className={cn(
                                                        "mt-1 truncate text-center text-[9px]",
                                                        item.key === "pianist"
                                                            ? "text-score"
                                                            : "text-text-disabled"
                                                    )}
                                                >
                                                    {item.label}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                                <p className="text-caption mt-3">
                                    {chartDetail.userTopPercent === null
                                        ? "로그인 후 내 위치를 확인할 수 있습니다."
                                        : `내 기록 기준 상위 ${chartDetail.userTopPercent}%`}
                                </p>
                            </>
                        ) : (
                            <div className="text-text-disabled flex h-24 items-center justify-center text-sm">
                                집계할 플레이 기록이 없습니다.
                            </div>
                        )}
                    </section>

                    <div className="grid grid-cols-2 gap-2">
                        {chartDetail.play_video_url ? (
                            <a
                                href={chartDetail.play_video_url}
                                target="_blank"
                                rel="noreferrer"
                                className="border-border rounded-card flex h-10 items-center justify-center gap-2 border text-sm font-semibold"
                            >
                                <Play size={15} aria-hidden /> 플레이 영상
                            </a>
                        ) : (
                            <span className="border-border text-text-disabled rounded-card flex h-10 items-center justify-center gap-2 border text-sm font-semibold opacity-60">
                                <Play size={15} aria-hidden /> 플레이 영상
                            </span>
                        )}
                        {chartDetail.chart_preview_url ? (
                            <a
                                href={chartDetail.chart_preview_url}
                                target="_blank"
                                rel="noreferrer"
                                className="border-border rounded-card flex h-10 items-center justify-center gap-2 border text-sm font-semibold"
                            >
                                <ScanSearch size={15} aria-hidden /> 채보 프리뷰
                            </a>
                        ) : (
                            <span className="border-border text-text-disabled rounded-card flex h-10 items-center justify-center gap-2 border text-sm font-semibold opacity-60">
                                <ScanSearch size={15} aria-hidden /> 채보 프리뷰
                            </span>
                        )}
                    </div>
                </div>
            )}

            {activeTab === "ranking" && (
                <MusicRankTable
                    musicIndex={music.index}
                    difficulty={difficulty}
                    rows={ranking.rows}
                    page={ranking.page}
                    pageSize={ranking.pageSize}
                    totalCount={ranking.totalCount}
                    currentUser={
                        userPlayData && userPlayData.score > 0
                            ? {
                                  rank: ranking.userRank,
                                  score: userPlayData.score,
                                  clearRank: userPlayData.rank,
                                  fcType: userPlayData.fc_type,
                                  user: userPlayData.user,
                              }
                            : null
                    }
                />
            )}

            {activeTab === "tier" && (
                <MusicTierVote
                    chartId={chartDetail.id}
                    level={chartDetail.level}
                    officialConstant={chartDetail.level_constant}
                    constantHistory={tier.constantHistory}
                    community={tier.community}
                    currentEvaluation={tier.currentEvaluation}
                    opinionCount={tier.opinionCount}
                    opinions={tier.opinions}
                />
            )}
        </main>
    );
}
