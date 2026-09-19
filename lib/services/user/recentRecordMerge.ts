import {
    calculateBasicGrade,
    type BasicGradeChart,
} from "@/lib/music/basicGrade";
import type { ChartPlayHistory, PlayData } from "@prisma/client";

export type RecordValues = Omit<
    PlayData,
    | "id"
    | "user_id"
    | "chart_id"
    | "music_idx"
    | "difficulty"
    | "created_at"
    | "updated_at"
    | "grade_recital"
> & { grade_recital: number | null };
export type RecentRecordPlay = Pick<
    ChartPlayHistory,
    | "score"
    | "rank"
    | "level"
    | "grade_basic"
    | "max_combo"
    | "source_play_time"
    | "judge_sjust"
    | "judge_just"
    | "judge_good"
    | "judge_miss"
    | "judge_near"
> & { is_onehand?: boolean | null };

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

export function isAfterFullRecord(playTime: string, fullAt: Date | null) {
    const timestamp = recentPlayTimestamp(playTime);
    return (
        timestamp !== null && (fullAt === null || timestamp > fullAt.getTime())
    );
}

export function mergeRecentRecord(
    previous: RecordValues | null,
    play: RecentRecordPlay,
    chart: { level: number } & BasicGradeChart
): RecordValues {
    const pianist = play.score === 1_000_000 || play.rank === "P";
    const fullCombo =
        pianist ||
        (chart.note_count !== null &&
            chart.note_count > 0 &&
            play.max_combo >= chart.note_count);
    const improved = previous === null || play.score > previous.score;
    return {
        level: previous?.level ?? play.level ?? chart.level,
        score: Math.max(previous?.score ?? 0, play.score),
        rank: improved ? play.rank : previous!.rank,
        fc_type: Math.max(
            previous?.fc_type ?? 0,
            pianist ? 3 : fullCombo ? 2 : 0
        ),
        play_count: (previous?.play_count ?? 0) + 1,
        clear_count: previous?.clear_count ?? null,
        clear_flag: previous?.clear_flag ?? null,
        fullcombo_count: (previous?.fullcombo_count ?? 0) + Number(fullCombo),
        pianistic_count: (previous?.pianistic_count ?? 0) + Number(pianist),
        max_combo: Math.max(previous?.max_combo ?? 0, play.max_combo),
        grade_basic: Math.max(
            previous?.grade_basic ?? 0,
            play.grade_basic > 0
                ? play.grade_basic
                : (calculateBasicGrade(play, chart) ?? 0)
        ),
        grade_recital: previous?.grade_recital ?? null,
        judge_sjust: improved ? play.judge_sjust : previous!.judge_sjust,
        judge_just: improved ? play.judge_just : previous!.judge_just,
        judge_good: improved ? play.judge_good : previous!.judge_good,
        judge_miss: improved ? play.judge_miss : previous!.judge_miss,
        judge_near: improved ? play.judge_near : previous!.judge_near,
        note_rate_standard: previous?.note_rate_standard ?? null,
        note_rate_tenuto: previous?.note_rate_tenuto ?? null,
        note_rate_glissando: previous?.note_rate_glissando ?? null,
        note_rate_trill: previous?.note_rate_trill ?? null,
        besttime: improved ? play.source_play_time : previous!.besttime,
    };
}

export interface PendingRecordPlay extends RecentRecordPlay {
    id: number;
    chart_id: number;
    record_applied: boolean;
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
                .filter((play) => !play.record_applied)
                .map((play) => [play.id, play])
        ).values(),
    ];
    for (const play of pending) {
        if (recentPlayTimestamp(play.source_play_time) === null) {
            throw new RangeError("Invalid recent play timestamp");
        }
    }
    pending.sort(
        (a, b) =>
            recentPlayTimestamp(a.source_play_time)! -
                recentPlayTimestamp(b.source_play_time)! || a.id - b.id
    );
    const changes = new Map<number, RecordValues>();
    for (const play of pending) {
        if (!isAfterFullRecord(play.source_play_time, fullAt)) continue;
        const record =
            changes.get(play.chart_id) ?? previous.get(play.chart_id) ?? null;
        changes.set(play.chart_id, mergeRecentRecord(record, play, play.chart));
    }
    // Repair already counted zero-Grd attempts without replaying their count/score updates.
    // Full-import baselines remain authoritative, including after a Pass renewal.
    for (const play of history) {
        if (
            !play.record_applied ||
            play.grade_basic !== 0 ||
            !isAfterFullRecord(play.source_play_time, fullAt)
        )
            continue;
        const record =
            changes.get(play.chart_id) ?? previous.get(play.chart_id);
        if (!record) continue;
        const grade = calculateBasicGrade(play, play.chart);
        if (grade !== null && grade > record.grade_basic) {
            changes.set(play.chart_id, { ...record, grade_basic: grade });
        }
    }
    return { changes, appliedIds: pending.map((play) => play.id) };
}
