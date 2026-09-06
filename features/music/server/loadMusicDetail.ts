import type {
    DetailTab,
    Difficulty,
    MusicDetailProps,
} from "@/components/music/musicDetailTypes";
import db from "@/lib/db";
import {
    getCachedChartDetailStats,
    getCachedMusicDetail,
    getRecentUserChartPlays,
    getUserChartRecord,
    getUserChartPeerScoreComparison,
    getUserChartPerformanceTrend,
    getUserChartScoreTrend,
} from "./musicDetailData";
import type { Locale } from "@/lib/i18n/routing";
import { getLocalizedMusicTitle } from "@/lib/i18n/musicTitle";
import { getChartRanking, MUSIC_RANKING_PAGE_SIZE } from "./chartRanking";
import { getCommunityData } from "./communityData";
import { logServerError } from "@/lib/observability/server";

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
    let userTopPercent: number | null = null;

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
        if (userPlayData && playerCount > 0) {
            const higherScores = scores.filter(
                (record) => record.score > userPlayData.score
            ).length;
            userTopPercent = Math.max(
                1,
                Math.ceil(((higherScores + 1) / playerCount) * 100)
            );
        }
    }

    const ranking: MusicDetailProps["ranking"] = {
        rows: [],
        page: rankingPage,
        pageSize: MUSIC_RANKING_PAGE_SIZE,
        totalCount: 0,
        userRank: null,
    };

    if (activeTab === "ranking") {
        const rankingData = await getChartRanking(chart.id, rankingPage);
        Object.assign(ranking, rankingData);
        if (userPlayData) {
            ranking.userRank =
                (await db.playData.count({
                    where: {
                        chart_id: chart.id,
                        score: { gt: userPlayData.score },
                    },
                })) + 1;
        }
    }

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
            userTopPercent,
        },
        ranking,
        tier,
        community,
    };
}
