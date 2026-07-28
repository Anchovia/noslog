import {
    CHART_LANE_COUNT,
    type ChartDocument,
    type ChartHand,
    type ChartNote,
    type ChartNoteType,
} from "./schema";
import { snapTick, tickToMilliseconds } from "./timing";

export const DEFAULT_CHART_EDITOR_DURATION_MS = 5 * 60 * 1_000;
const DEFAULT_JUDGMENT_LINE_RATIO = 0.76;
const PIANO_HEIGHT_RATIO = 0.18;
const MIN_PIANO_HEIGHT = 84;
const MAX_PIANO_HEIGHT = 124;

export interface ChartEditorVerticalLayout {
    judgmentY: number;
    pianoHeight: number;
}

export function getChartEditorVerticalLayout(
    viewHeight: number,
    pianoVisible: boolean
): ChartEditorVerticalLayout {
    if (!pianoVisible) {
        return {
            judgmentY: viewHeight * DEFAULT_JUDGMENT_LINE_RATIO,
            pianoHeight: 0,
        };
    }
    const pianoHeight = Math.min(
        MAX_PIANO_HEIGHT,
        Math.max(MIN_PIANO_HEIGHT, viewHeight * PIANO_HEIGHT_RATIO)
    );
    return {
        judgmentY: Math.max(1, viewHeight - pianoHeight),
        pianoHeight,
    };
}

export interface ChartNoteRenderPoint {
    lane: number;
    width: number;
    tick: number;
    hand: ChartHand;
    sourceIndex: number | null;
}

export interface ChartSelectionRect {
    minLane: number;
    maxLane: number;
    minTick: number;
    maxTick: number;
}

export function getMinimumChartNoteDurationTicks(
    type: ChartNoteType,
    snapDivisor: number,
    ticksPerQuarter: number
) {
    if (type === "standard") return 0;
    if (type !== "tenuto") return 1;
    return Math.max(1, Math.round((ticksPerQuarter * 4) / snapDivisor));
}

export function changeChartNoteHand(
    note: ChartNote,
    hand: ChartHand
): ChartNote {
    return {
        ...note,
        hand,
        points: note.points.map((point) => ({
            ...point,
            hand: undefined,
        })),
    };
}

export function getChartEditorNavigationDurationMs(
    document: Pick<
        ChartDocument,
        "durationMs" | "notes" | "timingPoints" | "ticksPerQuarter"
    >
) {
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
    const lastTimingMs = document.timingPoints.reduce(
        (latest, point) => Math.max(latest, point.timeMs),
        0
    );
    const knownDurationMs = Math.max(
        0,
        document.durationMs,
        lastNoteMs,
        lastTimingMs
    );

    return document.durationMs > 0
        ? knownDurationMs
        : Math.max(DEFAULT_CHART_EDITOR_DURATION_MS, knownDurationMs);
}

export type ChartNoteHorizontalResizeHandle = "left" | "right";

export function getChartNoteHorizontalResizeHandle(
    note: Pick<ChartNote, "lane" | "width">,
    pointerLane: number,
    laneWidthPx: number,
    { includeOutside = false }: { includeOutside?: boolean } = {}
): ChartNoteHorizontalResizeHandle | null {
    const rightLane = note.lane + note.width;

    // Keep a usable move target in the middle of a one-lane note while making
    // each four-pixel visual handle easier to grab.
    const insidePaddingInLanes = Math.min(0.42, 10 / Math.max(1, laneWidthPx));
    const outsidePaddingInLanes = includeOutside
        ? Math.min(0.3, 8 / Math.max(1, laneWidthPx))
        : 0;
    const leftDistance = Math.abs(pointerLane - note.lane);
    const rightDistance = Math.abs(pointerLane - rightLane);
    const leftHit =
        pointerLane >= note.lane - outsidePaddingInLanes &&
        pointerLane <= note.lane + insidePaddingInLanes;
    const rightHit =
        pointerLane >= rightLane - insidePaddingInLanes &&
        pointerLane <= rightLane + outsidePaddingInLanes;
    if (!leftHit && !rightHit) return null;

    return leftHit && (!rightHit || leftDistance <= rightDistance)
        ? "left"
        : "right";
}

