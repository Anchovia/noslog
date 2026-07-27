import {
    getChartNoteRenderPoints,
    getGlissandoSnapRenderPoints,
} from "./editor";
import {
    CHART_LANE_COUNT,
    type ChartDocument,
    type ChartHand,
    type ChartNoteType,
} from "./schema";
import { tickToMilliseconds } from "./timing";

export interface PlaybackPathPoint {
    lane: number;
    width: number;
    timeMs: number;
    hand: ChartHand;
}

export interface PlaybackTrillSegment {
    startTimeMs: number;
    endTimeMs: number;
    fromLane: number;
    fromWidth: number;
    toLane: number;
    toWidth: number;
}

export interface PreparedPlaybackNote {
    id: string;
    type: ChartNoteType;
    hand: ChartHand;
    startTimeMs: number;
    endTimeMs: number;
    pathPoints: PlaybackPathPoint[];
    trillSegments: PlaybackTrillSegment[];
}

export interface PlaybackProjection {
    left: number;
    right: number;
    center: number;
    y: number;
    depth: number;
}

export interface PlaybackTrajectoryPoint {
    x: number;
    y: number;
    depth: number;
}

export interface PlaybackPianoRange {
    lane: number;
    width: number;
    hand: ChartHand;
}

const PIANO_HIT_WINDOW_MS = 95;

export function getChartPlaybackDurationMs(document: ChartDocument) {
    const lastNoteMs = document.notes.reduce(
        (latest, note) =>
            Math.max(
                latest,
                tickToMilliseconds(
                    note.tick + note.durationTicks,
                    document.timingPoints,
                    document.ticksPerQuarter
                )
            ),
        0
    );

    return Math.max(1_000, document.durationMs, Math.ceil(lastNoteMs + 1_000));
}

export function prepareChartPlaybackNotes(
    document: ChartDocument
): PreparedPlaybackNote[] {
    const toTime = (tick: number) =>
        tickToMilliseconds(
            tick,
            document.timingPoints,
            document.ticksPerQuarter
        );

    return document.notes
        .map((note): PreparedPlaybackNote => {
            const startTimeMs = toTime(note.tick);
            const endTimeMs = toTime(note.tick + note.durationTicks);
            if (note.type === "standard") {
                return {
                    id: note.id,
                    type: note.type,
                    hand: note.hand,
                    startTimeMs,
                    endTimeMs,
                    pathPoints: [
                        {
                            lane: note.lane,
                            width: note.width,
                            timeMs: startTimeMs,
                            hand: note.hand,
                        },
                    ],
                    trillSegments: [],
                };
            }

            if (note.type === "trill") {
                const pairLane = note.pairLane ?? note.lane;
                const pairWidth = note.pairWidth ?? note.width;
                const stepTicks = Math.max(
                    1,
                    Math.round(
                        (document.ticksPerQuarter * 4) /
                            (note.trillSnapDivisor ?? 8)
                    )
                );
                const stepCount = Math.max(
                    1,
                    Math.ceil(note.durationTicks / stepTicks)
                );
                const trillSegments = Array.from(
                    { length: stepCount },
                    (_, index): PlaybackTrillSegment => {
                        const startTick = note.tick + index * stepTicks;
                        const endTick = Math.min(
                            note.tick + note.durationTicks,
                            startTick + stepTicks
                        );
                        const startsAtFirst = index % 2 === 0;
                        return {
                            startTimeMs: toTime(startTick),
                            endTimeMs: toTime(endTick),
                            fromLane: startsAtFirst ? note.lane : pairLane,
                            fromWidth: startsAtFirst ? note.width : pairWidth,
                            toLane: startsAtFirst ? pairLane : note.lane,
                            toWidth: startsAtFirst ? pairWidth : note.width,
                        };
                    }
                );
                const finalSegment = trillSegments.at(-1)!;
                return {
                    id: note.id,
                    type: note.type,
                    hand: note.hand,
                    startTimeMs,
                    endTimeMs,
                    pathPoints: [
                        {
                            lane: note.lane,
                            width: note.width,
                            timeMs: startTimeMs,
                            hand: note.hand,
                        },
                        {
                            lane: finalSegment.toLane,
                            width: finalSegment.toWidth,
                            timeMs: endTimeMs,
                            hand: note.hand,
                        },
                    ],
                    trillSegments,
                };
            }

            const points =
                note.type === "glissando"
                    ? getGlissandoSnapRenderPoints(
                          note,
                          document.ticksPerQuarter
                      )
                    : getChartNoteRenderPoints(note);
            return {
                id: note.id,
                type: note.type,
                hand: note.hand,
                startTimeMs,
                endTimeMs,
                pathPoints: points.map((point) => ({
                    lane: point.lane,
                    width: point.width,
                    timeMs: toTime(point.tick),
                    hand: point.hand,
                })),
                trillSegments: [],
            };
        })
        .sort(
            (first, second) =>
                first.startTimeMs - second.startTimeMs ||
                first.id.localeCompare(second.id)
        );
}

