import db from "../../db";
import {
    type BemaniJudgeCounts,
    mapBemaniJudgeCounts,
    normalizeBemaniRank,
} from "./bemani-record-mapping";
import { recordBestAt } from "./recent-record-merge";

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
                      // 같은 시각을 timestamptz 로(2026-10-16 P3 늘리기 — 공식 시각은 KST)
                      playedAt: recordBestAt(data.play_time),
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
            level: true,
            best_score: true,
            grade_basic: true,
            class_basic: true,
            fast_count: true,
            slow_count: true,
            is_onehand: true,
            judge_sjust: true,
            judge_just: true,
            judge_good: true,
            judge_miss: true,
            judge_near: true,
        },
    });
    const existingKeys = new Set(existingRows.map(identityKey));
    const existingByKey = new Map(
        existingRows.map((row) => [identityKey(row), row] as const)
    );
    // 새 플레이는 한 문장으로 넣고, 이미 있는 플레이는 값이 다를 때만 고친다(2026-10-15 S9) —
    // 예전처럼 받은 100건을 모두 upsert 하지 않는다. 고치는 열 · 결과 행은 예전과 같다
    const newRows = historyRows.filter(
        (row) => !existingKeys.has(identityKey(row))
    );
    const changedRows = historyRows.filter((row) => {
        const current = existingByKey.get(identityKey(row));
        return (
            current !== undefined &&
            (current.level !== row.level ||
                current.best_score !== row.best_score ||
                current.grade_basic !== row.grade_basic ||
                current.class_basic !== row.class_basic ||
                current.fast_count !== row.fast_count ||
                current.slow_count !== row.slow_count ||
                current.is_onehand !== row.is_onehand ||
                current.judge_sjust !== row.judge_sjust ||
                current.judge_just !== row.judge_just ||
                current.judge_good !== row.judge_good ||
                current.judge_miss !== row.judge_miss ||
                current.judge_near !== row.judge_near)
        );
    });

    await db.$transaction([
        ...(newRows.length
            ? [
                  db.chartPlayHistory.createMany({
                      data: newRows,
                      skipDuplicates: true,
                  }),
              ]
            : []),
        ...changedRows.map((row) =>
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
        ),
    ]);

    const duration = Date.now() - startTime;
    const inserted = newRows.length;
    console.info("Recent play ingestion", {
        ...diagnostic,
        existing: historyRows.length - inserted,
        inserted,
    });
    console.info(`===[최근 플레이 히스토리 업데이트 성공(${duration}ms)]===`);
    return { insertedPlays: inserted, skippedCharts };
}