function rangesOverlap(
    firstStart: number,
    firstEnd: number,
    secondStart: number,
    secondEnd: number
) {
    return firstStart <= secondEnd && secondStart <= firstEnd;
}

function pointInRect(x: number, y: number, rect: ChartSelectionRect) {
    return (
        x >= rect.minLane &&
        x <= rect.maxLane &&
        y >= rect.minTick &&
        y <= rect.maxTick
    );
}

function orientation(
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number
) {
    return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
}

function segmentsIntersect(
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number,
    dx: number,
    dy: number
) {
    const first = orientation(ax, ay, bx, by, cx, cy);
    const second = orientation(ax, ay, bx, by, dx, dy);
    const third = orientation(cx, cy, dx, dy, ax, ay);
    const fourth = orientation(cx, cy, dx, dy, bx, by);
    const epsilon = 1e-9;
    const onSegment = (
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        pointX: number,
        pointY: number
    ) =>
        pointX >= Math.min(startX, endX) - epsilon &&
        pointX <= Math.max(startX, endX) + epsilon &&
        pointY >= Math.min(startY, endY) - epsilon &&
        pointY <= Math.max(startY, endY) + epsilon;

    if (
        first > epsilon !== second > epsilon &&
        third > epsilon !== fourth > epsilon &&
        Math.abs(first) > epsilon &&
        Math.abs(second) > epsilon &&
        Math.abs(third) > epsilon &&
        Math.abs(fourth) > epsilon
    ) {
        return true;
    }
    if (Math.abs(first) <= epsilon && onSegment(ax, ay, bx, by, cx, cy)) {
        return true;
    }
    if (Math.abs(second) <= epsilon && onSegment(ax, ay, bx, by, dx, dy)) {
        return true;
    }
    if (Math.abs(third) <= epsilon && onSegment(cx, cy, dx, dy, ax, ay)) {
        return true;
    }
    return Math.abs(fourth) <= epsilon && onSegment(cx, cy, dx, dy, bx, by);
}

function polygonIntersectsRect(
    polygon: Array<{ x: number; y: number }>,
    rect: ChartSelectionRect
) {
    if (polygon.some((point) => pointInRect(point.x, point.y, rect))) {
        return true;
    }

    const corners = [
        { x: rect.minLane, y: rect.minTick },
        { x: rect.maxLane, y: rect.minTick },
        { x: rect.maxLane, y: rect.maxTick },
        { x: rect.minLane, y: rect.maxTick },
    ];
    if (
        corners.some((corner) => {
            let inside = false;
            for (
                let index = 0, previous = polygon.length - 1;
                index < polygon.length;
                previous = index, index += 1
            ) {
                const currentPoint = polygon[index];
                const previousPoint = polygon[previous];
                if (
                    currentPoint.y > corner.y !== previousPoint.y > corner.y &&
                    corner.x <
                        ((previousPoint.x - currentPoint.x) *
                            (corner.y - currentPoint.y)) /
                            (previousPoint.y - currentPoint.y) +
                            currentPoint.x
                ) {
                    inside = !inside;
                }
            }
            return inside;
        })
    ) {
        return true;
    }

    for (let index = 0; index < polygon.length; index += 1) {
        const first = polygon[index];
        const second = polygon[(index + 1) % polygon.length];
        for (let edge = 0; edge < corners.length; edge += 1) {
            const rectFirst = corners[edge];
            const rectSecond = corners[(edge + 1) % corners.length];
            if (
                segmentsIntersect(
                    first.x,
                    first.y,
                    second.x,
                    second.y,
                    rectFirst.x,
                    rectFirst.y,
                    rectSecond.x,
                    rectSecond.y
                )
            ) {
                return true;
            }
        }
    }
    return false;
}

