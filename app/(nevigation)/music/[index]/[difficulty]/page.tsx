import MusicDetail, {
    type DetailTab,
    type MusicDetailProps,
} from "@/components/music/musicDetail";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import {
    getCachedChartDetailStats,
    getCachedChartRanking,
    getCachedChartTier,
    getCachedMusicDetail,
    getRecentUserChartPlays,
    getUserChartRecord,
} from "./data";

const difficulties = ["Normal", "Hard", "Expert", "Real"] as const;
const tabs: DetailTab[] = ["record", "detail", "ranking", "tier"];
const rankingPageSize = 7;

const emptyDistribution = [
    { key: "under950", label: "<950k", count: 0 },
    { key: "950", label: "950k", count: 0 },
    { key: "960", label: "960k", count: 0 },
    { key: "970", label: "970k", count: 0 },
    { key: "980", label: "980k", count: 0 },
    { key: "990", label: "990k", count: 0 },
    { key: "pianist", label: "Pianist", count: 0 },
];

export default async function MusicDetailPage(props: {
    params: Promise<{ index: string; difficulty: string }>;
    searchParams: Promise<{ tab?: string; page?: string }>;
}) {
    const [{ index, difficulty }, searchParams] = await Promise.all([
        props.params,
        props.searchParams,
    ]);
    const normalizedDifficulty = difficulty.toLowerCase();
    const selectedDifficulty = difficulties.find(
        (item) => item.toLowerCase() === normalizedDifficulty
    );

    if (!selectedDifficulty) notFound();

    if (difficulty !== normalizedDifficulty) {
        const query = new URLSearchParams();
        if (searchParams.tab) query.set("tab", searchParams.tab);
        if (searchParams.page) query.set("page", searchParams.page);
        redirect(
            `/music/${index}/${normalizedDifficulty}${query.size ? `?${query}` : ""}`
        );
    }

    const activeTab: DetailTab = tabs.includes(searchParams.tab as DetailTab)
        ? (searchParams.tab as DetailTab)
        : "record";
    const requestedPage = Number.parseInt(searchParams.page ?? "1", 10);
    const rankingPage =
        Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

    const [{ music, chart }, session] = await Promise.all([
        getCachedMusicDetail(index, selectedDifficulty),
        getSession(),
    ]);

    if (!music || !chart) notFound();

    const chartLevels = new Map(
        music.charts.map((item) => [item.difficulty, item.level])
    );
    const musicWithLevels = {
        index: music.index,
        background: music.background,
        title: music.title,
        artist: music.artist,
        category_short: music.category_short,
        normal: chartLevels.get("Normal") ?? 0,
        hard: chartLevels.get("Hard") ?? 0,
        expert: chartLevels.get("Expert") ?? 0,
        real: chartLevels.get("Real") ?? null,
    };

    const userPlayData = session.id
        ? await getUserChartRecord(session.id, chart.id)
        : null;
    const recentChartPlays =
        session.id && activeTab === "record"
            ? await getRecentUserChartPlays(session.id, chart.id)
            : [];

    let evaluationCount = 0;
    let patternAverages = {
        stairs: 0,
        chord: 0,
        trill: 0,
        glissando: 0,
        repetition: 0,
    };
    let scoreDistribution = emptyDistribution;
    let playerCount = 0;
    let userTopPercent: number | null = null;

    if (activeTab === "detail") {
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
        scoreDistribution = emptyDistribution.map((item) => ({ ...item }));

        for (const record of scores) {
            let bucket = 0;
            if (record.fc_type === 3 || record.score >= 1000000) bucket = 6;
            else if (record.score >= 990000) bucket = 5;
            else if (record.score >= 980000) bucket = 4;
            else if (record.score >= 970000) bucket = 3;
            else if (record.score >= 960000) bucket = 2;
            else if (record.score >= 950000) bucket = 1;
            scoreDistribution[bucket].count++;
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

    let ranking: MusicDetailProps["ranking"] = {
        rows: [],
        page: rankingPage,
        pageSize: rankingPageSize,
        totalCount: 0,
        userRank: null as number | null,
    };

    if (activeTab === "ranking") {
        const rankingData = await getCachedChartRanking(
            chart.id,
            rankingPage,
            rankingPageSize
        );
        const pageCount = Math.max(
            1,
            Math.ceil(rankingData.totalCount / rankingPageSize)
        );

        if (rankingPage > pageCount) {
            redirect(
                `/music/${index}/${normalizedDifficulty}?tab=ranking&page=${pageCount}`
            );
        }

        ranking = { ...ranking, ...rankingData };
        if (userPlayData) {
            ranking.userRank =
                (await db.playData.count({
                    where: {
                        chart_id: chart.id,
                        score: { gt: 0 },
                        OR: [
                            { score: { gt: userPlayData.score } },
                            {
                                score: userPlayData.score,
                                user_id: { lt: userPlayData.user_id },
                            },
                        ],
                    },
                })) + 1;
        }
    }

    let tier: MusicDetailProps["tier"] = {
        currentConstant: null as number | null,
        constantHistory: [] as {
            id: number;
            value: number;
            effectiveAt: string;
        }[],
        community: {
            average: null as number | null,
            count: 0,
            distribution: [] as { value: number; count: number }[],
        },
        currentEvaluation: null,
        opinionCount: 0,
        opinions: [] as {
            id: number;
            perceivedConstant: number;
            comment: string;
            updatedAt: string;
            user: { id: number; username: string | null };
            positiveCount: number;
            negativeCount: number;
            viewerReaction: number | null;
            canDelete: boolean;
        }[],
    };

    if (activeTab === "tier") {
        const [publicTier, currentEvaluation] = await Promise.all([
            getCachedChartTier(chart.id),
            session.id
                ? db.chartEvaluation.findUnique({
                      where: {
                          chart_id_user_id: {
                              chart_id: chart.id,
                              user_id: session.id,
                          },
                      },
                      select: {
                          perceived_constant: true,
                          stairs: true,
                          chord: true,
                          trill: true,
                          glissando: true,
                          repetition: true,
                          comment: true,
                      },
                  })
                : Promise.resolve(null),
        ]);
        const constantHistory = [...(publicTier.placement?.history ?? [])];
        const currentConstant = publicTier.placement?.currentConstant ?? null;

        if (
            currentConstant !== null &&
            constantHistory.at(-1)?.value !== currentConstant
        ) {
            constantHistory.push({
                id: -1,
                value: currentConstant,
                effectiveAt: publicTier.placement!.updatedAt,
            });
        }

        tier = {
            currentConstant,
            constantHistory,
            community: {
                average: publicTier.evaluation._avg.perceived_constant ?? null,
                count: publicTier.evaluation._count._all,
                distribution: publicTier.distribution.map((item) => ({
                    value: item.perceived_constant,
                    count: item._count._all,
                })),
            },
            currentEvaluation,
            opinionCount: publicTier.opinionCount,
            opinions: publicTier.opinions.map((opinion) => ({
                id: opinion.id,
                perceivedConstant: opinion.perceived_constant,
                comment: opinion.comment ?? "",
                updatedAt: opinion.updated_at,
                user: opinion.user,
                positiveCount: opinion.reactions.filter(
                    (reaction) => reaction.value === 1
                ).length,
                negativeCount: opinion.reactions.filter(
                    (reaction) => reaction.value === -1
                ).length,
                viewerReaction:
                    opinion.reactions.find(
                        (reaction) => reaction.user_id === session.id
                    )?.value ?? null,
                canDelete: opinion.user.id === session.id,
            })),
        };
    }

    return (
        <MusicDetail
            music={musicWithLevels}
            difficulty={selectedDifficulty}
            activeTab={activeTab}
            isLoggedIn={Boolean(session.id)}
            userPlayData={userPlayData}
            recentChartPlays={recentChartPlays}
            chartDetail={{
                ...chart,
                evaluationCount,
                patternAverages,
                scoreDistribution,
                playerCount,
                userTopPercent,
            }}
            ranking={ranking}
            tier={tier}
        />
    );
}
