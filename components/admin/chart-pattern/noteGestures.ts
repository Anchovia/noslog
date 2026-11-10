import {
    clampChartLane,
    getMinimumChartNoteDurationTicks,
    moveChartNotes,
    moveChartNotesToSnap,
    resizeChartNoteHorizontally,
} from "@/lib/chart-pattern/editor";
import {
    CHART_LANE_COUNT,
    type ChartHand,
    type ChartNote,
} from "@/lib/chart-pattern/schema";

import type { NoteEditorTool } from "./pixiNoteEditor";

export interface HoverPreviewPosition {
    lane: number;
    tick: number;
}

interface CreateGesture {
    kind: "create";
    startLane: number;
    startTick: number;
    currentLane: number;
    currentTick: number;
    forceOneLane: boolean;
}

interface MoveGesture {
    kind: "move";
    selectedIds: string[];
    anchorTick: number;
    startLane: number;
    startTick: number;
    currentLane: number;
    currentTick: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
}

interface ResizeGesture {
    kind: "resize";
    action: "left" | "right" | "end";
    original: ChartNote;
    startLane: number;
    startTick: number;
    currentLane: number;
    currentTick: number;
}

interface PointGesture {
    kind: "point";
    original: ChartNote;
    pointIndex: number;
    startLane: number;
    startTick: number;
    currentLane: number;
    currentTick: number;
}

interface GlissandoAnchorGesture {
    kind: "glissando-anchor";
    original: ChartNote;
    tickOffset: number;
    startLane: number;
    startTick: number;
    currentLane: number;
    currentTick: number;
}

interface MarqueeGesture {
    kind: "marquee";
    startLaneFloat: number;
    startRawTick: number;
    currentLaneFloat: number;
    currentRawTick: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    additive: boolean;
    initialSelection: string[];
}

export type NoteGesture =
    | CreateGesture
    | MoveGesture
    | ResizeGesture
    | PointGesture
    | GlissandoAnchorGesture
    | MarqueeGesture;

const MOVE_DRAG_THRESHOLD_PX = 4;

function hasMoveGestureDragged(gesture: MoveGesture) {
    return (
        Math.hypot(
            gesture.currentX - gesture.startX,
            gesture.currentY - gesture.startY
        ) >= MOVE_DRAG_THRESHOLD_PX
    );
}

export function moveNotesForGesture(
    notes: ChartNote[],
    gesture: MoveGesture,
    snapDivisor: number,
    ticksPerQuarter: number
) {
    const laneDelta = gesture.currentLane - gesture.startLane;
    const tickDelta = gesture.currentTick - gesture.startTick;
    if (!hasMoveGestureDragged(gesture)) {
        return moveChartNotes(notes, gesture.selectedIds, laneDelta, tickDelta);
    }
    return moveChartNotesToSnap(
        notes,
        gesture.selectedIds,
        laneDelta,
        tickDelta,
        gesture.anchorTick,
        snapDivisor,
        ticksPerQuarter
    );
}