export function getChartNoteRenderPoints(
    note: ChartNote
): ChartNoteRenderPoint[] {
    const points: ChartNoteRenderPoint[] = [
        {
            lane: note.lane,
            width: note.width,
            tick: note.tick,
            hand: note.hand,
            sourceIndex: null,
        },
        ...note.points.map((point, sourceIndex) => ({
            lane: point.lane,
            width: point.width,
            tick: note.tick + point.tickOffset,
            hand: point.hand ?? note.hand,
            sourceIndex,
        })),
    ].sort((first, second) => first.tick - second.tick);

    const endTick = note.tick + note.durationTicks;
    if (points.at(-1)?.tick !== endTick) {
        const previous = points.at(-1) ?? points[0];
        points.push({
            ...previous,
            tick: endTick,
            sourceIndex: null,
        });
    }
    return points;
}

export function getGlissandoSnapRenderPoints(
    note: ChartNote,
    ticksPerQuarter: number
): ChartNoteRenderPoint[] {
    const pathPoints = getChartNoteRenderPoints(note);
    if (note.type !== "glissando") return pathPoints;

    const divisor = note.glissandoSnapDivisor ?? 4;
    const stepTicks = Math.max(1, Math.round((ticksPerQuarter * 4) / divisor));
    const endTick = note.tick + note.durationTicks;
    const ticks = new Set(pathPoints.map((point) => point.tick));
    for (let tick = note.tick; tick < endTick; tick += stepTicks) {
        ticks.add(tick);
    }
    ticks.add(endTick);

    return [...ticks]
        .sort((first, second) => first - second)
        .map((tick) => {
            const pathPoint = pathPoints.find((point) => point.tick === tick);
            if (pathPoint) return pathPoint;

            return {
                ...chartNoteRangeAtTick(note, tick),
                tick,
                sourceIndex: null,
            };
        });
}

export function chartNoteRangeAtTick(note: ChartNote, tick: number) {
    if (note.type === "trill") {
        const divisor = note.trillSnapDivisor ?? 8;
        const stepTicks = Math.max(1, Math.round((480 * 4) / divisor));
        const step = Math.max(0, Math.floor((tick - note.tick) / stepTicks));
        return step % 2 === 0
            ? { lane: note.lane, width: note.width, hand: note.hand }
            : {
                  lane: note.pairLane ?? note.lane,
                  width: note.pairWidth ?? note.width,
                  hand: note.hand,
              };
    }

    const points = getChartNoteRenderPoints(note);
    const nextIndex = points.findIndex((point) => point.tick >= tick);
    if (nextIndex <= 0) {
        const point = points[Math.max(0, nextIndex)];
        return {
            lane: point.lane,
            width: point.width,
            hand: point.hand,
        };
    }
    if (nextIndex === -1) {
        const point = points.at(-1)!;
        return {
            lane: point.lane,
            width: point.width,
            hand: point.hand,
        };
    }
    const previous = points[nextIndex - 1];
    const next = points[nextIndex];
    const progress =
        next.tick === previous.tick
            ? 0
            : (tick - previous.tick) / (next.tick - previous.tick);
    return {
        lane: previous.lane + (next.lane - previous.lane) * progress,
        width: previous.width + (next.width - previous.width) * progress,
        hand: progress < 0.5 ? previous.hand : next.hand,
    };
}

