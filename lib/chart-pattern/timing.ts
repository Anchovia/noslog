import type { ChartTimingPoint } from "./schema";

const MINUTES_TO_MILLISECONDS = 60_000;

function stableFloat(value: number) {
    return Math.round(value * 1_000_000_000) / 1_000_000_000;
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

export interface BeatMarker {
    tick: number;
    timeMs: number;
    accent: boolean;
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

export function formatBpm(bpm: number) {
    return bpm.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}
