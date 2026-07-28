import type { ChartTimingPoint } from "./schema";

const MINUTES_TO_MILLISECONDS = 60_000;

function stableFloat(value: number) {
    const rounded = Math.round(value * 1_000_000_000) / 1_000_000_000;
    return Object.is(rounded, -0) ? 0 : rounded;
}

export function sortTimingPoints(points: ChartTimingPoint[]) {
    return [...points].sort((a, b) => a.tick - b.tick || a.timeMs - b.timeMs);
}

export function millisecondsPerTick(bpm: number, ticksPerQuarter: number) {
    return MINUTES_TO_MILLISECONDS / bpm / ticksPerQuarter;
}

export function tickToMilliseconds(
    tick: number,
    points: ChartTimingPoint[],
    ticksPerQuarter: number
) {
    const sorted = sortTimingPoints(points);
    const anchor =
        [...sorted].reverse().find((point) => point.tick <= tick) ?? sorted[0];
    return stableFloat(
        anchor.timeMs +
            ((tick - anchor.tick) * MINUTES_TO_MILLISECONDS) /
                anchor.bpm /
                ticksPerQuarter
    );
}

export function millisecondsToTick(
    timeMs: number,
    points: ChartTimingPoint[],
    ticksPerQuarter: number
) {
    const sorted = [...points].sort(
        (a, b) => a.timeMs - b.timeMs || a.tick - b.tick
    );
    const anchor =
        [...sorted].reverse().find((point) => point.timeMs <= timeMs) ??
        sorted[0];
    return stableFloat(
        anchor.tick +
            ((timeMs - anchor.timeMs) * anchor.bpm * ticksPerQuarter) /
                MINUTES_TO_MILLISECONDS
    );
}

export function snapTick(
    tick: number,
    divisor: number,
    ticksPerQuarter: number
) {
    const step = (ticksPerQuarter * 4) / divisor;
    return Math.round(tick / step) * step;
}

export function moveTickBySnapSteps(
    tick: number,
    divisor: number,
    ticksPerQuarter: number,
    steps: number
) {
    const step = (ticksPerQuarter * 4) / divisor;
    const wholeSteps = Math.trunc(steps);
    if (wholeSteps === 0) return stableFloat(tick);
    const position = tick / step;
    const baseIndex =
        wholeSteps > 0
            ? Math.floor(position + 0.000000001)
            : Math.ceil(position - 0.000000001);
    return stableFloat((baseIndex + wholeSteps) * step);
}

export interface BeatMarker {
    tick: number;
    timeMs: number;
    accent: boolean;
}

export interface SnapGridMarker {
    tick: number;
    timeMs: number;
    subdivision: number;
}

function greatestCommonDivisor(first: number, second: number) {
    let left = Math.abs(Math.round(first));
    let right = Math.abs(Math.round(second));
    while (right !== 0) {
        const remainder = left % right;
        left = right;
        right = remainder;
    }
    return Math.max(1, left);
}

export function getSnapGridSubdivision(snapIndex: number, divisor: number) {
    const safeDivisor = Math.max(1, Math.round(divisor));
    const position =
        ((Math.round(snapIndex) % safeDivisor) + safeDivisor) % safeDivisor;
    if (position === 0) return 1;
    return safeDivisor / greatestCommonDivisor(position, safeDivisor);
}

