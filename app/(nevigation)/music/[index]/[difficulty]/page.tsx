import MusicDetail, { type DetailTab } from "@/components/music/musicDetail";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { getRecentChartPlays, getUserPlayData } from "./action";

const difficulties = ["Normal", "Hard", "Expert", "Real"] as const;
const tabs: DetailTab[] = ["record", "detail", "ranking", "tier"];

export default async function MusicDetailPage(props: {
    params: Promise<{ index: string; difficulty: string }>;
    searchParams: Promise<{ tab?: string; page?: string }>;
}) {
    const [{ index, difficulty }, searchParams] = await Promise.all([
        props.params,
        props.searchParams,
    ]);

    if (!difficulties.includes(difficulty as (typeof difficulties)[number])) {
        notFound();
    }

    const selectedDifficulty = difficulty as (typeof difficulties)[number];
    const activeTab: DetailTab = tabs.includes(searchParams.tab as DetailTab)
        ? (searchParams.tab as DetailTab)
        : "record";
    const requestedPage = Number.parseInt(searchParams.page ?? "1", 10);
    const rankingPage =
        Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const rankingPageSize = 7;

    const [music, selectedChart] = await Promise.all([
        db.music.findUnique({
            where: { index },
            select: {
                index: true,
                background: true,
                title: true,
                artist: true,
                category_short: true,
                normal: true,
                hard: true,
                expert: true,
                real: true,
            },
        }),
        db.musicChart.findUnique({
            where: {
                music_idx_difficulty: {
                    music_idx: index,
                    difficulty: selectedDifficulty,
                },
            },
            select: {
                id: true,
                level: true,
                level_constant: true,
                bpm_min: true,
                bpm_max: true,
                note_count: true,
                duration_seconds: true,
                released_at: true,
                unlock_condition: true,
                play_video_url: true,
                chart_preview_url: true,
                updated_at: true,
            },
        }),
    ]);

    if (!music || !selectedChart) {
        notFound();
    }

    const session = await getSession();

    const [
        userPlayData,
        recentChartPlays,
        rankingRows,
        rankingCount,
        evaluationSummary,
        perceivedDistribution,
        constantHistory,
        currentEvaluation,
        evaluationOpinions,
        opinionCount,
        chartScores,
    ] = await Promise.all([
        getUserPlayData({ index, difficulty: selectedDifficulty }),
        getRecentChartPlays({
            index,
            difficulty: selectedDifficulty,
        }),
        db.playData.findMany({
            where: { chart_id: selectedChart.id, score: { gt: 0 } },
            select: {
                rank: true,
                score: true,
                fc_type: true,
                user_id: true,
                user: {
                    select: { username: true, id: true, avatar: true },
                },
            },
            skip: (rankingPage - 1) * rankingPageSize,
            take: rankingPageSize,
            orderBy: [{ score: "desc" }, { user_id: "asc" }],
        }),
        db.playData.count({
            where: { chart_id: selectedChart.id, score: { gt: 0 } },
        }),
        db.chartEvaluation.aggregate({
            where: { chart_id: selectedChart.id },
            _count: { _all: true },
            _avg: {
                perceived_constant: true,
                stairs: true,
                chord: true,
                trill: true,
                glissando: true,
                repetition: true,
            },
        }),
        db.chartEvaluation.groupBy({
            by: ["perceived_constant"],
            where: { chart_id: selectedChart.id },
            _count: { _all: true },
            orderBy: { perceived_constant: "asc" },
        }),
        db.chartConstantHistory.findMany({
            where: { chart_id: selectedChart.id },
            select: { id: true, value: true, effective_at: true },
            orderBy: { effective_at: "asc" },
        }),
        session.id
            ? db.chartEvaluation.findUnique({
                  where: {
                      chart_id_user_id: {
                          chart_id: selectedChart.id,
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
        db.chartEvaluation.findMany({
            where: {
                chart_id: selectedChart.id,
                comment: { not: null },
            },
            select: {
                id: true,
                perceived_constant: true,
                comment: true,
                updated_at: true,
                user: {
                    select: { id: true, username: true },
                },
                reactions: {
                    select: { user_id: true, value: true },
                },
            },
            orderBy: { updated_at: "desc" },
            take: 20,
        }),
        db.chartEvaluation.count({
            where: {
                chart_id: selectedChart.id,
                comment: { not: null },
            },
        }),
        db.playData.findMany({
            where: { chart_id: selectedChart.id, score: { gt: 0 } },
            select: { score: true, fc_type: true },
        }),
    ]);

    const patternAverages = {
        stairs: evaluationSummary._avg.stairs ?? 0,
        chord: evaluationSummary._avg.chord ?? 0,
        trill: evaluationSummary._avg.trill ?? 0,
        glissando: evaluationSummary._avg.glissando ?? 0,
        repetition: evaluationSummary._avg.repetition ?? 0,
    };

    const constantPoints = constantHistory.map((item) => ({
        id: item.id,
        value: item.value,
        effectiveAt: item.effective_at.toISOString(),
    }));
    const lastConstant = constantPoints.at(-1)?.value;

    if (
        selectedChart.level_constant !== null &&
        lastConstant !== selectedChart.level_constant
    ) {
        constantPoints.push({
            id: -1,
            value: selectedChart.level_constant,
            effectiveAt: selectedChart.updated_at.toISOString(),
        });
    }

    const scoreDistribution = [
        { key: "under950", label: "<950k", count: 0 },
        { key: "950", label: "950k", count: 0 },
        { key: "960", label: "960k", count: 0 },
        { key: "970", label: "970k", count: 0 },
        { key: "980", label: "980k", count: 0 },
        { key: "990", label: "990k", count: 0 },
        { key: "pianist", label: "Pianist", count: 0 },
    ];

    for (const record of chartScores) {
        let index = 0;
        if (record.fc_type === 3 || record.score >= 1000000) index = 6;
        else if (record.score >= 990000) index = 5;
        else if (record.score >= 980000) index = 4;
        else if (record.score >= 970000) index = 3;
        else if (record.score >= 960000) index = 2;
        else if (record.score >= 950000) index = 1;
        scoreDistribution[index].count++;
    }

    const higherScores =
        userPlayData && userPlayData.score > 0
            ? chartScores.filter((record) => record.score > userPlayData.score)
                  .length
            : null;
    const userTopPercent =
        higherScores !== null && chartScores.length > 0
            ? Math.max(
                  1,
                  Math.ceil(((higherScores + 1) / chartScores.length) * 100)
              )
            : null;
    const rankingPageCount = Math.max(
        1,
        Math.ceil(rankingCount / rankingPageSize)
    );

    if (activeTab === "ranking" && rankingPage > rankingPageCount) {
        redirect(
            `/music/${index}/${selectedDifficulty}?tab=ranking&page=${rankingPageCount}`
        );
    }

    const userRanking =
        userPlayData && userPlayData.score > 0
            ? (await db.playData.count({
                  where: {
                      chart_id: selectedChart.id,
                      score: { gt: 0 },
                      OR: [
                          { score: { gt: userPlayData.score } },
                          {
                              score: userPlayData.score,
                              user_id: { lt: userPlayData.user_id },
                          },
                      ],
                  },
              })) + 1
            : null;

    return (
        <MusicDetail
            music={music}
            difficulty={selectedDifficulty}
            activeTab={activeTab}
            userPlayData={userPlayData}
            recentChartPlays={recentChartPlays}
            chartDetail={{
                id: selectedChart.id,
                level: selectedChart.level,
                level_constant: selectedChart.level_constant,
                bpm_min: selectedChart.bpm_min,
                bpm_max: selectedChart.bpm_max,
                note_count: selectedChart.note_count,
                duration_seconds: selectedChart.duration_seconds,
                released_at: selectedChart.released_at?.toISOString() ?? null,
                unlock_condition: selectedChart.unlock_condition,
                play_video_url: selectedChart.play_video_url,
                chart_preview_url: selectedChart.chart_preview_url,
                evaluationCount: evaluationSummary._count._all,
                patternAverages,
                scoreDistribution,
                playerCount: chartScores.length,
                userTopPercent,
            }}
            ranking={{
                rows: rankingRows,
                page: rankingPage,
                pageSize: rankingPageSize,
                totalCount: rankingCount,
                userRank: userRanking,
            }}
            tier={{
                constantHistory: constantPoints,
                community: {
                    average: evaluationSummary._avg.perceived_constant ?? null,
                    count: evaluationSummary._count._all,
                    distribution: perceivedDistribution.map((item) => ({
                        value: item.perceived_constant,
                        count: item._count._all,
                    })),
                },
                currentEvaluation,
                opinionCount,
                opinions: evaluationOpinions.map((opinion) => ({
                    id: opinion.id,
                    perceivedConstant: opinion.perceived_constant,
                    comment: opinion.comment ?? "",
                    updatedAt: opinion.updated_at.toISOString(),
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
                })),
            }}
        />
    );
}
