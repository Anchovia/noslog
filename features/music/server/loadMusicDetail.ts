import type {
    DetailTab,
    Difficulty,
    MusicDetailProps,
} from "@/components/music/musicDetailTypes";
import db from "@/lib/db";
import {
    getCachedChartDetailStats,
    getCachedMusicDetail,
    getCachedUnlockTranslations,
    getRecentUserChartPlays,
    getUserChartRecord,
    getUserChartPeerScoreComparison,
    getUserChartPerformanceTrend,
    getUserChartScoreTrend,
} from "./musicDetailData";
import type { Locale } from "@/lib/i18n/routing";
import { getLocalizedMusicTitle } from "@/lib/i18n/musicTitle";
import { unlockStepsFor } from "@/lib/music/unlockCondition";
import {
    getChartRanking,
    getChartScorePlayer,
    getChartScorePlayers,
    MUSIC_RANKING_PAGE_SIZE,
} from "./chartRanking";
import { getCommunityData } from "./communityData";
import { logServerError } from "@/lib/observability/server";
import {
    TIER_GOALS,
    TIER_MODE_GOALS,
    TIER_MODES,
    isTierGoal,
    isTierMode,
    isTierModeGoal,
} from "@/lib/tiers";

const MUSIC_DIFFICULTIES: Difficulty[] = ["Normal", "Hard", "Expert", "Real"];
const MUSIC_DETAIL_TABS: DetailTab[] = ["record", "detail", "ranking", "tier"];
const EMPTY_UNLOCK_NAMES: Record<string, string> = {};
const emptyDistribution = [
    { key: "950", label: "950k", count: 0 },
    { key: "960", label: "960k", count: 0 },
    { key: "970", label: "970k", count: 0 },
    { key: "980", label: "980k", count: 0 },
    { key: "990", label: "990k", count: 0 },
    { key: "pianist", label: "Pianist", count: 0 },
];

export function normalizeMusicDifficulty(value: string) {
    return MUSIC_DIFFICULTIES.find(
        (difficulty) => difficulty.toLowerCase() === value.toLowerCase()
    );
}

export function normalizeMusicDetailTab(value?: string): DetailTab {
    return MUSIC_DETAIL_TABS.includes(value as DetailTab)
        ? (value as DetailTab)
        : "detail";
}

