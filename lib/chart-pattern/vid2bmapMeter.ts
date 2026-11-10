import { CHART_TICKS_PER_QUARTER } from "./schema";
import type { ChartTimingPoint } from "./schema";
import {
    activeTimingPoint,
    beatTicksOf,
    sortTimingPoints,
    tickToMilliseconds,
} from "./timing";
import {
    VID2BMAP_DUPLICATE_FRAMES,
    vid2bmapBeatPosition,
} from "./vid2bmapConvert";
import type { Vid2bmapRawNote } from "./vid2bmapConvert";
import type { Vid2bmapResult } from "./vid2bmapFile";
import { FIRST_NOTE_EARLY_BEATS } from "./vid2bmapShared";
import type { Vid2bmapTempoChange, Vid2bmapTempoPoint } from "./vid2bmapTempo";

/** 박자 추정에서 테누토 · 트릴 시작의 무게 — 긴 음은 센박에 온다(Altale · アルストロメリア 둘 다 이 값에서 박자 · 마디 첫 박이 맞음, 노트 수만이면 アルストロメリア 마디 첫 박이 틀림) */
const METER_LONG_NOTE_WEIGHT = 3;
/** 「뚜렷함」: 고른 주기 강세가 이 값 이상이고 다른 주기의 2배 이상 */
const METER_CLEAR_SCORE = 0.15;

export interface Vid2bmapMeter {
    numerator: 3 | 4;
    clear: boolean;
    /** 마디 첫 박인 박자선 번호의 나머지(박자선 번호 % numerator) */
    phase: number;
    scores: { 3: number; 4: number };
}

/**
 * 박자표 · 마디 첫 박 추정(2026-09-24 A) — 게임은 박마다 같은 선을 그려 마디선이 없어, 박 머리 강세가 몇 박마다 되풀이되는지로 본다.
 * 강세 = 박자선 ±3프레임 안 노트 수(테누토 · 트릴 시작은 ×3). 주기마다 「가장 센 위치 − 평균」 ÷ 평균을 비교(3 vs 4).
 */
export function estimateVid2bmapMeter(
    result: Vid2bmapResult,
    notes: Vid2bmapRawNote[]
): Vid2bmapMeter | null {
    const rows = result.barRows;
    if (rows.length < 16) return null;
    const accents = rows.map((row) =>
        notes
            .filter(
                (note) =>
                    note.kind !== "glissando" &&
                    Math.abs(note.y - row) <= VID2BMAP_DUPLICATE_FRAMES
            )
            .reduce(
                (sum, note) =>
                    sum +
                    (note.kind === "standard" ? 1 : METER_LONG_NOTE_WEIGHT),
                0
            )
    );
    const measure = (period: number) => {
        const phases = Array.from({ length: period }, (_, phase) => {
            const values = accents.filter(
                (_, index) => index % period === phase
            );
            return (
                values.reduce((sum, value) => sum + value, 0) / values.length
            );
        });
        const mean = phases.reduce((sum, value) => sum + value, 0) / period;
        const best = Math.max(...phases);
        return {
            score: mean > 0 ? (best - mean) / mean : 0,
            phase: phases.indexOf(best),
        };
    };
    const three = measure(3);
    const four = measure(4);
    if (three.score === 0 && four.score === 0) return null;
    const chosen = three.score > four.score ? three : four;
    const other = three.score > four.score ? four : three;
    return {
        numerator: three.score > four.score ? 3 : 4,
        clear:
            chosen.score >= METER_CLEAR_SCORE &&
            chosen.score >= other.score * 2,
        phase: chosen.phase,
        scores: {
            3: Math.round(three.score * 100) / 100,
            4: Math.round(four.score * 100) / 100,
        },
    };
}

/** 추정한 마디 첫 박으로 첫 박자선 — 첫 노트가 든 박 이하의 마지막 마디 첫 박이 1마디 1박(없으면 첫 마디 첫 박, 첫 노트는 0마디 못갖춘마디) */
export function vid2bmapMeterFirstBarTick(
    barRows: number[],
    notes: Vid2bmapRawNote[],
    meter: Vid2bmapMeter,
    timingPoints: ChartTimingPoint[]
) {
    const origin = sortTimingPoints(timingPoints)[0];
    const first = notes[0];
    if (!first) return origin.tick;
    const firstBeat = Math.floor(
        vid2bmapBeatPosition(barRows, first.y) + FIRST_NOTE_EARLY_BEATS
    );
    const downbeats = Array.from(
        { length: Math.max(1, firstBeat + meter.numerator + 1) },
        (_, index) => index
    ).filter((index) => index % meter.numerator === meter.phase);
    const measureStart =
        [...downbeats].reverse().find((index) => index <= firstBeat) ??
        downbeats[0];
    return origin.tick - measureStart * beatTicksOf(origin);
}

/**
 * 마디선 맞춤 포인트(2026-09-25 마, osu! 식) — 에디터는 타이밍 포인트마다 마디를 새로 시작하므로, 카드의 마지막 포인트가
 * 곡의 마디 첫 박이 아니면 다음 마디 첫 박에 같은 BPM 포인트를 하나 더 둬 마디선을 곡에 다시 맞춘다.
 * 곡의 마디 = 넣기 전 타이밍(시작 박자 제안 포함)의 마디. 다음 마디 첫 박까지 다른 포인트가 있으면 그 포인트에 맡긴다
 */
export function vid2bmapBarRestore(
    change: Vid2bmapTempoChange,
    timingPoints: ChartTimingPoint[],
    changes: Vid2bmapTempoChange[]
): Vid2bmapTempoPoint | null {
    const sorted = sortTimingPoints(timingPoints);
    const last = change.points[change.points.length - 1];
    const point = activeTimingPoint(sorted, last.tick);
    const measureTicks = beatTicksOf(point) * point.numerator;
    const offset = (last.tick - point.tick) % measureTicks;
    if (offset === 0) return null;
    const tick = last.tick - offset + measureTicks;
    const between = (candidate: number) =>
        candidate > last.tick && candidate <= tick;
    if (
        sorted.some((existing) => between(existing.tick)) ||
        changes.some((other) =>
            other.points.some((candidate) => between(candidate.tick))
        )
    ) {
        return null;
    }
    return { tick, bpm: last.bpm };
}

/** 제안 카드의 포인트(마디선 맞춤 포함)를 타이밍 포인트로 — 시각(ms)은 앞 타이밍(앞 제안 포함)에서 이어 계산, 박자표는 앞 구간을 잇는다 */
export function applyVid2bmapTempoChanges(
    timingPoints: ChartTimingPoint[],
    changes: Vid2bmapTempoChange[],
    createId: () => string = () => `timing-${crypto.randomUUID()}`
) {
    let points = sortTimingPoints(timingPoints);
    const restores = changes.flatMap((change) => {
        const restore = vid2bmapBarRestore(change, timingPoints, changes);
        return restore ? [restore] : [];
    });
    for (const change of [
        ...changes.flatMap((group) => group.points),
        ...restores,
    ].sort((a, b) => a.tick - b.tick)) {
        const previous = activeTimingPoint(points, change.tick);
        // 에디터와 같은 계산(앞 타이밍 · 앞 제안 기준)
        const timeMs = tickToMilliseconds(
            change.tick,
            points,
            CHART_TICKS_PER_QUARTER
        );
        points = sortTimingPoints([
            ...points,
            {
                id: createId(),
                tick: change.tick,
                timeMs: Math.round(timeMs * 1000) / 1000,
                bpm: change.bpm,
                numerator: previous.numerator,
                denominator: previous.denominator,
            },
        ]);
    }
    return points;
}