export function buildPreviewNote({
    gesture,
    tool,
    hand,
    width,
    ticksPerQuarter,
    snapDivisor,
}: {
    gesture: CreateGesture;
    tool: Exclude<NoteEditorTool, "select">;
    hand: ChartHand;
    width: number;
    ticksPerQuarter: number;
    snapDivisor: number;
}): ChartNote {
    if (tool === "standard") {
        const movedAtLeastOneLane =
            !gesture.forceOneLane &&
            Math.abs(gesture.currentLane - gesture.startLane) >= 1;
        const lane = movedAtLeastOneLane
            ? Math.min(gesture.startLane, gesture.currentLane)
            : clampChartLane(
                  gesture.startLane,
                  gesture.forceOneLane ? 1 : width
              );
        const noteWidth = movedAtLeastOneLane
            ? Math.abs(gesture.currentLane - gesture.startLane) + 1
            : Math.min(
                  gesture.forceOneLane ? 1 : width,
                  CHART_LANE_COUNT - lane
              );
        return {
            id: "preview",
            type: tool,
            hand,
            tick: gesture.startTick,
            durationTicks: 0,
            lane,
            width: noteWidth,
            points: [],
        };
    }

    const earlierIsStart = gesture.startTick <= gesture.currentTick;
    const startTick = Math.min(gesture.startTick, gesture.currentTick);
    const minimumDuration = Math.max(
        1,
        Math.round((ticksPerQuarter * 4) / snapDivisor)
    );
    const durationTicks = Math.max(
        Math.abs(gesture.currentTick - gesture.startTick),
        minimumDuration
    );
    const firstLane = earlierIsStart ? gesture.startLane : gesture.currentLane;
    const lastLane = earlierIsStart ? gesture.currentLane : gesture.startLane;
    const lane = clampChartLane(firstLane, width);
    const endLane = clampChartLane(lastLane, width);

    if (tool === "trill") {
        return {
            id: "preview",
            type: tool,
            hand,
            tick: startTick,
            durationTicks,
            lane,
            width,
            pairLane:
                endLane === lane
                    ? clampChartLane(lane + width, width)
                    : endLane,
            pairWidth: width,
            trillSnapDivisor: snapDivisor,
            points: [],
        };
    }

    return {
        id: "preview",
        type: tool,
        hand,
        tick: startTick,
        durationTicks,
        lane,
        width,
        glissandoSnapDivisor: tool === "glissando" ? snapDivisor : undefined,
        points:
            tool === "glissando" && endLane !== lane
                ? [
                      {
                          tickOffset: durationTicks,
                          lane: endLane,
                          width,
                          hand,
                      },
                  ]
                : [],
    };
}

export function buildHoverPreviewNote({
    position,
    tool,
    hand,
    width,
    ticksPerQuarter,
    snapDivisor,
}: {
    position: HoverPreviewPosition;
    tool: Exclude<NoteEditorTool, "select">;
    hand: ChartHand;
    width: number;
    ticksPerQuarter: number;
    snapDivisor: number;
}): ChartNote {
    return {
        ...buildPreviewNote({
            gesture: {
                kind: "create",
                startLane: position.lane,
                startTick: position.tick,
                currentLane: position.lane,
                currentTick: position.tick,
                forceOneLane: false,
            },
            tool,
            hand,
            width,
            ticksPerQuarter,
            snapDivisor,
        }),
        id: "hover-preview",
    };
}

export function buildResizedNote(
    gesture: ResizeGesture,
    snapDivisor: number,
    ticksPerQuarter: number
): ChartNote {
    const note = gesture.original;
    if (gesture.action === "left" || gesture.action === "right") {
        return resizeChartNoteHorizontally(
            note,
            gesture.action,
            gesture.currentLane
        );
    }
    const durationTicks = Math.max(
        getMinimumChartNoteDurationTicks(
            note.type,
            snapDivisor,
            ticksPerQuarter
        ),
        gesture.currentTick - note.tick
    );
    return {
        ...note,
        durationTicks,
        points: note.points
            .filter((point) => point.tickOffset <= durationTicks)
            .map((point) => ({
                ...point,
                tickOffset: Math.min(point.tickOffset, durationTicks),
            })),
    };
}

export function buildPointEditedNote(gesture: PointGesture): ChartNote {
    const note = gesture.original;
    const point = note.points[gesture.pointIndex];
    if (!point) return note;
    const width = Math.min(point.width, CHART_LANE_COUNT);
    const nextPoint = {
        ...point,
        lane: clampChartLane(gesture.currentLane, width),
        tickOffset: Math.min(
            note.durationTicks - 1,
            Math.max(1, gesture.currentTick - note.tick)
        ),
    };
    return {
        ...note,
        points: note.points
            .map((value, index) =>
                index === gesture.pointIndex ? nextPoint : value
            )
            .sort((first, second) => first.tickOffset - second.tickOffset),
    };
}

export function replacePreviewNote(
    notes: ChartNote[],
    originalId: string,
    preview: ChartNote
) {
    return notes.map((note) => (note.id === originalId ? preview : note));
}

export function selectedNotesFrom(notes: ChartNote[], selectedIds: string[]) {
    const ids = new Set(selectedIds);
    return notes.filter((note) => ids.has(note.id));
}
