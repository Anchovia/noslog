import MusicDetail, {
    type DetailTab,
    type RankingMode,
} from "@/components/music/musicDetail";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import { getRecentChartPlays, getUserPlayData } from "./action";

const difficulties = ["Normal", "Hard", "Expert", "Real"] as const;
const tabs: DetailTab[] = ["record", "detail", "ranking", "tier"];

export default async function MusicDetailPage(props: {
    params: Promise<{ index: string; difficulty: string }>;
    searchParams: Promise<{ tab?: string; mode?: string }>;
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
    const rankingMode: RankingMode =
        searchParams.mode === "recital" ? "recital" : "basic";

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
            },
        }),
    ]);

    if (!music || !selectedChart) {
        notFound();
    }

    const [
        userPlayData,
        recentChartPlays,
        basicRankings,
        recitalRankings,
        evaluations,
        chartScores,
    ] = await Promise.all([
        getUserPlayData({ index, difficulty: selectedDifficulty }),
        getRecentChartPlays({
            index,
            difficulty: selectedDifficulty,
        }),
        db.playData.findMany({
            where: { chart_id: selectedChart.id },
            select: {
                rank: true,
                score: true,
                max_combo: true,
                grade_basic: true,
                besttime: true,
                user_id: true,
                user: { select: { username: true, id: true } },
            },
            distinct: ["user_id"],
            take: 50,
            orderBy: { grade_basic: "desc" },
        }),
        db.playData.findMany({
            where: { chart_id: selectedChart.id },
            select: {
                rank: true,
                score: true,
                max_combo: true,
                grade_recital: true,
                besttime: true,
                user_id: true,
                user: { select: { username: true, id: true } },
            },
            distinct: ["user_id"],
            take: 50,
            orderBy: { grade_recital: "desc" },
        }),
        db.chartEvaluation.findMany({
            where: { chart_id: selectedChart.id },
            select: {
                stairs: true,
                chord: true,
                trill: true,
                glissando: true,
                repetition: true,
            },
        }),
        db.playData.findMany({
            where: { chart_id: selectedChart.id },
            select: { score: true, fc_type: true },
        }),
    ]);

    const patternKeys = [
        "stairs",
        "chord",
        "trill",
        "glissando",
        "repetition",
    ] as const;
    const patternAverages = Object.fromEntries(
        patternKeys.map((key) => [
            key,
            evaluations.length
                ? evaluations.reduce((sum, value) => sum + value[key], 0) /
                  evaluations.length
                : 0,
        ])
    ) as Record<(typeof patternKeys)[number], number>;

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

    const higherScores = userPlayData
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

    return (
        <MusicDetail
            music={music}
            difficulty={selectedDifficulty}
            activeTab={activeTab}
            rankingMode={rankingMode}
            userPlayData={userPlayData}
            recentChartPlays={recentChartPlays}
            chartDetail={{
                ...selectedChart,
                released_at: selectedChart.released_at?.toISOString() ?? null,
                evaluationCount: evaluations.length,
                patternAverages,
                scoreDistribution,
                playerCount: chartScores.length,
                userTopPercent,
            }}
            basicRankings={basicRankings}
            recitalRankings={recitalRankings}
        />
    );
}
