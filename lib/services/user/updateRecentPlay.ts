import db from "../../db";
import {
    mapBemaniJudgeCounts,
    normalizeBemaniRank,
    type BemaniJudgeCounts,
} from "./bemaniRecordMapping";

interface RecentHistoryItem {
    artist: string;
    best_score: number;
    class_basic: string;
    difficulty: string;
    fast_count: number;
    is_onehand: boolean;
    judge_count: BemaniJudgeCounts;
    level: number;
    license: string;
    score: number;
    slow_count: number;
    max_combo: number;
    rank: string;
    play_time: string;
    music: string;
    title: string;
    grade_basic: number;
}

interface RecentHistoryIdentity {
    chart_id: number;
    source_play_time: string;
    score: number;
    max_combo: number;
    rank: string;
}

export async function updateRecentPlay(
    user_id: number,
    history: RecentHistoryItem[],
    sync_id: number
) {
    const startTime = Date.now(); // 시작 시간
    const charts = await db.musicChart.findMany({
        select: { id: true, music_idx: true, difficulty: true },
    });
    const chartIds = new Map(
        charts.map((chart) => [
            `${chart.music_idx}:${chart.difficulty}`,
            chart.id,
        ])
    );

    const skippedCharts: { musicIndex: string; difficulty: string }[] = [];
    const mappedRows = history.flatMap((data) => {
        const chart_id =
            chartIds.get(`${data.music}:${data.difficulty}`) ?? null;

        if (!chart_id) {
            skippedCharts.push({
                musicIndex: data.music,
                difficulty: data.difficulty,
            });
        }
        return chart_id
            ? [
                  {
                      user_id,
                      chart_id,
                      level: data.level,
                      source_play_time: data.play_time,
                      score: data.score,
                      best_score: data.best_score,
                      max_combo: data.max_combo,
                      rank: normalizeBemaniRank(data.rank),
                      grade_basic: data.grade_basic,
                      class_basic: data.class_basic,
                      fast_count: data.fast_count,
                      slow_count: data.slow_count,
                      is_onehand: data.is_onehand,
                      ...mapBemaniJudgeCounts(data.judge_count),
                      first_sync_id: sync_id,
                  },
              ]
            : [];
    });

    const identityKey = (row: RecentHistoryIdentity) =>
        [
            row.chart_id,
            row.source_play_time,
            row.score,
            row.max_combo,
            row.rank,
        ].join(":");
    const historyRows = [
        ...new Map(
            mappedRows.map((row) => [identityKey(row), row] as const)
        ).values(),
    ];

    const diagnostic = {
        syncId: sync_id,
        received: history.length,
        unmapped: history.length - mappedRows.length,
        duplicate: mappedRows.length - historyRows.length,
    };

    if (historyRows.length === 0) {
        console.info("Recent play ingestion", {
            ...diagnostic,
            existing: 0,
            inserted: 0,
        });
        return { insertedPlays: 0, skippedCharts };
    }

    const existingRows = await db.chartPlayHistory.findMany({
        where: {
            user_id,
            OR: historyRows.map((row) => ({
                chart_id: row.chart_id,
                source_play_time: row.source_play_time,
                score: row.score,
                max_combo: row.max_combo,
                rank: row.rank,
            })),
        },
        select: {
            chart_id: true,
            source_play_time: true,
            score: true,
            max_combo: true,
            rank: true,
        },
    });
    const existingKeys = new Set(existingRows.map(identityKey));

    await db.$transaction(
        historyRows.map((row) =>
            db.chartPlayHistory.upsert({
                where: {
                    user_id_chart_id_source_play_time_score_max_combo_rank: {
                        user_id,
                        chart_id: row.chart_id,
                        source_play_time: row.source_play_time,
                        score: row.score,
                        max_combo: row.max_combo,
                        rank: row.rank,
                    },
                },
                create: row,
                update: {
                    level: row.level,
                    best_score: row.best_score,
                    grade_basic: row.grade_basic,
                    class_basic: row.class_basic,
                    fast_count: row.fast_count,
                    slow_count: row.slow_count,
                    is_onehand: row.is_onehand,
                    judge_sjust: row.judge_sjust,
                    judge_just: row.judge_just,
                    judge_good: row.judge_good,
                    judge_miss: row.judge_miss,
                    judge_near: row.judge_near,
                },
            })
        )
    );

    const duration = Date.now() - startTime;
    const inserted = historyRows.filter(
        (row) => !existingKeys.has(identityKey(row))
    ).length;
    console.info("Recent play ingestion", {
        ...diagnostic,
        existing: historyRows.length - inserted,
        inserted,
    });
    console.info(`===[최근 플레이 히스토리 업데이트 성공(${duration}ms)]===`);
    return { insertedPlays: inserted, skippedCharts };
}
