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

export const MUSIC_DIFFICULTIES: Difficulty[] = [
    "Normal",
    "Hard",
    "Expert",
    "Real",
];
export const MUSIC_DETAIL_TABS: DetailTab[] = [
    "record",
    "detail",
    "ranking",
    "tier",
];
export { MUSIC_RANKING_PAGE_SIZE } from "./chartRanking";

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
        localizedTitle: await getLocalizedMusicTitle(
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
    const unlockNames =
        unlockSources.length && locale !== "ja"
            ? await getCachedUnlockTranslations(locale)
            : {};
    const unlockSteps = unlockSources.map((step) => ({
        ...step,
        name: unlockNames[step.name] ?? step.name,
    }));

    const userPlayData = userId
        ? await getUserChartRecord(userId, chart.id)
        : null;
    const [
        recentChartPlays,
        scoreTrend,
        performanceTrend,
        peerScoreComparison,
    ] =
        userId && activeTab === "record"
            ? await Promise.all([
                  getRecentUserChartPlays(userId, chart.id),
                  getUserChartScoreTrend(userId, chart.id, userPlayData),
                  getUserChartPerformanceTrend(userId, chart.id),
                  getUserChartPeerScoreComparison(
                      userId,
                      chart.id,
                      userPlayData?.user.grade_basic ?? null
                  ),
              ])
            : [[], [], [], null];

    let evaluationCount = 0;
    let patternAverages = {
        stairs: 0,
        chord: 0,
        trill: 0,
        glissando: 0,
        repetition: 0,
    };
    const scoreDistribution = emptyDistribution.map((item) => ({ ...item }));
    let playerCount = 0;
    let scoreSeries: number[] = [];

    // 머리 수치 띠 — 공개 서열표의 이 채보 값(모든 탭). 등재 안 된 표는 null 로 두고 화면에서 칸을 뺀다
    const tierLists = await db.tierList.findMany({
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
    });
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

    if (activeTab === "detail" || activeTab === "ranking") {
        const { evaluation, scores } = await getCachedChartDetailStats(
            chart.id
        );
        evaluationCount = evaluation._count._all;
        patternAverages = {
            stairs: evaluation._avg.stairs ?? 0,
            chord: evaluation._avg.chord ?? 0,
            trill: evaluation._avg.trill ?? 0,
            glissando: evaluation._avg.glissando ?? 0,
            repetition: evaluation._avg.repetition ?? 0,
        };

        for (const record of scores) {
            let bucket: number | null = null;
            if (record.fc_type === 3 || record.score >= 1000000) bucket = 5;
            else if (record.score >= 990000) bucket = 4;
            else if (record.score >= 980000) bucket = 3;
            else if (record.score >= 970000) bucket = 2;
            else if (record.score >= 960000) bucket = 1;
            else if (record.score >= 950000) bucket = 0;
            if (bucket !== null) scoreDistribution[bucket].count++;
        }

        playerCount = scores.length;
        if (activeTab === "ranking")
            scoreSeries = scores
                .map((record) => record.score)
                .sort((a, b) => b - a);
    }

    const ranking: MusicDetailProps["ranking"] = {
        rows: [],
        page: rankingPage,
        pageSize: MUSIC_RANKING_PAGE_SIZE,
        totalCount: 0,
        userRank: null,
        players: [],
    };

    if (activeTab === "ranking") {
        const rankingData = await getChartRanking(chart.id, rankingPage);
        Object.assign(ranking, rankingData);
        // 곡선 위 사진 — 상위 목록에 내가 없으면 내 줄을 더한다 (2026-09-17)
        const players = await getChartScorePlayers(
            chart.id,
            rankingData.totalCount
        );
        const me =
            userId &&
            userPlayData &&
            !players.some((player) => player.user_id === userId)
                ? await getChartScorePlayer(chart.id, userId)
                : null;
        ranking.players = me ? [...players, me] : players;
    }
    // 내 순위 — 랭킹 탭과 개요 탭(내 기록 요약 띠)에서 (2026-09-16)
    if (userPlayData && (activeTab === "ranking" || activeTab === "detail")) {
        ranking.userRank =
            (await db.playData.count({
                where: {
                    chart_id: chart.id,
                    score: { gt: userPlayData.score },
                },
            })) + 1;
        if (activeTab === "detail") ranking.totalCount = playerCount;
    }

    // 서열 변경 이력 — 개요 탭 접힘 줄
    const tierHistory =
        activeTab === "detail"
            ? await loadTierHistory(chart.id).catch((error) => {
                  logServerError(error, {
                      event: "music-detail.tier-history.failed",
                  });
                  return [];
              })
            : [];

    const tier: MusicDetailProps["tier"] = {
        currentConstant: null,
        constantHistory: [],
        community: { average: null, count: 0, distribution: [] },
        currentEvaluation: null,
        opinionCount: 0,
        opinions: [],
    };

    const community =
        activeTab === "tier"
            ? await getCommunityData(chart.id, userId).catch((error) => {
                  logServerError(error, {
                      event: "music-community.initial.failed",
                  });
                  return undefined;
              })
            : undefined;

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
            evaluationCount,
            patternAverages,
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
