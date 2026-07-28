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

export interface MeasurePanel {
    index: number;
    startMs: number;
    endMs: number;
}

export interface MeasureMarker extends BeatMarker {
    measureNumber: number;
    bpm: number;
    numerator: number;
    denominator: number;
    showBpm: boolean;
    showTimeSignature: boolean;
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

export function getMeasureMarkers(
    points: ChartTimingPoint[],
    ticksPerQuarter: number,
    endMs: number
) {
    if (points.length === 0) {
        return [] satisfies MeasureMarker[];
    }

    const sorted = sortTimingPoints(points);
    if (endMs <= sorted[0].timeMs) {
        return [] satisfies MeasureMarker[];
    }
    const rangeStartMs = Math.min(0, sorted[0].timeMs);
    const boundaries = getBeatMarkers(
        sorted,
        ticksPerQuarter,
        rangeStartMs,
        endMs
    ).filter((marker) => marker.accent);

    return boundaries.map((marker, index) => {
        const timingPointIndex = sorted.findIndex(
            (point) =>
                Math.abs(point.tick - marker.tick) <= 0.000001 &&
                Math.abs(point.timeMs - marker.timeMs) <= 0.001
        );
        const activePoint =
            timingPointIndex >= 0
                ? sorted[timingPointIndex]
                : ([...sorted]
                      .reverse()
                      .find((point) => point.tick <= marker.tick) ?? sorted[0]);
        const previousPoint =
            timingPointIndex > 0 ? sorted[timingPointIndex - 1] : null;
        const isTimingPoint = timingPointIndex >= 0;

        return {
            ...marker,
            measureNumber: index + 1,
            bpm: activePoint.bpm,
            numerator: activePoint.numerator,
            denominator: activePoint.denominator,
            showBpm:
                isTimingPoint &&
                (previousPoint === null ||
                    activePoint.bpm !== previousPoint.bpm),
            showTimeSignature:
                isTimingPoint &&
                (previousPoint === null ||
                    activePoint.numerator !== previousPoint.numerator ||
                    activePoint.denominator !== previousPoint.denominator),
        };
    });
}

export function getMeasurePanels(
    points: ChartTimingPoint[],
    ticksPerQuarter: number,
    durationMs: number,
    measuresPerPanel = 4,
    { completeLastPanel = false }: { completeLastPanel?: boolean } = {}
) {
    const chartEndMs = Math.max(0, durationMs);
    if (
        (chartEndMs === 0 && !completeLastPanel) ||
        points.length === 0 ||
        !Number.isFinite(ticksPerQuarter) ||
        ticksPerQuarter <= 0
    ) {
        return [
            {
                index: 0,
                startMs: 0,
                endMs: chartEndMs,
            },
        ] satisfies MeasurePanel[];
    }

    const allSorted = sortTimingPoints(points);
    const sorted = completeLastPanel
        ? allSorted.filter((point) => point.timeMs <= chartEndMs + 0.001)
        : allSorted;
    if (sorted.length === 0) {
        sorted.push(allSorted[0]);
    }
    const panelMeasureCount = Math.max(1, Math.round(measuresPerPanel));
    const activePoint =
        [...sorted]
            .reverse()
            .find((point) => point.timeMs <= chartEndMs + 0.001) ?? sorted[0];
    const measureDurationMs =
        (MINUTES_TO_MILLISECONDS / activePoint.bpm) *
        ((4 * activePoint.numerator) / activePoint.denominator);
    const boundarySearchEndMs = completeLastPanel
        ? Math.max(chartEndMs, activePoint.timeMs, sorted[0].timeMs) +
          measureDurationMs * panelMeasureCount +
          1
        : chartEndMs;
    const rangeStartMs = Math.min(0, sorted[0].timeMs);
    const measureBoundaries: number[] = [];

    for (let index = 0; index < sorted.length; index += 1) {
        const point = sorted[index];
        const nextPoint = sorted[index + 1];
        const segmentStartMs = Math.max(rangeStartMs, point.timeMs);
        const segmentEndMs = Math.min(
            boundarySearchEndMs,
            nextPoint?.timeMs ?? boundarySearchEndMs
        );
        if (segmentEndMs < segmentStartMs) continue;

        const beatTicks = (ticksPerQuarter * 4) / point.denominator;
        const measureTicks = beatTicks * point.numerator;
        const firstVisibleTick = millisecondsToTick(
            segmentStartMs,
            [point],
            ticksPerQuarter
        );
        const firstMeasureIndex = Math.max(
            0,
            Math.ceil((firstVisibleTick - point.tick - 0.000001) / measureTicks)
        );

        for (let measureIndex = firstMeasureIndex; ; measureIndex += 1) {
            const tick = point.tick + measureIndex * measureTicks;
            const timeMs = tickToMilliseconds(tick, [point], ticksPerQuarter);
            if (timeMs > segmentEndMs + 0.001) break;
            if (
                timeMs >= rangeStartMs - 0.001 &&
                (!nextPoint || timeMs < nextPoint.timeMs - 0.001)
            ) {
                measureBoundaries.push(timeMs);
            }
        }
    }

    const boundaries = measureBoundaries
        .sort((first, second) => first - second)
        .filter(
            (timeMs, index, values) =>
                index === 0 || Math.abs(timeMs - values[index - 1]) > 0.001
        );
    if (boundaries.length === 0) {
        return [
            {
                index: 0,
                startMs: 0,
                endMs: chartEndMs,
            },
        ] satisfies MeasurePanel[];
    }

    const lastBoundaryAtOrBeforeStart = boundaries.findLastIndex(
        (timeMs) => timeMs <= 0.001
    );
    const anchorIndex =
        lastBoundaryAtOrBeforeStart >= 0 ? lastBoundaryAtOrBeforeStart : 0;
    const panels: MeasurePanel[] = [];
    let panelStartMs = 0;
    let measureCount = 0;

    for (let index = anchorIndex + 1; index < boundaries.length; index += 1) {
        const boundaryMs = boundaries[index];
        if (boundaryMs <= 0.001) continue;
        measureCount += 1;
        if (measureCount < panelMeasureCount) continue;

        const panelEndMs = completeLastPanel
            ? boundaryMs
            : Math.min(chartEndMs, boundaryMs);
        if (panelEndMs > panelStartMs + 0.001) {
            panels.push({
                index: panels.length,
                startMs: panelStartMs,
                endMs: panelEndMs,
            });
            panelStartMs = panelEndMs;
        }
        measureCount = 0;
        if (panelStartMs >= chartEndMs - 0.001) break;
    }

    if (
        (!completeLastPanel && panelStartMs < chartEndMs - 0.001) ||
        panels.length === 0
    ) {
        panels.push({
            index: panels.length,
            startMs: panelStartMs,
            endMs: chartEndMs,
        });
    }

    return panels;
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
