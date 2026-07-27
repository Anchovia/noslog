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

export function getApproachDurationMs(noteSpeed: number) {
    const clampedSpeed = Math.min(3, Math.max(1, noteSpeed));
    return 6_000 / clampedSpeed;
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
    const depth = Math.pow(linearProgress, 1.62);
    const horizontalDepth = Math.pow(linearProgress, 0.92);
    const judgmentWidth = canvasWidth * 0.94;
    const visibleWidth = judgmentWidth * (0.58 + horizontalDepth * 0.42);
    const centerX = canvasWidth / 2;
    const xForLane = (value: number) =>
        centerX + (value / CHART_LANE_COUNT - 0.5) * visibleWidth;
    const left = xForLane(lane);
    const right = xForLane(lane + width);

    return {
        left,
        right,
        center: (left + right) / 2,
        y: horizonY + (judgmentY - horizonY) * depth,
        depth,
    };
}
