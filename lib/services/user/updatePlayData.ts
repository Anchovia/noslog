import db from "@/lib/db";
import type { Prisma } from "@prisma/client";
import type { SyncMusicInput } from "@/lib/services/music/updateMusic";
import {
    getBemaniClearFlag,
    mapBemaniJudgeCounts,
    mapBemaniNoteSuccessRates,
    normalizeBemaniRank,
} from "@/lib/services/user/bemaniRecordMapping";

export async function updatePlayData(
    user_id: number,
    music: SyncMusicInput[],
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
    const previousRecords = await db.playData.findMany({
        where: { user_id, chart_id: { not: null } },
        select: {
            chart_id: true,
            level: true,
            score: true,
            rank: true,
            fc_type: true,
            play_count: true,
            clear_count: true,
            clear_flag: true,
            fullcombo_count: true,
            pianistic_count: true,
            max_combo: true,
            grade_basic: true,
            grade_recital: true,
            judge_sjust: true,
            judge_just: true,
            judge_good: true,
            judge_miss: true,
            judge_near: true,
            note_rate_standard: true,
            note_rate_tenuto: true,
            note_rate_glissando: true,
            note_rate_trill: true,
            besttime: true,
        },
    });
    const previousByChart = new Map(
        previousRecords.map((record) => [record.chart_id, record])
    );

    const changedSnapshots: Prisma.ChartRecordSnapshotCreateManyInput[] = [];

    {
        console.info("(1)기존 플레이 데이터 삭제 완료");
        const newPlayData: Prisma.PlayDataCreateManyInput[] = []; // 새로 생성할 playData 배열
        const score = {
            P: 0,
            F: 0,
            S: 0,
            A2: 0,
            A: 0,
            B2: 0,
            B: 0,
            C: 0,
            D: 0,
        }; // 클리어 랭크 저장 변수

        for (const data of music) {
            for (const sheet of data.sheet) {
                const chart_id =
                    chartIds.get(`${data["@index"]}:${sheet.difficulty}`) ??
                    null;
                if (!chart_id) {
                    continue;
                }
                const normalizedRank = normalizeBemaniRank(sheet.rank);
                // DB에 등록된 채보만 클리어 랭크와 개인 기록에 반영함
                if (normalizedRank in score) {
                    score[normalizedRank as keyof typeof score]++;
                }
                if (sheet.fc_type === 2) {
                    score["F"]++;
                }
                const record = {
                    user_id,
                    music_idx: data["@index"],
                    chart_id,
                    level: sheet.level,
                    difficulty: sheet.difficulty,
                    score: sheet.score,
                    rank: normalizedRank,
                    fc_type: sheet.fc_type,
                    play_count: sheet.play_count,
                    clear_count: sheet.clear_count,
                    clear_flag: getBemaniClearFlag(sheet.clear_flag),
                    fullcombo_count: sheet.fullcombo_count,
                    pianistic_count: sheet.pianistic_count,
                    max_combo: sheet.max_combo,
                    grade_basic: sheet.grade_basic,
                    grade_recital: sheet.grade_recital,
                    ...mapBemaniJudgeCounts(sheet.judge),
                    ...mapBemaniNoteSuccessRates(sheet.note_success_rate),
                    besttime: sheet.besttime,
                };
                newPlayData.push(record);

                const previous = previousByChart.get(chart_id);
                const changed =
                    !previous ||
                    previous.level !== record.level ||
                    previous.score !== record.score ||
                    previous.rank !== record.rank ||
                    previous.fc_type !== record.fc_type ||
                    previous.play_count !== record.play_count ||
                    previous.clear_count !== record.clear_count ||
                    previous.clear_flag !== record.clear_flag ||
                    previous.fullcombo_count !== record.fullcombo_count ||
                    previous.pianistic_count !== record.pianistic_count ||
                    previous.max_combo !== record.max_combo ||
                    previous.grade_basic !== record.grade_basic ||
                    previous.grade_recital !== record.grade_recital ||
                    previous.judge_sjust !== record.judge_sjust ||
                    previous.judge_just !== record.judge_just ||
                    previous.judge_good !== record.judge_good ||
                    previous.judge_miss !== record.judge_miss ||
                    previous.judge_near !== record.judge_near ||
                    previous.note_rate_standard !== record.note_rate_standard ||
                    previous.note_rate_tenuto !== record.note_rate_tenuto ||
                    previous.note_rate_glissando !==
                        record.note_rate_glissando ||
                    previous.note_rate_trill !== record.note_rate_trill ||
                    previous.besttime !== record.besttime;

                if (changed) {
                    changedSnapshots.push({
                        level: record.level,
                        score: record.score,
                        rank: record.rank,
                        fc_type: record.fc_type,
                        play_count: record.play_count,
                        clear_count: record.clear_count,
                        clear_flag: record.clear_flag,
                        fullcombo_count: record.fullcombo_count,
                        pianistic_count: record.pianistic_count,
                        max_combo: record.max_combo,
                        grade_basic: record.grade_basic,
                        grade_recital: record.grade_recital,
                        judge_sjust: record.judge_sjust,
                        judge_just: record.judge_just,
                        judge_good: record.judge_good,
                        judge_miss: record.judge_miss,
                        judge_near: record.judge_near,
                        note_rate_standard: record.note_rate_standard,
                        note_rate_tenuto: record.note_rate_tenuto,
                        note_rate_glissando: record.note_rate_glissando,
                        note_rate_trill: record.note_rate_trill,
                        besttime: record.besttime,
                        chart_id,
                        user_id,
                        sync_id,
                    });
                }
            }
        }

        await db.$transaction([
            db.playData.deleteMany({ where: { user_id } }),
            db.playData.createMany({ data: newPlayData }),
            ...(changedSnapshots.length > 0
                ? [
                      db.chartRecordSnapshot.createMany({
                          data: changedSnapshots,
                      }),
                  ]
                : []),
        ]);
        console.info(`(2)새 플레이 데이터 생성 완료(${newPlayData.length}개)`);
        // 클리어 랭크 유저 데이터 업데이트
        await db.user.update({
            where: { id: user_id },
            data: {
                score_p: score.P,
                score_f: score.F,
                score_s: score.S,
                score_a2: score.A2,
                score_a: score.A,
                score_b2: score.B2,
                score_b: score.B,
                score_c: score.C,
                score_d: score.D,
            },
        });

        const duration = Date.now() - startTime; // 종료 시간
        console.info(`===[플레이 데이터 업데이트 성공(${duration}ms)]===`);
        return changedSnapshots.length;
    }
}