export function getSnapGridMarkers(
    points: ChartTimingPoint[],
    ticksPerQuarter: number,
    divisor: number,
    startMs: number,
    endMs: number
) {
    if (
        endMs <= startMs ||
        points.length === 0 ||
        !Number.isFinite(divisor) ||
        divisor <= 0
    ) {
        return [] satisfies SnapGridMarker[];
    }

    const sorted = sortTimingPoints(points);
    const stepTicks = (ticksPerQuarter * 4) / divisor;
    const markers: SnapGridMarker[] = [];

    for (let index = 0; index < sorted.length; index += 1) {
        const point = sorted[index];
        const nextPoint = sorted[index + 1];
        const segmentStartMs = Math.max(startMs, point.timeMs);
        const segmentEndMs = Math.min(endMs, nextPoint?.timeMs ?? endMs);
        if (segmentEndMs < segmentStartMs) continue;

        const firstVisibleTick = millisecondsToTick(
            segmentStartMs,
            [point],
            ticksPerQuarter
        );
        const firstSnapIndex = Math.ceil(
            (firstVisibleTick - 0.000001) / stepTicks
        );

        for (let snapIndex = firstSnapIndex; ; snapIndex += 1) {
            const tick = stableFloat(snapIndex * stepTicks);
            const timeMs = tickToMilliseconds(tick, [point], ticksPerQuarter);
            if (timeMs > segmentEndMs + 0.001) break;
            if (
                timeMs >= startMs - 0.001 &&
                timeMs <= endMs + 0.001 &&
                (!nextPoint || timeMs < nextPoint.timeMs - 0.001)
            ) {
                markers.push({
                    tick,
                    timeMs,
                    subdivision: getSnapGridSubdivision(snapIndex, divisor),
                });
            }
        }
    }

    return markers;
}

export function getBeatMarkers(
    points: ChartTimingPoint[],
    ticksPerQuarter: number,
    startMs: number,
    endMs: number
) {
    if (endMs <= startMs || points.length === 0) return [];

    const sorted = sortTimingPoints(points);
    const markers: BeatMarker[] = [];

    for (let index = 0; index < sorted.length; index += 1) {
        const point = sorted[index];
        const nextPoint = sorted[index + 1];
        const segmentStartMs = Math.max(startMs, point.timeMs);
        const segmentEndMs = Math.min(endMs, nextPoint?.timeMs ?? endMs);
        if (segmentEndMs < segmentStartMs) continue;

        const beatTicks = (ticksPerQuarter * 4) / point.denominator;
        const firstBeatIndex = Math.ceil(
            (millisecondsToTick(segmentStartMs, [point], ticksPerQuarter) -
                point.tick) /
                beatTicks
        );

        for (let beatIndex = Math.max(0, firstBeatIndex); ; beatIndex += 1) {
            const tick = point.tick + beatIndex * beatTicks;
            const timeMs = tickToMilliseconds(tick, [point], ticksPerQuarter);
            if (timeMs > segmentEndMs + 0.001) break;
            if (
                timeMs >= startMs - 0.001 &&
                timeMs <= endMs + 0.001 &&
                (!nextPoint || timeMs < nextPoint.timeMs - 0.001)
            ) {
                markers.push({
                    tick,
                    timeMs,
                    accent: beatIndex % point.numerator === 0,
                });
            }
        }
    }

    return markers;
}

export function formatEditorTime(timeMs: number) {
    const safe = Math.max(0, Math.round(timeMs));
    const minutes = Math.floor(safe / 60_000);
    const seconds = Math.floor((safe % 60_000) / 1_000);
    const milliseconds = safe % 1_000;
    return `${minutes}:${String(seconds).padStart(2, "0")}.${String(
        milliseconds
    ).padStart(3, "0")}`;
}

export function formatRevisionDateTime(value: string | number | Date) {
    const timestamp =
        value instanceof Date ? value.getTime() : new Date(value).getTime();
    if (!Number.isFinite(timestamp)) return "-";

    // KST는 일광 절약 시간이 없으므로 실행 환경의 로케일에 맡기지 않고
    // UTC 기준으로 9시간을 더해 항상 같은 24시간 문자열을 만든다.
    const kst = new Date(timestamp + 9 * 60 * 60 * 1_000);
    const month = String(kst.getUTCMonth() + 1).padStart(2, "0");
    const day = String(kst.getUTCDate()).padStart(2, "0");
    const hour = String(kst.getUTCHours()).padStart(2, "0");
    const minute = String(kst.getUTCMinutes()).padStart(2, "0");

    return `${month}. ${day}. ${hour}:${minute}`;
}

export function formatBpm(bpm: number) {
    return bpm.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}