export function chartNoteContainsPoint(
    note: ChartNote,
    lane: number,
    tick: number,
    tickPadding = 0
) {
    if (note.type === "standard") {
        return (
            Math.abs(tick - note.tick) <= tickPadding &&
            lane >= note.lane &&
            lane <= note.lane + note.width
        );
    }

    const endTick = note.tick + note.durationTicks;
    if (tick < note.tick - tickPadding || tick > endTick + tickPadding) {
        return false;
    }

    if (note.type === "trill") {
        return [
            { lane: note.lane, width: note.width },
            {
                lane: note.pairLane ?? note.lane,
                width: note.pairWidth ?? note.width,
            },
        ].some(
            (range) => lane >= range.lane && lane <= range.lane + range.width
        );
    }

    const range = chartNoteRangeAtTick(
        note,
        Math.min(endTick, Math.max(note.tick, tick))
    );
    return lane >= range.lane && lane <= range.lane + range.width;
}

interface ChartNoteOccupancySegment {
    startTick: number;
    endTick: number;
    startLane: number;
    startWidth: number;
    endLane: number;
    endWidth: number;
}

export interface ChartNoteConflict {
    firstId: string;
    secondId: string;
}

function occupancySegments(
    note: ChartNote,
    ticksPerQuarter: number
): ChartNoteOccupancySegment[] {
    if (note.type === "standard") {
        return [
            {
                startTick: note.tick,
                endTick: note.tick,
                startLane: note.lane,
                startWidth: note.width,
                endLane: note.lane,
                endWidth: note.width,
            },
        ];
    }

    if (note.type === "trill") {
        const pairLane = note.pairLane ?? note.lane;
        const pairWidth = note.pairWidth ?? note.width;
        const stepTicks = Math.max(
            1,
            Math.round((ticksPerQuarter * 4) / (note.trillSnapDivisor ?? 8))
        );
        const endTick = note.tick + note.durationTicks;
        const segments: ChartNoteOccupancySegment[] = [];
        for (
            let startTick = note.tick, index = 0;
            startTick < endTick;
            startTick += stepTicks, index += 1
        ) {
            const fromFirst = index % 2 === 0;
            segments.push({
                startTick,
                endTick: Math.min(endTick, startTick + stepTicks),
                startLane: fromFirst ? note.lane : pairLane,
                startWidth: fromFirst ? note.width : pairWidth,
                endLane: fromFirst ? pairLane : note.lane,
                endWidth: fromFirst ? pairWidth : note.width,
            });
        }
        return segments;
    }

    const points = getChartNoteRenderPoints(note);
    return points.slice(0, -1).map((point, index) => {
        const next = points[index + 1];
        return {
            startTick: point.tick,
            endTick: next.tick,
            startLane: point.lane,
            startWidth: point.width,
            endLane: next.lane,
            endWidth: next.width,
        };
    });
}

function occupancyAt(segment: ChartNoteOccupancySegment, tick: number) {
    const progress =
        segment.endTick === segment.startTick
            ? 0
            : (tick - segment.startTick) /
              (segment.endTick - segment.startTick);
    const lane =
        segment.startLane + (segment.endLane - segment.startLane) * progress;
    const width =
        segment.startWidth + (segment.endWidth - segment.startWidth) * progress;
    return { lane, right: lane + width };
}

function laneRangesOverlap(
    first: ReturnType<typeof occupancyAt>,
    second: ReturnType<typeof occupancyAt>
) {
    const epsilon = 0.000001;
    return (
        first.lane < second.right - epsilon &&
        second.lane < first.right - epsilon
    );
}

