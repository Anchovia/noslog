/**
 * 스냅 확인 — 에디터 스냅(1/1 ~ 1/32) 어느 격자에도 올라가지 않은 노트 찾기(2026-09-24 C).
 * osu! 에디터 검사 「Unsnapped hitobjects」 와 같은 생각: 가장 가까운 격자에서 벗어난 노트를 목록으로 보이고 한 번에 맞춘다.
 * 영상 추출은 박마다 격자를 골라 맞추고, 어느 격자에도 안 맞는 노트만 영상 위치 그대로 넣는다 — 그 노트가 여기 걸린다.
 * 노트 시작만 본다(길이는 가져올 때 격자 단위로 맞춘다).
 */
import type { ChartDocument, ChartNote, ChartTimingPoint } from "./schema";
import { sortTimingPoints, tickToMilliseconds } from "./timing";

/** 에디터 스냅 선택지와 같은 격자 */
export const CHART_SNAP_CHECK_DIVISORS = [
    1, 2, 3, 4, 6, 8, 12, 16, 24, 32,
] as const;

export interface OffGridNote {
    id: string;
    tick: number;
    /** 가장 가까운 격자 자리(같은 거리면 성긴 격자) */
    nearestTick: number;
    divisor: number;
    /** 가장 가까운 격자 대비 어긋남(ms, + 는 늦음) */
    offsetMs: number;
}

function activePoint(sorted: ChartTimingPoint[], tick: number) {
    let point = sorted[0];
    for (const candidate of sorted) {
        if (candidate.tick <= tick) point = candidate;
        else break;
    }
    return point;
}

function nearestGrid(
    tick: number,
    sorted: ChartTimingPoint[],
    ticksPerQuarter: number
) {
    const point = activePoint(sorted, tick);
    const beatTicks = (ticksPerQuarter * 4) / point.denominator;
    const offset = tick - point.tick;
    let best = { tick, divisor: 1, distance: Number.POSITIVE_INFINITY };
    for (const divisor of CHART_SNAP_CHECK_DIVISORS) {
        const step = beatTicks / divisor;
        const snapped = point.tick + Math.round(offset / step) * step;
        const distance = Math.abs(tick - snapped);
        if (distance < best.distance - 1e-9) {
            best = { tick: snapped, divisor, distance };
        }
    }
    return best;
}

/** 격자에서 반 틱 넘게 벗어난 노트(틱 순) */
export function findOffGridNotes(
    document: Pick<ChartDocument, "notes" | "timingPoints" | "ticksPerQuarter">
): OffGridNote[] {
    const sorted = sortTimingPoints(document.timingPoints);
    if (sorted.length === 0) return [];
    const result: OffGridNote[] = [];
    for (const note of document.notes) {
        const nearest = nearestGrid(
            note.tick,
            sorted,
            document.ticksPerQuarter
        );
        if (nearest.distance <= 0.5) continue;
        const nearestTick = Math.round(nearest.tick);
        result.push({
            id: note.id,
            tick: note.tick,
            nearestTick,
            divisor: nearest.divisor,
            offsetMs:
                tickToMilliseconds(
                    note.tick,
                    document.timingPoints,
                    document.ticksPerQuarter
                ) -
                tickToMilliseconds(
                    nearestTick,
                    document.timingPoints,
                    document.ticksPerQuarter
                ),
        });
    }
    return result.sort((a, b) => a.tick - b.tick || a.id.localeCompare(b.id));
}

/** 고른 노트를 가장 가까운 격자로(길이 · 칸은 그대로) */
export function snapNotesToNearestGrid(
    document: Pick<ChartDocument, "notes" | "timingPoints" | "ticksPerQuarter">,
    ids: ReadonlySet<string>
): ChartNote[] {
    const nearest = new Map(
        findOffGridNotes(document).map((item) => [item.id, item.nearestTick])
    );
    return document.notes.map((note) => {
        const tick = ids.has(note.id) ? nearest.get(note.id) : undefined;
        return tick === undefined ? note : { ...note, tick };
    });
}