function playbackPathPointAtTime(
    points: PlaybackPathPoint[],
    currentTimeMs: number
) {
    const first = points[0];
    if (!first || currentTimeMs <= first.timeMs) return first;

    const nextIndex = points.findIndex(
        (point) => point.timeMs >= currentTimeMs
    );
    if (nextIndex === -1) return points.at(-1);

    const previous = points[nextIndex - 1];
    const next = points[nextIndex];
    const progress =
        next.timeMs === previous.timeMs
            ? 0
            : (currentTimeMs - previous.timeMs) /
              (next.timeMs - previous.timeMs);
    return {
        lane: previous.lane + (next.lane - previous.lane) * progress,
        width: previous.width + (next.width - previous.width) * progress,
        timeMs: currentTimeMs,
        hand: progress < 0.5 ? previous.hand : next.hand,
    };
}

export function getActivePlaybackPianoRanges(
    notes: PreparedPlaybackNote[],
    currentTimeMs: number
): PlaybackPianoRange[] {
    return notes.flatMap((note) => {
        const isHeldNote = note.type === "tenuto" || note.type === "glissando";
        const isActive = isHeldNote
            ? currentTimeMs >= note.startTimeMs - PIANO_HIT_WINDOW_MS &&
              currentTimeMs <= note.endTimeMs + PIANO_HIT_WINDOW_MS
            : Math.abs(note.startTimeMs - currentTimeMs) <= PIANO_HIT_WINDOW_MS;
        if (!isActive) return [];

        const point = isHeldNote
            ? playbackPathPointAtTime(note.pathPoints, currentTimeMs)
            : note.pathPoints[0];
        return point
            ? [
                  {
                      lane: point.lane,
                      width: point.width,
                      hand: point.hand,
                  },
              ]
            : [];
    });
}

export function getApproachDurationMs(noteSpeed: number) {
    const clampedSpeed = Math.min(4, Math.max(1, noteSpeed));
    return 4_000 / clampedSpeed;
}

function quadraticPoint(
    start: number,
    control: number,
    end: number,
    progress: number
) {
    const inverse = 1 - progress;
    return (
        inverse * inverse * start +
        2 * inverse * progress * control +
        progress * progress * end
    );
}

export function projectPlaybackLane({
    lane,
    progress,
    canvasWidth,
    horizonY,
    judgmentY,
}: {
    lane: number;
    progress: number;
    canvasWidth: number;
    horizonY: number;
    judgmentY: number;
}): PlaybackTrajectoryPoint {
    const clampedProgress = Math.min(1, Math.max(0, progress));
    const judgmentWidth = canvasWidth * 0.94;
    const spawnWidth = judgmentWidth * 0.52;
    const centerX = canvasWidth / 2;
    const normalizedLane = lane / CHART_LANE_COUNT - 0.5;
    const spawnX = centerX + normalizedLane * spawnWidth;
    const judgmentX = centerX + normalizedLane * judgmentWidth;
    const controlX = spawnX + (judgmentX - spawnX) * 0.72;
    const playfieldHeight = judgmentY - horizonY;
    const spawnY = horizonY + playfieldHeight * 0.065;
    const controlY = horizonY - playfieldHeight * 0.22;

    return {
        x: quadraticPoint(spawnX, controlX, judgmentX, clampedProgress),
        y: quadraticPoint(spawnY, controlY, judgmentY, clampedProgress),
        depth: clampedProgress,
    };
}

export function projectPlaybackRange({
    lane,
    width,
    timeMs,
    currentTimeMs,
    approachDurationMs,
    canvasWidth,
    horizonY,
    judgmentY,
}: {
    lane: number;
    width: number;
    timeMs: number;
    currentTimeMs: number;
    approachDurationMs: number;
    canvasWidth: number;
    horizonY: number;
    judgmentY: number;
}): PlaybackProjection {
    const linearProgress = Math.min(
        1,
        Math.max(0, 1 - (timeMs - currentTimeMs) / approachDurationMs)
    );
    const leftPoint = projectPlaybackLane({
        lane,
        progress: linearProgress,
        canvasWidth,
        horizonY,
        judgmentY,
    });
    const rightPoint = projectPlaybackLane({
        lane: lane + width,
        progress: linearProgress,
        canvasWidth,
        horizonY,
        judgmentY,
    });
    const left = leftPoint.x;
    const right = rightPoint.x;

    return {
        left,
        right,
        center: (left + right) / 2,
        y: (leftPoint.y + rightPoint.y) / 2,
        depth: linearProgress,
    };
}