function occupancySegmentsOverlap(
    first: ChartNoteOccupancySegment,
    second: ChartNoteOccupancySegment
) {
    const startTick = Math.max(first.startTick, second.startTick);
    const endTick = Math.min(first.endTick, second.endTick);
    if (startTick > endTick) return false;

    const candidates = [startTick, endTick];
    if (startTick < endTick) {
        const firstStart = occupancyAt(first, startTick);
        const firstEnd = occupancyAt(first, endTick);
        const secondStart = occupancyAt(second, startTick);
        const secondEnd = occupancyAt(second, endTick);
        const boundaries = [
            [
                firstStart.lane - secondStart.right,
                firstEnd.lane - secondEnd.right,
            ],
            [
                secondStart.lane - firstStart.right,
                secondEnd.lane - firstEnd.right,
            ],
        ];
        for (const [startValue, endValue] of boundaries) {
            const difference = endValue - startValue;
            if (Math.abs(difference) < 0.000001) continue;
            const root =
                startTick + (-startValue * (endTick - startTick)) / difference;
            if (root > startTick && root < endTick) candidates.push(root);
        }
    }

    const sorted = [...new Set(candidates)].sort((a, b) => a - b);
    const ticksToCheck = [...sorted];
    for (let index = 0; index < sorted.length - 1; index += 1) {
        ticksToCheck.push((sorted[index] + sorted[index + 1]) / 2);
    }
    return ticksToCheck.some((tick) =>
        laneRangesOverlap(occupancyAt(first, tick), occupancyAt(second, tick))
    );
}

export function chartNotesOverlap(
    first: ChartNote,
    second: ChartNote,
    ticksPerQuarter: number
) {
    const firstEnd = first.tick + first.durationTicks;
    const secondEnd = second.tick + second.durationTicks;
    if (first.tick > secondEnd || second.tick > firstEnd) return false;

    const firstSegments = occupancySegments(first, ticksPerQuarter);
    const secondSegments = occupancySegments(second, ticksPerQuarter);
    return firstSegments.some((firstSegment) =>
        secondSegments.some((secondSegment) =>
            occupancySegmentsOverlap(firstSegment, secondSegment)
        )
    );
}

function conflictKey({ firstId, secondId }: ChartNoteConflict) {
    return firstId < secondId
        ? `${firstId}\u0000${secondId}`
        : `${secondId}\u0000${firstId}`;
}

export function findChartNoteConflicts(
    notes: ChartNote[],
    ticksPerQuarter: number
) {
    const sorted = [...notes].sort(
        (first, second) =>
            first.tick - second.tick ||
            first.durationTicks - second.durationTicks
    );
    const active: ChartNote[] = [];
    const conflicts: ChartNoteConflict[] = [];

    for (const note of sorted) {
        for (let index = active.length - 1; index >= 0; index -= 1) {
            if (active[index].tick + active[index].durationTicks < note.tick) {
                active.splice(index, 1);
            }
        }
        for (const candidate of active) {
            if (chartNotesOverlap(candidate, note, ticksPerQuarter)) {
                conflicts.push({
                    firstId: candidate.id,
                    secondId: note.id,
                });
            }
        }
        active.push(note);
    }
    return conflicts;
}

export function hasNewChartNoteConflicts(
    previous: ChartNote[],
    next: ChartNote[],
    ticksPerQuarter: number
) {
    const previousKeys = new Set(
        findChartNoteConflicts(previous, ticksPerQuarter).map(conflictKey)
    );
    return findChartNoteConflicts(next, ticksPerQuarter).some(
        (conflict) => !previousKeys.has(conflictKey(conflict))
    );
}