export async function loadMusicDetail(
    index: string,
    difficulty: Difficulty,
    activeTab: DetailTab,
    rankingPage: number,
    userId: number | undefined,
    locale: Locale,
    showLocalizedTitle: boolean
): Promise<MusicDetailProps | null> {
    const { music, chart } = await getCachedMusicDetail(index, difficulty);
    if (!music || !chart) return null;

    const chartLevels = new Map(
        music.charts.map((item) => [item.difficulty, item.level])
    );
    const musicWithLevels = {
        index: music.index,
        background: music.background,
        title: music.title,
        localizedTitle: getLocalizedMusicTitle(
            music,
            locale,
            showLocalizedTitle
        ),
        artist: music.artist,
        category_short: music.category_short,
        normal: chartLevels.get("Normal") ?? 0,
        hard: chartLevels.get("Hard") ?? 0,
        expert: chartLevels.get("Expert") ?? 0,
        real: chartLevels.get("Real") ?? null,
        constants: Object.fromEntries(
            music.charts.map((chart) => [
                chart.difficulty,
                chart.level_constant ?? null,
            ])
        ),
    };

    // 해금 조건 — 이 난이도 몫만, 이름은 사전으로 번역(일본어는 원문 · 사전에 없으면 원문)
    const unlockSources = unlockStepsFor(chart.unlock_condition, difficulty);
    // 본인 공개 설정을 읽은 뒤 필요한 조회만 이어 붙인다. 서로 독립인 조회는 함께 시작한다.
    const userRecord = userId
        ? getUserChartRecord(userId, chart.id)
        : Promise.resolve(null);
    const [unlockNames, tierLists, tierHistory, community, personal] =
        await Promise.all([
            unlockSources.length && locale !== "ja"
                ? getCachedUnlockTranslations(locale)
                : EMPTY_UNLOCK_NAMES,
            db.tierList.findMany({
                where: {
                    mode: { in: [...TIER_MODES] },
                    goal: { in: [...TIER_GOALS] },
                    status: "published",
                },
                orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
                select: {
                    mode: true,
                    goal: true,
                    entries: {
                        where: { chartId: chart.id },
                        select: { tierBand: { select: { value: true } } },
                    },
                },
            }),
            activeTab === "detail"
                ? loadTierHistory(chart.id).catch((error) => {
                      logServerError(error, {
                          event: "music-detail.tier-history.failed",
                      });
                      return [];
                  })
                : [],
            activeTab === "tier"
                ? getCommunityData(chart.id, userId).catch((error) => {
                      logServerError(error, {
                          event: "music-community.initial.failed",
                      });
                      return undefined;
                  })
                : undefined,
            userRecord.then(async (userPlayData) => {
                // 비공개인 본인이 볼 때만 자기 점수를 포함한다.
                const includeSelf =
                    userId && userPlayData?.user.hide_play_scores ? userId : 0;
                const [
                    recentChartPlays,
                    scoreTrend,
                    performanceTrend,
                    peerScoreComparison,
                    stats,
                    ranking,
                    higherCount,
                ] = await Promise.all([
                    userId && activeTab === "record"
                        ? getRecentUserChartPlays(userId, chart.id)
                        : [],
                    userId && activeTab === "record"
                        ? getUserChartScoreTrend(userId, chart.id, userPlayData)
                        : [],
                    userId && activeTab === "record"
                        ? getUserChartPerformanceTrend(userId, chart.id)
                        : [],
                    userId && activeTab === "record"
                        ? getUserChartPeerScoreComparison(
                              userId,
                              chart.id,
                              userPlayData
                                  ? userPlayData.user.grade_basic
                                  : undefined
                          )
                        : null,
                    activeTab === "detail" || activeTab === "ranking"
                        ? getCachedChartDetailStats(chart.id, includeSelf)
                        : { scores: [] },
                    activeTab === "ranking"
                        ? loadRanking(
                              chart.id,
                              rankingPage,
                              includeSelf,
                              userPlayData ? userId : undefined
                          )
                        : {
                              rows: [],
                              page: rankingPage,
                              pageSize: MUSIC_RANKING_PAGE_SIZE,
                              totalCount: 0,
                              userRank: null,
                              players: [],
                          },
                    userPlayData &&
                    (activeTab === "ranking" || activeTab === "detail")
                        ? db.playData.count({
                              where: {
                                  chart_id: chart.id,
                                  score: { gt: userPlayData.score },
                                  user: { hide_play_scores: false },
                              },
                          })
                        : null,
                ]);
                if (higherCount !== null) {
                    ranking.userRank = higherCount + 1;
                    if (activeTab === "detail")
                        ranking.totalCount = stats.scores.length;
                }
                return {
                    userPlayData,
                    recentChartPlays,
                    scoreTrend,
                    performanceTrend,
                    peerScoreComparison,
                    stats,
                    ranking,
                };
            }),
        ]);
    const {
        userPlayData,
        recentChartPlays,
        scoreTrend,
        performanceTrend,
        peerScoreComparison,
        stats,
        ranking,
    } = personal;
    const unlockSteps = unlockSources.map((step) => ({
        ...step,
        name: unlockNames[step.name] ?? step.name,
    }));
    const scoreDistribution = emptyDistribution.map((item) => ({ ...item }));
    const playerCount = stats.scores.length;
    const scoreSeries =
        activeTab === "ranking"
            ? stats.scores.map((record) => record.score).sort((a, b) => b - a)
            : [];
    // 같은 모드 · 목표의 공개 표가 여럿이면 최신 하나(communityData 와 같은 규칙), 순서는 Basic S · 990k · Pianist · Recital
    const tierValues = TIER_MODES.flatMap((mode) =>
        TIER_MODE_GOALS[mode].map((goal) => ({
            mode,
            goal,
            value:
                tierLists.find(
                    (list) => list.mode === mode && list.goal === goal
                )?.entries[0]?.tierBand.value ?? null,
        }))
    );

    for (const record of stats.scores) {
        let bucket: number | null = null;
        if (record.fc_type === 3 || record.score >= 1000000) bucket = 5;
        else if (record.score >= 990000) bucket = 4;
        else if (record.score >= 980000) bucket = 3;
        else if (record.score >= 970000) bucket = 2;
        else if (record.score >= 960000) bucket = 1;
        else if (record.score >= 950000) bucket = 0;
        if (bucket !== null) scoreDistribution[bucket].count++;
    }

    const tier: MusicDetailProps["tier"] = {
        currentConstant: null,
        constantHistory: [],
        community: { average: null, count: 0, distribution: [] },
        currentEvaluation: null,
        opinionCount: 0,
        opinions: [],
    };

    return {
        accountId: userId,
        music: musicWithLevels,
        difficulty,
        activeTab,
        isLoggedIn: Boolean(userId),
        userPlayData,
        recentChartPlays,
        scoreTrend,
        performanceTrend,
        peerScoreComparison,
        chartDetail: {
            ...chart,
            scoreDistribution,
            playerCount,
            tierValues,
            tierHistory,
            scoreSeries,
            unlockSteps,
        },
        ranking,
        tier,
        community,
    };
}

// 사진 후보는 랭킹 인원 수에 따라 달라져 이 순서를 유지한다.
async function loadRanking(
    chartId: number,
    page: number,
    includeSelf: number,
    userId: number | undefined
): Promise<MusicDetailProps["ranking"]> {
    const ranking = await getChartRanking(chartId, page, includeSelf);
    const players = await getChartScorePlayers(
        chartId,
        ranking.totalCount,
        includeSelf
    );
    const me =
        userId && !players.some((player) => player.user_id === userId)
            ? await getChartScorePlayer(chartId, userId)
            : null;
    return {
        ...ranking,
        userRank: null,
        players: me ? [...players, me] : players,
    };
}

// 공개 서열표의 배치 변경 이력 — communityData 와 같은 계산(이전 값 → 새 값)
async function loadTierHistory(chartId: number) {
    const history = await db.tierPlacementHistory.findMany({
        where: { chartId, tierList: { status: "published" } },
        orderBy: [{ effectiveAt: "asc" }, { id: "asc" }],
        select: {
            id: true,
            bandValue: true,
            effectiveAt: true,
            tierList: { select: { mode: true, goal: true } },
        },
    });
    const previous = new Map<string, number | null>();
    return history
        .flatMap((event) => {
            const { mode, goal } = event.tierList;
            if (
                !isTierMode(mode) ||
                !goal ||
                !isTierGoal(goal) ||
                !isTierModeGoal(mode, goal)
            )
                return [];
            const key = `${mode}:${goal}`;
            const previousValue = previous.get(key) ?? null;
            previous.set(key, event.bandValue);
            return [
                {
                    id: event.id,
                    mode,
                    goal,
                    previousValue,
                    value: event.bandValue,
                    effectiveAt: event.effectiveAt.toISOString(),
                },
            ];
        })
        .reverse();
}
