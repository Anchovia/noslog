import type { ChartPlayHistory, PlayData } from "@prisma/client";

import {
    type BasicGradeChart,
    calculateBasicGrade,
} from "@/lib/music/basic-grade";

export type RecordValues = Omit<
    PlayData,
    "id" | "userId" | "chartId" | "createdAt" | "updatedAt" | "gradeRecital"
> & { gradeRecital: number | null };
export type RecentRecordPlay = Pick<
    ChartPlayHistory,
    | "score"
    | "rank"
    | "level"
    | "gradeBasic"
    | "maxCombo"
    | "playedAt"
    | "judgeSjust"
    | "judgeJust"
    | "judgeGood"
    | "judgeMiss"
    | "judgeNear"
> & { isOnehand?: boolean | null };

// BEMANI timestamps have minute precision and use the Korean/Japanese calendar.
export function recentPlayTimestamp(value: string): number | null {
    const match =
        /^(\d{4})[-/.](\d{2})[-/.](\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(
            value
        );
    if (!match) return null;
    const [, year, month, day, hour, minute, second = "00"] = match;
    const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}+09:00`;
    const timestamp = Date.parse(iso);
    if (!Number.isFinite(timestamp)) return null;
    // Date.parse normalizes invalid calendar days; do not count those.
    if (
        new Date(timestamp + 9 * 3600000).toISOString().slice(0, 19) !==
        `${year}-${month}-${day}T${hour}:${minute}:${second}`
    )
        return null;
    return timestamp;
}

// 기록 시각을 timestamptz 로(2026-10-16 DB 재설계 P3) — 모르면 null. 「1970-01-01 09:00」(= 0) 은 시각 없음 자리표시다
export function recordBestAt(besttime: string): Date | null {
    const timestamp = recentPlayTimestamp(besttime);
    return timestamp === null || timestamp <= 0 ? null : new Date(timestamp);
}

export function isAfterFullRecord(playedAt: Date, fullAt: Date | null) {
    return fullAt === null || playedAt.getTime() > fullAt.getTime();
}

export function mergeRecentRecord(
    previous: RecordValues | null,
    play: RecentRecordPlay,
    chart: { level: number } & BasicGradeChart
): RecordValues {
    const pianist = play.score === 1_000_000 || play.rank === "P";
    const comboKept =
        pianist ||
        (chart.noteCount !== null &&
            chart.noteCount > 0 &&
            play.maxCombo >= chart.noteCount);
    // 공식 램프와 같게(2026-10-16 K1): NEAR 가 섞이면 1(노란 F, FC 로 세지 않음), 없으면 2(무지개 F)
    const nearFullCombo = comboKept && !pianist && (play.judgeNear ?? 0) > 0;
    const fullCombo = comboKept && !nearFullCombo;
    const improved = previous === null || play.score > previous.score;
    return {
        level: previous?.level ?? play.level ?? chart.level,
        score: Math.max(previous?.score ?? 0, play.score),
        rank: improved ? play.rank : previous!.rank,
        fcType: Math.max(
            previous?.fcType ?? 0,
            pianist ? 3 : fullCombo ? 2 : nearFullCombo ? 1 : 0
        ),
        playCount: (previous?.playCount ?? 0) + 1,
        clearCount: previous?.clearCount ?? null,
        clearFlag: previous?.clearFlag ?? null,
        fullcomboCount: (previous?.fullcomboCount ?? 0) + Number(fullCombo),
        pianisticCount: (previous?.pianisticCount ?? 0) + Number(pianist),
        maxCombo: Math.max(previous?.maxCombo ?? 0, play.maxCombo),
        gradeBasic: Math.max(
            previous?.gradeBasic ?? 0,
            play.gradeBasic > 0
                ? play.gradeBasic
                : (calculateBasicGrade(play, chart) ?? 0)
        ),
        gradeRecital: previous?.gradeRecital ?? null,
        judgeSjust: improved ? play.judgeSjust : previous!.judgeSjust,
        judgeJust: improved ? play.judgeJust : previous!.judgeJust,
        judgeGood: improved ? play.judgeGood : previous!.judgeGood,
        judgeMiss: improved ? play.judgeMiss : previous!.judgeMiss,
        judgeNear: improved ? play.judgeNear : previous!.judgeNear,
        noteRateStandard: previous?.noteRateStandard ?? null,
        noteRateTenuto: previous?.noteRateTenuto ?? null,
        noteRateGlissando: previous?.noteRateGlissando ?? null,
        noteRateTrill: previous?.noteRateTrill ?? null,
        // 기록 시각은 timestamptz 하나로(2026-10-16 P5-1 — 문자열 besttime 은 쓰지 않는다)
        bestAt: improved ? play.playedAt : previous!.bestAt,
    };
}

export interface PendingRecordPlay extends RecentRecordPlay {
    id: number;
    chartId: number;
    recordApplied: boolean;
    chart: { level: number } & BasicGradeChart;
}

/** Pure projection plan. The caller must commit the values and receipts together. */
export function planRecentRecordMerge(
    previous: ReadonlyMap<number, RecordValues>,
    history: readonly PendingRecordPlay[],
    fullAt: Date | null
) {
    const pending = [
        ...new Map(
            history
                .filter((play) => !play.recordApplied)
                .map((play) => [play.id, play])
        ).values(),
    ];
    pending.sort(
        (a, b) => a.playedAt.getTime() - b.playedAt.getTime() || a.id - b.id
    );
    const changes = new Map<number, RecordValues>();
    for (const play of pending) {
        if (!isAfterFullRecord(play.playedAt, fullAt)) continue;
        const record =
            changes.get(play.chartId) ?? previous.get(play.chartId) ?? null;
        changes.set(play.chartId, mergeRecentRecord(record, play, play.chart));
    }
    // Repair already counted zero-Grd attempts without replaying their count/score updates.
    // Full-import baselines remain authoritative, including after a Pass renewal.
    for (const play of history) {
        if (
            !play.recordApplied ||
            play.gradeBasic !== 0 ||
            !isAfterFullRecord(play.playedAt, fullAt)
        )
            continue;
        const record = changes.get(play.chartId) ?? previous.get(play.chartId);
        if (!record) continue;
        const grade = calculateBasicGrade(play, play.chart);
        if (grade !== null && grade > record.gradeBasic) {
            changes.set(play.chartId, { ...record, gradeBasic: grade });
        }
    }
    return { changes, appliedIds: pending.map((play) => play.id) };
}