export function resizeChartNoteHorizontally(
    note: ChartNote,
    edge: "left" | "right",
    targetLane: number
): ChartNote {
    const noteRight = note.lane + note.width;
    if (note.type !== "trill") {
        if (edge === "left") {
            const lane = Math.min(
                noteRight - 1,
                Math.max(0, Math.round(targetLane))
            );
            return { ...note, lane, width: noteRight - lane };
        }
        const right = Math.min(
            CHART_LANE_COUNT,
            Math.max(note.lane + 1, Math.round(targetLane) + 1)
        );
        return { ...note, width: right - note.lane };
    }

    const pairLane = note.pairLane ?? note.lane;
    const pairWidth = note.pairWidth ?? note.width;
    const pairRight = pairLane + pairWidth;
    if (edge === "left") {
        const requestedLane = Math.min(
            noteRight - 1,
            Math.max(0, Math.round(targetLane))
        );
        const requestedDelta = requestedLane - note.lane;
        const laneDelta = Math.min(
            Math.min(note.width - 1, pairWidth - 1),
            Math.max(Math.max(-note.lane, -pairLane), requestedDelta)
        );
        return {
            ...note,
            lane: note.lane + laneDelta,
            width: note.width - laneDelta,
            pairLane: pairLane + laneDelta,
            pairWidth: pairWidth - laneDelta,
        };
    }

    const requestedRight = Math.min(
        CHART_LANE_COUNT,
        Math.max(note.lane + 1, Math.round(targetLane) + 1)
    );
    const requestedDelta = requestedRight - noteRight;
    const widthDelta = Math.min(
        Math.min(CHART_LANE_COUNT - noteRight, CHART_LANE_COUNT - pairRight),
        Math.max(Math.max(1 - note.width, 1 - pairWidth), requestedDelta)
    );
    return {
        ...note,
        width: note.width + widthDelta,
        pairLane,
        pairWidth: pairWidth + widthDelta,
    };
}

export function moveGlissandoSnapAnchor(
    note: ChartNote,
    tickOffset: number,
    laneDelta: number
): ChartNote {
    if (note.type !== "glissando") return note;

    const clampedTickOffset = Math.min(
        note.durationTicks,
        Math.max(0, Math.round(tickOffset))
    );
    const existingPoint = note.points.find(
        (point) => point.tickOffset === clampedTickOffset
    );
    const range = chartNoteRangeAtTick(note, note.tick + clampedTickOffset);
    const width = Math.min(
        CHART_LANE_COUNT,
        Math.max(1, Math.round(existingPoint?.width ?? range.width))
    );
    const originalLane = Math.round(existingPoint?.lane ?? range.lane);
    const lane = Math.min(
        CHART_LANE_COUNT - width,
        Math.max(0, originalLane + Math.round(laneDelta))
    );

    if (clampedTickOffset === 0) {
        return {
            ...note,
            lane,
            width,
            points: note.points.filter((point) => point.tickOffset !== 0),
        };
    }

    return {
        ...note,
        points: [
            ...note.points.filter(
                (point) => point.tickOffset !== clampedTickOffset
            ),
            {
                tickOffset: clampedTickOffset,
                lane,
                width,
                hand: existingPoint?.hand ?? range.hand,
            },
        ].sort((first, second) => first.tickOffset - second.tickOffset),
    };
}

export function chartNoteIntersectsRect(
    note: ChartNote,
    rect: ChartSelectionRect
) {
    const normalized = {
        minLane: Math.min(rect.minLane, rect.maxLane),
        maxLane: Math.max(rect.minLane, rect.maxLane),
        minTick: Math.min(rect.minTick, rect.maxTick),
        maxTick: Math.max(rect.minTick, rect.maxTick),
    };

    if (note.type === "standard") {
        return (
            note.tick >= normalized.minTick &&
            note.tick <= normalized.maxTick &&
            rangesOverlap(
                note.lane,
                note.lane + note.width,
                normalized.minLane,
                normalized.maxLane
            )
        );
    }

    const noteEnd = note.tick + note.durationTicks;
    if (
        !rangesOverlap(
            note.tick,
            noteEnd,
            normalized.minTick,
            normalized.maxTick
        )
    ) {
        return false;
    }

    if (note.type === "trill") {
        return [
            { lane: note.lane, width: note.width },
            {
                lane: note.pairLane ?? note.lane,
                width: note.pairWidth ?? note.width,
            },
        ].some((range) =>
            rangesOverlap(
                range.lane,
                range.lane + range.width,
                normalized.minLane,
                normalized.maxLane
            )
        );
    }

    const points = getChartNoteRenderPoints(note);
    for (let index = 0; index < points.length - 1; index += 1) {
        const first = points[index];
        const second = points[index + 1];
        if (
            !rangesOverlap(
                first.tick,
                second.tick,
                normalized.minTick,
                normalized.maxTick
            )
        ) {
            continue;
        }
        const polygon = [
            { x: first.lane, y: first.tick },
            { x: first.lane + first.width, y: first.tick },
            { x: second.lane + second.width, y: second.tick },
            { x: second.lane, y: second.tick },
        ];
        if (polygonIntersectsRect(polygon, normalized)) return true;
    }
    return false;
}

