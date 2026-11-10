import type { PlaybackPathPoint, PlaybackTrillSegment } from "./playback";
import type { ChartHand } from "./schema";

export interface ProjectedRange {
    left: number;
    right: number;
    center: number;
    y: number;
    depth: number;
}

function interpolate(start: number, end: number, progress: number) {
    return start + (end - start) * progress;
}

function interpolatePathPoint(
    first: PlaybackPathPoint,
    second: PlaybackPathPoint,
    timeMs: number
): PlaybackPathPoint {
    const progress =
        second.timeMs === first.timeMs
            ? 0
            : Math.min(
                  1,
                  Math.max(
                      0,
                      (timeMs - first.timeMs) / (second.timeMs - first.timeMs)
                  )
              );
    return {
        lane: interpolate(first.lane, second.lane, progress),
        width: interpolate(first.width, second.width, progress),
        timeMs,
        hand: progress < 0.5 ? first.hand : second.hand,
    };
}

export function clipPathSegment(
    first: PlaybackPathPoint,
    second: PlaybackPathPoint,
    startTimeMs: number,
    endTimeMs: number
) {
    const clippedStart = Math.max(first.timeMs, startTimeMs);
    const clippedEnd = Math.min(second.timeMs, endTimeMs);
    if (clippedStart > clippedEnd) return null;
    return {
        first: interpolatePathPoint(first, second, clippedStart),
        second: interpolatePathPoint(first, second, clippedEnd),
    };
}

export function trillPointAt(
    segment: PlaybackTrillSegment,
    timeMs: number,
    hand: ChartHand
): PlaybackPathPoint {
    const progress =
        segment.endTimeMs === segment.startTimeMs
            ? 0
            : Math.min(
                  1,
                  Math.max(
                      0,
                      (timeMs - segment.startTimeMs) /
                          (segment.endTimeMs - segment.startTimeMs)
                  )
              );
    return {
        lane: interpolate(segment.fromLane, segment.toLane, progress),
        width: interpolate(segment.fromWidth, segment.toWidth, progress),
        timeMs,
        hand,
    };
}

export function sampleProjectedSegment(
    first: PlaybackPathPoint,
    second: PlaybackPathPoint,
    project: (point: PlaybackPathPoint) => ProjectedRange
) {
    const durationMs = Math.abs(second.timeMs - first.timeMs);
    const steps = Math.min(32, Math.max(6, Math.ceil(durationMs / 90)));
    return Array.from({ length: steps + 1 }, (_, index) => {
        const progress = index / steps;
        return project(
            interpolatePathPoint(
                first,
                second,
                interpolate(first.timeMs, second.timeMs, progress)
            )
        );
    });
}
