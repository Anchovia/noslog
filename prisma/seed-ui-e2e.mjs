import { PrismaClient } from "@prisma/client";

const url = process.env.DATABASE_URL;
if (
    process.env.E2E_SEED !== "1" ||
    !url ||
    !["localhost", "127.0.0.1"].includes(new URL(url).hostname)
) {
    throw new Error(
        "UI fixtures require E2E_SEED=1 and an isolated local database."
    );
}
const db = new PrismaClient({ datasourceUrl: url });
const index = "bfdaadfb98501907925ecf41a076108d";

try {
    const user = await db.user.findUniqueOrThrow({
        where: { username: "E2E_RANKER" },
    });
    const chart = await db.musicChart.findUniqueOrThrow({
        where: {
            music_idx_difficulty: { music_idx: index, difficulty: "Expert" },
        },
    });
    await db.musicChart.update({
        where: { id: chart.id },
        data: {
            bpm_min: 182,
            bpm_max: 182,
            note_count: 1420,
            duration_seconds: 131,
            level_constant: 12.5,
        },
    });
    const common = {
        level: 12,
        score: 976654,
        rank: "S",
        fc_type: 2,
        play_count: 128,
        fullcombo_count: 12,
        pianistic_count: 3,
        max_combo: 1204,
        grade_basic: 13654,
        grade_recital: 12450,
        judge_sjust: 1210,
        judge_just: 188,
        judge_good: 12,
        judge_miss: 6,
        judge_near: 4,
        note_rate_standard: 9812,
        note_rate_tenuto: 9934,
        note_rate_glissando: 9742,
        note_rate_trill: 9560,
        besttime: "2026-08-11 21:04",
    };
    await db.playData.upsert({
        where: { user_id_chart_id: { user_id: user.id, chart_id: chart.id } },
        create: {
            ...common,
            difficulty: "Expert",
            user_id: user.id,
            chart_id: chart.id,
            music_idx: index,
        },
        update: common,
    });
    const snapshots = [
        { score: 962880, date: "2026-05-14T12:00:00.000Z" },
        { score: 971220, date: "2026-07-02T12:00:00.000Z" },
        { score: 976654, date: "2026-08-11T12:04:00.000Z" },
    ];
    const existingSyncs = await db.chartRecordSnapshot.findMany({
        where: { user_id: user.id, chart_id: chart.id },
        select: { sync_id: true },
    });
    await db.dataSync.deleteMany({
        where: {
            id: { in: existingSyncs.map((snapshot) => snapshot.sync_id) },
        },
    });
    for (const snapshot of snapshots) {
        const sync = await db.dataSync.create({
            data: {
                user_id: user.id,
                status: "completed",
                sync_scope: "full",
                received_plays: 1,
                changed_records: 1,
                started_at: new Date(snapshot.date),
                completed_at: new Date(snapshot.date),
            },
        });
        await db.chartRecordSnapshot.create({
            data: {
                ...common,
                score: snapshot.score,
                besttime: snapshot.date,
                user_id: user.id,
                chart_id: chart.id,
                sync_id: sync.id,
                created_at: new Date(snapshot.date),
            },
        });
    }
    await db.chartPlayHistory.deleteMany({
        where: { user_id: user.id, chart_id: chart.id },
    });
    for (const [position, source_play_time] of [
        "2026-08-04 20:12",
        "2026-08-09 22:37",
        "2026-08-11 21:04",
    ].entries()) {
        await db.chartPlayHistory.create({
            data: {
                user_id: user.id,
                chart_id: chart.id,
                source_play_time,
                score: snapshots[position].score,
                best_score: snapshots[position].score,
                max_combo: 1204,
                rank: "S",
                grade_basic: 13654,
                fast_count: 20 - position * 4,
                slow_count: 10 + position * 2,
                judge_sjust: 1200 + position * 5,
                judge_just: 190 - position,
                judge_good: 12,
                judge_miss: 6 - position,
                judge_near: 4,
            },
        });
    }
    for (let number = 0; number < 12; number++) {
        const contributor = await db.user.upsert({
            where: { username: `E2E_CONTRIBUTOR_${number + 1}` },
            create: {
                username: `E2E_CONTRIBUTOR_${number + 1}`,
                grade_basic: 568300,
            },
            update: {},
        });
        await db.playData.upsert({
            where: {
                user_id_chart_id: {
                    user_id: contributor.id,
                    chart_id: chart.id,
                },
            },
            create: {
                ...common,
                score: 975000 + number * 100,
                difficulty: "Expert",
                user_id: contributor.id,
                chart_id: chart.id,
                music_idx: index,
            },
            update: {},
        });
        await db.communityChartEvaluation.upsert({
            where: {
                chartId_userId: { chartId: chart.id, userId: contributor.id },
            },
            create: {
                chartId: chart.id,
                userId: contributor.id,
                stairs: number % 5,
                repetition: (number + 2) % 5,
                polyrhythm: number % 3,
                offset: (number + 1) % 4,
                chords: 3,
                opinion: `Local test opinion ${number + 1}. Focus on the repeated notes and changing chord shapes.`,
                opinionUpdatedAt: new Date(
                    `2026-08-${String(number + 1).padStart(2, "0")}T12:00:00Z`
                ),
            },
            update: {},
        });
        for (const goal of ["s", "fc"])
            await db.chartGoalVote.upsert({
                where: {
                    chartId_userId_mode_goal: {
                        chartId: chart.id,
                        userId: contributor.id,
                        mode: "basic",
                        goal,
                    },
                },
                create: {
                    chartId: chart.id,
                    userId: contributor.id,
                    mode: "basic",
                    goal,
                    value: Math.round((12.8 + (number % 6) * 0.1) * 10) / 10,
                },
                update: {},
            });
    }
    console.log("Local NosLog 2.0 UI fixtures are ready.");
} finally {
    await db.$disconnect();
}