function noteHorizontalBounds(note: ChartNote) {
    const ranges = [
        { lane: note.lane, width: note.width },
        ...note.points,
        ...(note.pairLane !== undefined && note.pairWidth !== undefined
            ? [{ lane: note.pairLane, width: note.pairWidth }]
            : []),
    ];
    return {
        min: Math.min(...ranges.map((range) => range.lane)),
        max: Math.max(...ranges.map((range) => range.lane + range.width)),
    };
}

export function moveChartNotes(
    notes: ChartNote[],
    selectedIds: string[],
    laneDelta: number,
    tickDelta: number
) {
    const selected = new Set(selectedIds);
    const targets = notes.filter((note) => selected.has(note.id));
    if (targets.length === 0) return notes;

    const bounds = targets.map(noteHorizontalBounds);
    const minLane = Math.min(...bounds.map((bound) => bound.min));
    const maxLane = Math.max(...bounds.map((bound) => bound.max));
    const minTick = Math.min(...targets.map((note) => note.tick));
    const clampedLaneDelta = Math.min(
        CHART_LANE_COUNT - maxLane,
        Math.max(-minLane, Math.round(laneDelta))
    );
    const clampedTickDelta = Math.max(
        -10_000_000 - minTick,
        Math.round(tickDelta)
    );

    return notes.map((note) => {
        if (!selected.has(note.id)) return note;
        return {
            ...note,
            tick: note.tick + clampedTickDelta,
            lane: note.lane + clampedLaneDelta,
            pairLane:
                note.pairLane === undefined
                    ? undefined
                    : note.pairLane + clampedLaneDelta,
            points: note.points.map((point) => ({
                ...point,
                lane: point.lane + clampedLaneDelta,
            })),
        };
    });
}

export function moveChartNotesToSnap(
    notes: ChartNote[],
    selectedIds: string[],
    laneDelta: number,
    pointerTickDelta: number,
    anchorTick: number,
    snapDivisor: number,
    ticksPerQuarter: number
) {
    const snappedAnchorTick = snapTick(
        anchorTick + pointerTickDelta,
        snapDivisor,
        ticksPerQuarter
    );
    return moveChartNotes(
        notes,
        selectedIds,
        laneDelta,
        snappedAnchorTick - anchorTick
    );
}

export function flipChartNotesHorizontally(
    notes: ChartNote[],
    selectedIds: string[]
) {
    const selected = new Set(selectedIds);
    return notes.map((note) => {
        if (!selected.has(note.id)) return note;
        return {
            ...note,
            lane: CHART_LANE_COUNT - note.lane - note.width,
            pairLane:
                note.pairLane === undefined || note.pairWidth === undefined
                    ? undefined
                    : CHART_LANE_COUNT - note.pairLane - note.pairWidth,
            points: note.points.map((point) => ({
                ...point,
                lane: CHART_LANE_COUNT - point.lane - point.width,
            })),
        };
    });
}

export function cloneChartNotesAtTick(
    sourceNotes: ChartNote[],
    anchorTick: number,
    createId: () => string
) {
    if (sourceNotes.length === 0) return [];
    const firstTick = Math.min(...sourceNotes.map((note) => note.tick));
    const tickDelta = Math.round(anchorTick - firstTick);
    return sourceNotes.map((note) => ({
        ...structuredClone(note),
        id: createId(),
        tick: note.tick + tickDelta,
    }));
}
