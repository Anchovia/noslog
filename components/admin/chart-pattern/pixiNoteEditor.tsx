"use client";

import {
    type PointerEvent as ReactPointerEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import type { Application, Graphics } from "pixi.js";

import {
    chartNoteContainsPoint,
    chartNoteIntersectsRect,
    chartNoteRangeAtTick,
    cloneChartNotesAtTick,
    findChartNoteConflicts,
    flipChartNotesHorizontally,
    getChartEditorNavigationDurationMs,
    getChartNoteHorizontalResizeHandle,
    getChartNoteRenderPoints,
    getGlissandoSnapRenderPoints,
    moveGlissandoSnapAnchor,
    moveChartNotes,
    resizeChartNoteHorizontally,
} from "@/lib/chart-pattern/editor";
import {
    CHART_LANE_COUNT,
    isChartLaneGroupBoundary,
    type ChartHand,
    type ChartNote,
    type ChartNoteType,
} from "@/lib/chart-pattern/schema";
import {
    getBeatMarkers,
    getSnapGridMarkers,
    millisecondsToTick,
    moveTickBySnapSteps,
    snapTick,
    tickToMilliseconds,
} from "@/lib/chart-pattern/timing";

import { useChartEditorStore } from "./chartEditorStore";

export type NoteEditorTool = "select" | ChartNoteType;

interface PointerPosition {
    lane: number;
    laneFloat: number;
    tick: number;
    rawTick: number;
    x: number;
    y: number;
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
    startLane: number;
    startTick: number;
    currentLane: number;
    currentTick: number;
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

type NoteGesture =
    | CreateGesture
    | MoveGesture
    | ResizeGesture
    | PointGesture
    | GlissandoAnchorGesture
    | MarqueeGesture;

interface PixiRuntime {
    Graphics: typeof import("pixi.js").Graphics;
}

const snapDivisors = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32];
const DURATION_RESIZE_HIT_RADIUS_PX = 7;

const colors = {
    background: 0x080a0f,
    laneStrong: 0x30333c,
    laneWeak: 0x1b1f27,
    snapWhite: 0xe7e9ee,
    snapRed: 0xa75a62,
    snapPurpleStrong: 0x806b9a,
    snapBlue: 0x52769b,
    snapPurpleWeak: 0x685a78,
    snapYellow: 0x75673f,
    snapGrayStrong: 0x555a63,
    snapGray: 0x464b54,
    snapGrayWeak: 0x383d45,
    left: 0x52d9e8,
    right: 0xf05d5d,
    noteFace: 0xf7f7f2,
    noteShadow: 0x121820,
    judgment: 0x79df62,
    preview: 0xfacc15,
    selection: 0xf2c75c,
    conflict: 0xf0646d,
};

function colorForHand(hand: ChartHand) {
    return hand === "left" ? colors.left : colors.right;
}

function styleForSnapSubdivision(subdivision: number) {
    if (subdivision === 1) {
        return { color: colors.snapWhite, width: 1.35, alpha: 0.96 };
    }
    if (subdivision === 2) {
        return { color: colors.snapRed, width: 1.05, alpha: 0.8 };
    }
    if (subdivision === 3) {
        return {
            color: colors.snapPurpleStrong,
            width: 0.95,
            alpha: 0.72,
        };
    }
    if (subdivision === 4) {
        return { color: colors.snapBlue, width: 0.85, alpha: 0.64 };
    }
    if (subdivision === 6) {
        return {
            color: colors.snapPurpleWeak,
            width: 0.75,
            alpha: 0.56,
        };
    }
    if (subdivision === 8) {
        return { color: colors.snapYellow, width: 0.65, alpha: 0.5 };
    }
    if (subdivision === 12) {
        return {
            color: colors.snapGrayStrong,
            width: 0.58,
            alpha: 0.44,
        };
    }
    if (subdivision === 16) {
        return { color: colors.snapGray, width: 0.52, alpha: 0.38 };
    }
    if (subdivision === 24) {
        return {
            color: colors.snapGrayWeak,
            width: 0.46,
            alpha: 0.32,
        };
    }
    return { color: colors.snapGrayWeak, width: 0.42, alpha: 0.27 };
}

function clampLane(lane: number, width = 1) {
    return Math.min(CHART_LANE_COUNT - width, Math.max(0, Math.round(lane)));
}

function buildPreviewNote({
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
            : clampLane(gesture.startLane, gesture.forceOneLane ? 1 : width);
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
    const lane = clampLane(firstLane, width);
    const endLane = clampLane(lastLane, width);

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
                endLane === lane ? clampLane(lane + width, width) : endLane,
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

function buildResizedNote(gesture: ResizeGesture): ChartNote {
    const note = gesture.original;
    if (gesture.action === "left" || gesture.action === "right") {
        return resizeChartNoteHorizontally(
            note,
            gesture.action,
            gesture.currentLane
        );
    }
    const durationTicks = Math.max(1, gesture.currentTick - note.tick);
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

function buildPointEditedNote(gesture: PointGesture): ChartNote {
    const note = gesture.original;
    const point = note.points[gesture.pointIndex];
    if (!point) return note;
    const width = Math.min(point.width, CHART_LANE_COUNT);
    const nextPoint = {
        ...point,
        lane: clampLane(gesture.currentLane, width),
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

function replacePreviewNote(
    notes: ChartNote[],
    originalId: string,
    preview: ChartNote
) {
    return notes.map((note) => (note.id === originalId ? preview : note));
}

function selectedNotesFrom(notes: ChartNote[], selectedIds: string[]) {
    const ids = new Set(selectedIds);
    return notes.filter((note) => ids.has(note.id));
}

export default function PixiNoteEditor({
    pixelsPerSecond,
    tool,
    hand,
    defaultWidth,
    onSeek,
    onToolChange,
}: {
    pixelsPerSecond: number;
    tool: NoteEditorTool;
    hand: ChartHand;
    defaultWidth: number;
    onSeek: (timeMs: number) => void;
    onToolChange: (tool: NoteEditorTool) => void;
}) {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const applicationRef = useRef<Application | null>(null);
    const runtimeRef = useRef<PixiRuntime | null>(null);
    const clipboardRef = useRef<ChartNote[]>([]);
    const [rendererReady, setRendererReady] = useState(false);
    const [gesture, setGesture] = useState<NoteGesture | null>(null);
    const [isResizeHandleHovered, setIsResizeHandleHovered] = useState(false);
    const [isAnchorHovered, setIsAnchorHovered] = useState(false);
    const [isDurationHandleHovered, setIsDurationHandleHovered] =
        useState(false);
    const document = useChartEditorStore((state) => state.document);
    const currentTimeMs = useChartEditorStore((state) => state.currentTimeMs);
    const snapDivisor = useChartEditorStore((state) => state.snapDivisor);
    const selectedNoteIds = useChartEditorStore(
        (state) => state.selectedNoteIds
    );
    const selectNotes = useChartEditorStore((state) => state.selectNotes);
    const toggleNoteSelection = useChartEditorStore(
        (state) => state.toggleNoteSelection
    );
    const replaceNotes = useChartEditorStore((state) => state.replaceNotes);
    const setSnapDivisor = useChartEditorStore((state) => state.setSnapDivisor);
    const navigationDurationMs = getChartEditorNavigationDurationMs(document);
    const conflictingNoteIds = useMemo(() => {
        const ids = new Set<string>();
        for (const conflict of findChartNoteConflicts(
            document.notes,
            document.ticksPerQuarter
        )) {
            ids.add(conflict.firstId);
            ids.add(conflict.secondId);
        }
        return ids;
    }, [document.notes, document.ticksPerQuarter]);

    const previewNotes = (() => {
        if (!gesture) return document.notes;
        if (gesture.kind === "move") {
            return moveChartNotes(
                document.notes,
                gesture.selectedIds,
                gesture.currentLane - gesture.startLane,
                gesture.currentTick - gesture.startTick
            );
        }
        if (gesture.kind === "resize") {
            return replacePreviewNote(
                document.notes,
                gesture.original.id,
                buildResizedNote(gesture)
            );
        }
        if (gesture.kind === "point") {
            return replacePreviewNote(
                document.notes,
                gesture.original.id,
                buildPointEditedNote(gesture)
            );
        }
        if (gesture.kind === "glissando-anchor") {
            return replacePreviewNote(
                document.notes,
                gesture.original.id,
                moveGlissandoSnapAnchor(
                    gesture.original,
                    gesture.tickOffset,
                    gesture.currentLane - gesture.startLane
                )
            );
        }
        if (gesture.kind === "create" && tool !== "select") {
            return [
                ...document.notes,
                buildPreviewNote({
                    gesture,
                    tool,
                    hand,
                    width: defaultWidth,
                    ticksPerQuarter: document.ticksPerQuarter,
                    snapDivisor,
                }),
            ];
        }
        return document.notes;
    })();

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;
        let disposed = false;
        let application: Application | null = null;

        void (async () => {
            const pixi = await import("pixi.js");
            if (disposed) return;
            const nextApplication = new pixi.Application();
            await nextApplication.init({
                resizeTo: host,
                antialias: true,
                backgroundAlpha: 0,
                preference: "webgl",
                autoStart: false,
            });
            if (disposed) {
                nextApplication.destroy(true, { children: true });
                return;
            }
            application = nextApplication;
            applicationRef.current = nextApplication;
            runtimeRef.current = { Graphics: pixi.Graphics };
            nextApplication.canvas.className = "block h-full w-full touch-none";
            nextApplication.canvas.setAttribute("aria-hidden", "true");
            host.appendChild(nextApplication.canvas);
            setRendererReady(true);
        })();

        return () => {
            disposed = true;
            runtimeRef.current = null;
            applicationRef.current = null;
            application?.destroy(true, { children: true });
        };
    }, []);

    const renderScene = useCallback(() => {
        const application = applicationRef.current;
        const runtime = runtimeRef.current;
        const host = hostRef.current;
        if (!application || !runtime || !host) return;

        const width = host.clientWidth;
        const height = host.clientHeight;
        if (width <= 0 || height <= 0) return;
        application.renderer.resize(width, height);
        const removed = application.stage.removeChildren();
        for (const child of removed) child.destroy();

        const scene = new runtime.Graphics();
        const judgmentY = height * 0.76;
        const pixelsPerMs = pixelsPerSecond / 1_000;
        const startMs = currentTimeMs - (height - judgmentY) / pixelsPerMs;
        const endMs = currentTimeMs + judgmentY / pixelsPerMs;
        const laneWidth = width / CHART_LANE_COUNT;

        scene.rect(0, 0, width, height).fill(colors.background);
        for (let lane = 0; lane <= CHART_LANE_COUNT; lane += 1) {
            const x = lane * laneWidth;
            const isGroupBoundary = isChartLaneGroupBoundary(lane);
            scene
                .moveTo(x + 0.5, 0)
                .lineTo(x + 0.5, height)
                .stroke({
                    color: isGroupBoundary
                        ? colors.laneStrong
                        : colors.laneWeak,
                    width: isGroupBoundary ? 1 : 0.5,
                });
        }

        const beatMarkers = getBeatMarkers(
            document.timingPoints,
            document.ticksPerQuarter,
            startMs,
            endMs
        );
        const beatByTick = new Map(
            beatMarkers.map((beat) => [beat.tick, beat])
        );
        const snapMarkers = getSnapGridMarkers(
            document.timingPoints,
            document.ticksPerQuarter,
            snapDivisor,
            startMs,
            endMs
        );
        for (const marker of snapMarkers) {
            const beat = beatByTick.get(marker.tick);
            const style = styleForSnapSubdivision(marker.subdivision);
            const y = judgmentY - (marker.timeMs - currentTimeMs) * pixelsPerMs;
            scene
                .moveTo(0, y + 0.5)
                .lineTo(width, y + 0.5)
                .stroke({
                    color: beat?.accent ? colors.snapWhite : style.color,
                    width: beat?.accent ? 1.8 : style.width,
                    alpha: beat?.accent ? 1 : style.alpha,
                });
        }
        for (const beat of beatMarkers) {
            if (!beat.accent) continue;
            if (snapMarkers.some((marker) => marker.tick === beat.tick)) {
                continue;
            }
            const y = judgmentY - (beat.timeMs - currentTimeMs) * pixelsPerMs;
            scene
                .moveTo(0, y + 0.5)
                .lineTo(width, y + 0.5)
                .stroke({ color: colors.snapWhite, width: 1.8 });
        }

        const selected = new Set(selectedNoteIds);
        const hasSelection = selected.size > 0;
        for (const note of previewNotes) {
            const noteStartMs = tickToMilliseconds(
                note.tick,
                document.timingPoints,
                document.ticksPerQuarter
            );
            const noteEndMs = tickToMilliseconds(
                note.tick + note.durationTicks,
                document.timingPoints,
                document.ticksPerQuarter
            );
            if (noteEndMs < startMs || noteStartMs > endMs) continue;
            const isPreview = note.id === "preview" || gesture !== null;
            const isSelected = selected.has(note.id);
            drawNote({
                graphics: scene,
                note,
                laneWidth,
                judgmentY,
                pixelsPerMs,
                currentTimeMs,
                timingPoints: document.timingPoints,
                ticksPerQuarter: document.ticksPerQuarter,
                isPreview: note.id === "preview" || (isPreview && isSelected),
                isSelected,
                isDimmed: hasSelection && !isSelected && note.id !== "preview",
                showControls: isSelected && selected.size === 1,
                isConflicted: conflictingNoteIds.has(note.id),
            });
        }

        if (gesture?.kind === "marquee") {
            const left = Math.min(gesture.startX, gesture.currentX);
            const top = Math.min(gesture.startY, gesture.currentY);
            const marqueeWidth = Math.abs(gesture.currentX - gesture.startX);
            const marqueeHeight = Math.abs(gesture.currentY - gesture.startY);
            scene
                .rect(left, top, marqueeWidth, marqueeHeight)
                .fill({ color: colors.selection, alpha: 0.1 })
                .stroke({ color: colors.selection, width: 1.5, alpha: 0.9 });
        }

        scene
            .moveTo(0, judgmentY + 0.5)
            .lineTo(width, judgmentY + 0.5)
            .stroke({ color: colors.judgment, width: 2 });
        application.stage.addChild(scene);
        application.render();
    }, [
        currentTimeMs,
        document.ticksPerQuarter,
        document.timingPoints,
        gesture,
        conflictingNoteIds,
        pixelsPerSecond,
        previewNotes,
        selectedNoteIds,
        snapDivisor,
    ]);

    useEffect(() => {
        if (!rendererReady) return;
        renderScene();
        const host = hostRef.current;
        if (!host) return;
        const observer = new ResizeObserver(renderScene);
        observer.observe(host);
        return () => observer.disconnect();
    }, [renderScene, rendererReady]);

    const currentSnappedTick = useCallback(
        () =>
            Math.round(
                snapTick(
                    millisecondsToTick(
                        currentTimeMs,
                        document.timingPoints,
                        document.ticksPerQuarter
                    ),
                    snapDivisor,
                    document.ticksPerQuarter
                )
            ),
        [
            currentTimeMs,
            document.ticksPerQuarter,
            document.timingPoints,
            snapDivisor,
        ]
    );

    useEffect(() => {
        function handleKeyboard(event: KeyboardEvent) {
            const target = event.target;
            if (
                target instanceof HTMLInputElement ||
                target instanceof HTMLTextAreaElement ||
                target instanceof HTMLSelectElement
            ) {
                return;
            }

            const modifier = event.ctrlKey || event.metaKey;
            const key = event.key.toLowerCase();
            const toolKeys: Record<string, NoteEditorTool> = {
                "1": "select",
                "2": "standard",
                "3": "tenuto",
                "4": "glissando",
                "5": "trill",
            };
            if (!modifier && !event.shiftKey && toolKeys[event.key]) {
                event.preventDefault();
                onToolChange(toolKeys[event.key]);
                return;
            }
            if (!modifier && event.shiftKey && /^[1-9]$/.test(event.key)) {
                const divisor = Number(event.key);
                if (snapDivisors.includes(divisor)) {
                    event.preventDefault();
                    setSnapDivisor(divisor);
                }
                return;
            }

            const selectedNotes = selectedNotesFrom(
                document.notes,
                selectedNoteIds
            );
            if (modifier && key === "a") {
                event.preventDefault();
                selectNotes(document.notes.map((note) => note.id));
                return;
            }
            if (modifier && (key === "c" || key === "x")) {
                if (selectedNotes.length === 0) return;
                event.preventDefault();
                clipboardRef.current = structuredClone(selectedNotes);
                if (key === "x") {
                    const ids = new Set(selectedNoteIds);
                    replaceNotes(
                        document.notes.filter((note) => !ids.has(note.id)),
                        []
                    );
                }
                return;
            }
            if (modifier && key === "v") {
                if (clipboardRef.current.length === 0) return;
                event.preventDefault();
                const pasted = cloneChartNotesAtTick(
                    clipboardRef.current,
                    currentSnappedTick(),
                    () => crypto.randomUUID()
                );
                replaceNotes(
                    [...document.notes, ...pasted],
                    pasted.map((note) => note.id)
                );
                return;
            }
            if (modifier && key === "d") {
                if (selectedNotes.length === 0) return;
                event.preventDefault();
                const lastTick = Math.max(
                    ...selectedNotes.map(
                        (note) => note.tick + note.durationTicks
                    )
                );
                const timingPoint =
                    [...document.timingPoints]
                        .reverse()
                        .find((point) => point.tick <= lastTick) ??
                    document.timingPoints[0];
                const measureTicks =
                    ((document.ticksPerQuarter * 4) / timingPoint.denominator) *
                    timingPoint.numerator;
                const cloned = cloneChartNotesAtTick(
                    selectedNotes,
                    lastTick + measureTicks,
                    () => crypto.randomUUID()
                );
                replaceNotes(
                    [...document.notes, ...cloned],
                    cloned.map((note) => note.id)
                );
                return;
            }
            if (modifier && key === "h") {
                if (selectedNotes.length === 0) return;
                event.preventDefault();
                replaceNotes(
                    flipChartNotesHorizontally(document.notes, selectedNoteIds)
                );
                return;
            }

            const snapStep = Math.max(
                1,
                Math.round((document.ticksPerQuarter * 4) / snapDivisor)
            );
            if (
                selectedNotes.length > 0 &&
                ((modifier &&
                    [
                        "arrowleft",
                        "arrowright",
                        "arrowup",
                        "arrowdown",
                    ].includes(key)) ||
                    (!modifier && (key === "j" || key === "k")))
            ) {
                event.preventDefault();
                const laneDelta =
                    key === "arrowleft" ? -1 : key === "arrowright" ? 1 : 0;
                const tickDelta =
                    key === "arrowup" || key === "k"
                        ? snapStep
                        : key === "arrowdown" || key === "j"
                          ? -snapStep
                          : 0;
                replaceNotes(
                    moveChartNotes(
                        document.notes,
                        selectedNoteIds,
                        laneDelta,
                        tickDelta
                    )
                );
                return;
            }
            if (
                selectedNotes.length > 0 &&
                (event.key === "Delete" || event.key === "Backspace")
            ) {
                event.preventDefault();
                const ids = new Set(selectedNoteIds);
                replaceNotes(
                    document.notes.filter((note) => !ids.has(note.id)),
                    []
                );
                return;
            }
            if (event.key === "Escape") {
                selectNotes([]);
            }
        }

        window.addEventListener("keydown", handleKeyboard);
        return () => window.removeEventListener("keydown", handleKeyboard);
    }, [
        currentSnappedTick,
        document,
        onToolChange,
        replaceNotes,
        selectNotes,
        selectedNoteIds,
        setSnapDivisor,
        snapDivisor,
    ]);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;

        function handleWheel(event: WheelEvent) {
            event.preventDefault();
            if (event.deltaY === 0) return;

            if (event.ctrlKey) {
                const currentIndex = snapDivisors.indexOf(snapDivisor);
                const direction = event.deltaY > 0 ? 1 : -1;
                const nextIndex = Math.min(
                    snapDivisors.length - 1,
                    Math.max(0, currentIndex + direction)
                );
                setSnapDivisor(snapDivisors[nextIndex]);
                return;
            }

            const direction = event.deltaY > 0 ? -1 : 1;
            const steps = direction * (event.shiftKey ? 4 : 1);
            const currentTick = millisecondsToTick(
                currentTimeMs,
                document.timingPoints,
                document.ticksPerQuarter
            );
            const nextTick = moveTickBySnapSteps(
                currentTick,
                snapDivisor,
                document.ticksPerQuarter,
                steps
            );
            onSeek(
                Math.min(
                    navigationDurationMs,
                    Math.max(
                        0,
                        tickToMilliseconds(
                            nextTick,
                            document.timingPoints,
                            document.ticksPerQuarter
                        )
                    )
                )
            );
        }

        host.addEventListener("wheel", handleWheel, { passive: false });
        return () => host.removeEventListener("wheel", handleWheel);
    }, [
        currentTimeMs,
        document.ticksPerQuarter,
        document.timingPoints,
        navigationDurationMs,
        onSeek,
        setSnapDivisor,
        snapDivisor,
    ]);

    function pointerPosition(
        clientX: number,
        clientY: number
    ): PointerPosition | null {
        const host = hostRef.current;
        if (!host) return null;
        const bounds = host.getBoundingClientRect();
        const x = Math.min(
            bounds.width - 1,
            Math.max(0, clientX - bounds.left)
        );
        const y = Math.min(
            bounds.height - 1,
            Math.max(0, clientY - bounds.top)
        );
        const judgmentY = bounds.height * 0.76;
        const timeMs =
            currentTimeMs + (judgmentY - y) / (pixelsPerSecond / 1_000);
        const rawTick = millisecondsToTick(
            timeMs,
            document.timingPoints,
            document.ticksPerQuarter
        );
        const laneFloat = x / (bounds.width / CHART_LANE_COUNT);
        return {
            lane: Math.min(
                CHART_LANE_COUNT - 1,
                Math.max(0, Math.floor(laneFloat))
            ),
            laneFloat,
            tick: Math.round(
                snapTick(rawTick, snapDivisor, document.ticksPerQuarter)
            ),
            rawTick,
            x,
            y,
        };
    }

    function findNoteAt(position: PointerPosition) {
        const hitPadding = Math.max(
            1,
            Math.round(((document.ticksPerQuarter * 4) / snapDivisor) * 0.4)
        );
        return [...document.notes]
            .reverse()
            .find((note) =>
                chartNoteContainsPoint(
                    note,
                    position.laneFloat,
                    position.rawTick,
                    hitPadding
                )
            );
    }

    function horizontalResizeHandleAt(
        note: ChartNote,
        position: PointerPosition,
        includeOutside = false
    ) {
        const hitPadding = Math.max(
            1,
            Math.round(((document.ticksPerQuarter * 4) / snapDivisor) * 0.4)
        );
        if (Math.abs(position.tick - note.tick) > hitPadding) return null;

        return getChartNoteHorizontalResizeHandle(
            note,
            position.laneFloat,
            (hostRef.current?.clientWidth ?? CHART_LANE_COUNT) /
                CHART_LANE_COUNT,
            { includeOutside }
        );
    }

    function startHorizontalResize(
        note: ChartNote,
        action: "left" | "right",
        position: PointerPosition
    ) {
        const anchorLane =
            action === "left" ? note.lane : note.lane + note.width - 1;
        setGesture({
            kind: "resize",
            action,
            original: note,
            startLane: anchorLane,
            startTick: position.tick,
            currentLane: anchorLane,
            currentTick: position.tick,
        });
    }

    function findGlissandoAnchorAt(note: ChartNote, position: PointerPosition) {
        if (note.type !== "glissando") return null;
        const host = hostRef.current;
        if (!host) return null;

        const laneWidth = host.clientWidth / CHART_LANE_COUNT;
        const judgmentY = host.clientHeight * 0.76;
        const pixelsPerMs = pixelsPerSecond / 1_000;
        return (
            getGlissandoSnapRenderPoints(note, document.ticksPerQuarter)
                .map((point) => {
                    const x = (point.lane + point.width / 2) * laneWidth;
                    const y =
                        judgmentY -
                        (tickToMilliseconds(
                            point.tick,
                            document.timingPoints,
                            document.ticksPerQuarter
                        ) -
                            currentTimeMs) *
                            pixelsPerMs;
                    return {
                        point,
                        distance: Math.hypot(position.x - x, position.y - y),
                    };
                })
                .filter(({ distance }) => distance <= 10)
                .sort((first, second) => first.distance - second.distance)[0]
                ?.point ?? null
        );
    }

    function isDurationResizeHandleAt(
        note: ChartNote,
        position: PointerPosition
    ) {
        if (note.type === "standard") return false;
        const host = hostRef.current;
        if (!host) return false;

        const endTick = note.tick + note.durationTicks;
        const endRange = chartNoteRangeAtTick(note, endTick);
        const laneWidth = host.clientWidth / CHART_LANE_COUNT;
        const judgmentY = host.clientHeight * 0.76;
        const endX =
            (note.type === "glissando"
                ? endRange.lane + endRange.width
                : endRange.lane + endRange.width / 2) * laneWidth;
        const endY =
            judgmentY -
            (tickToMilliseconds(
                endTick,
                document.timingPoints,
                document.ticksPerQuarter
            ) -
                currentTimeMs) *
                (pixelsPerSecond / 1_000);
        return (
            Math.hypot(position.x - endX, position.y - endY) <=
            DURATION_RESIZE_HIT_RADIUS_PX
        );
    }

    function findControlPointAt(note: ChartNote, lane: number, tick: number) {
        const hitPadding = Math.max(
            1,
            Math.round(((document.ticksPerQuarter * 4) / snapDivisor) * 0.4)
        );
        return note.points.findIndex((point) => {
            const pointTick = note.tick + point.tickOffset;
            return (
                Math.abs(tick - pointTick) <= hitPadding &&
                lane >= point.lane &&
                lane < point.lane + point.width
            );
        });
    }

    function deleteWithRightClick(position: PointerPosition) {
        const selectedNotes = selectedNotesFrom(
            document.notes,
            selectedNoteIds
        );
        if (selectedNotes.length === 1) {
            const selected = selectedNotes[0];
            const glissandoAnchor = findGlissandoAnchorAt(selected, position);
            if (glissandoAnchor) {
                const tickOffset = glissandoAnchor.tick - selected.tick;
                const hasStoredPoint = selected.points.some(
                    (point) => point.tickOffset === tickOffset
                );
                if (tickOffset > 0 && hasStoredPoint) {
                    replaceNotes(
                        document.notes.map((note) =>
                            note.id === selected.id
                                ? {
                                      ...note,
                                      points: note.points.filter(
                                          (point) =>
                                              point.tickOffset !== tickOffset
                                      ),
                                  }
                                : note
                        ),
                        [selected.id]
                    );
                }
                return;
            }
            if (selected.type === "tenuto") {
                const pointIndex = findControlPointAt(
                    selected,
                    position.lane,
                    position.tick
                );
                if (pointIndex >= 0) {
                    replaceNotes(
                        document.notes.map((note) =>
                            note.id === selected.id
                                ? {
                                      ...note,
                                      points: note.points.filter(
                                          (_, index) => index !== pointIndex
                                      ),
                                  }
                                : note
                        )
                    );
                    return;
                }
            }
        }

        const hit = findNoteAt(position);
        if (!hit) return;
        if (selectedNoteIds.includes(hit.id)) {
            const selected = new Set(selectedNoteIds);
            replaceNotes(
                document.notes.filter((note) => !selected.has(note.id)),
                []
            );
            return;
        }
        replaceNotes(
            document.notes.filter((note) => note.id !== hit.id),
            selectedNoteIds
        );
    }

    function tryAddControlPoint(note: ChartNote, position: PointerPosition) {
        if (note.type !== "tenuto" && note.type !== "glissando") {
            return false;
        }
        const tickOffset = position.tick - note.tick;
        if (
            tickOffset <= 0 ||
            tickOffset >= note.durationTicks ||
            note.points.some((point) => point.tickOffset === tickOffset)
        ) {
            return false;
        }
        const range = chartNoteRangeAtTick(note, position.tick);
        const width = Math.max(1, Math.round(range.width));
        const lane = clampLane(Math.round(range.lane), width);
        replaceNotes(
            document.notes.map((value) =>
                value.id === note.id
                    ? {
                          ...value,
                          points: [
                              ...value.points,
                              {
                                  tickOffset,
                                  lane,
                                  width,
                                  hand: range.hand,
                              },
                          ].sort(
                              (first, second) =>
                                  first.tickOffset - second.tickOffset
                          ),
                      }
                    : value
            ),
            [note.id]
        );
        return true;
    }

    function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
        const position = pointerPosition(event.clientX, event.clientY);
        if (!position) return;
        event.currentTarget.focus();
        if (event.button === 2) {
            event.preventDefault();
            deleteWithRightClick(position);
            return;
        }
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);

        if (tool !== "select") {
            setGesture({
                kind: "create",
                startLane: position.lane,
                startTick: position.tick,
                currentLane: position.lane,
                currentTick: position.tick,
                forceOneLane: tool === "standard" && event.shiftKey,
            });
            return;
        }

        const selectedNotes = selectedNotesFrom(
            document.notes,
            selectedNoteIds
        );
        if (selectedNotes.length === 1) {
            const selected = selectedNotes[0];
            const resizeHandle = horizontalResizeHandleAt(
                selected,
                position,
                true
            );
            if (resizeHandle) {
                startHorizontalResize(selected, resizeHandle, position);
                return;
            }
            if (isDurationResizeHandleAt(selected, position)) {
                const endTick = selected.tick + selected.durationTicks;
                setGesture({
                    kind: "resize",
                    action: "end",
                    original: selected,
                    startLane: position.lane,
                    startTick: endTick,
                    currentLane: position.lane,
                    currentTick: endTick,
                });
                return;
            }
            const glissandoAnchor = findGlissandoAnchorAt(selected, position);
            if (glissandoAnchor) {
                setGesture({
                    kind: "glissando-anchor",
                    original: selected,
                    tickOffset: glissandoAnchor.tick - selected.tick,
                    startLane: position.lane,
                    startTick: position.tick,
                    currentLane: position.lane,
                    currentTick: position.tick,
                });
                return;
            }
            if (selected.type === "tenuto") {
                const pointIndex = findControlPointAt(
                    selected,
                    position.lane,
                    position.tick
                );
                if (pointIndex >= 0) {
                    setGesture({
                        kind: "point",
                        original: selected,
                        pointIndex,
                        startLane: position.lane,
                        startTick: position.tick,
                        currentLane: position.lane,
                        currentTick: position.tick,
                    });
                    return;
                }
            }
        }

        const hit = findNoteAt(position);
        if (
            event.ctrlKey &&
            hit &&
            selectedNoteIds.length === 1 &&
            selectedNoteIds[0] === hit.id &&
            tryAddControlPoint(hit, position)
        ) {
            return;
        }
        if (event.ctrlKey && hit) {
            toggleNoteSelection(hit.id);
            return;
        }
        if (!hit) {
            setGesture({
                kind: "marquee",
                startLaneFloat: position.laneFloat,
                startRawTick: position.rawTick,
                currentLaneFloat: position.laneFloat,
                currentRawTick: position.rawTick,
                startX: position.x,
                startY: position.y,
                currentX: position.x,
                currentY: position.y,
                additive: event.ctrlKey,
                initialSelection: selectedNoteIds,
            });
            return;
        }

        const nextSelection = selectedNoteIds.includes(hit.id)
            ? selectedNoteIds
            : [hit.id];
        if (!selectedNoteIds.includes(hit.id)) selectNotes(nextSelection);

        const horizontalResizeHandle =
            nextSelection.length === 1
                ? horizontalResizeHandleAt(hit, position)
                : null;
        if (horizontalResizeHandle) {
            startHorizontalResize(hit, horizontalResizeHandle, position);
            return;
        }

        setGesture({
            kind: "move",
            selectedIds: nextSelection,
            startLane: position.lane,
            startTick: position.tick,
            currentLane: position.lane,
            currentTick: position.tick,
        });
    }

    function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
        const position = pointerPosition(event.clientX, event.clientY);
        if (!position) return;
        if (!gesture) {
            const selectedNotes =
                tool === "select"
                    ? selectedNotesFrom(document.notes, selectedNoteIds)
                    : [];
            const selectedHandle =
                selectedNotes.length === 1
                    ? horizontalResizeHandleAt(selectedNotes[0], position, true)
                    : null;
            const selectedAnchor =
                selectedNotes.length === 1
                    ? findGlissandoAnchorAt(selectedNotes[0], position)
                    : null;
            const selectedDurationHandle =
                selectedNotes.length === 1
                    ? isDurationResizeHandleAt(selectedNotes[0], position)
                    : false;
            const hit =
                tool === "select" &&
                !selectedHandle &&
                !selectedAnchor &&
                !selectedDurationHandle
                    ? findNoteAt(position)
                    : undefined;
            setIsAnchorHovered(Boolean(selectedAnchor));
            setIsDurationHandleHovered(selectedDurationHandle);
            setIsResizeHandleHovered(
                Boolean(
                    selectedHandle ||
                    (hit && horizontalResizeHandleAt(hit, position))
                )
            );
            return;
        }
        setGesture((current) => {
            if (!current) return null;
            if (current.kind === "marquee") {
                return {
                    ...current,
                    currentLaneFloat: position.laneFloat,
                    currentRawTick: position.rawTick,
                    currentX: position.x,
                    currentY: position.y,
                };
            }
            return {
                ...current,
                currentLane: position.lane,
                currentTick: position.tick,
            };
        });
    }

    function finishGesture() {
        if (!gesture) return;
        if (gesture.kind === "create" && tool !== "select") {
            const next = buildPreviewNote({
                gesture,
                tool,
                hand,
                width: defaultWidth,
                ticksPerQuarter: document.ticksPerQuarter,
                snapDivisor,
            });
            next.id = crypto.randomUUID();
            replaceNotes([...document.notes, next], [next.id]);
        } else if (gesture.kind === "move") {
            replaceNotes(
                moveChartNotes(
                    document.notes,
                    gesture.selectedIds,
                    gesture.currentLane - gesture.startLane,
                    gesture.currentTick - gesture.startTick
                ),
                gesture.selectedIds
            );
        } else if (gesture.kind === "resize") {
            const next = buildResizedNote(gesture);
            replaceNotes(
                replacePreviewNote(document.notes, gesture.original.id, next),
                [next.id]
            );
        } else if (gesture.kind === "point") {
            const next = buildPointEditedNote(gesture);
            replaceNotes(
                replacePreviewNote(document.notes, gesture.original.id, next),
                [next.id]
            );
        } else if (gesture.kind === "glissando-anchor") {
            const next = moveGlissandoSnapAnchor(
                gesture.original,
                gesture.tickOffset,
                gesture.currentLane - gesture.startLane
            );
            replaceNotes(
                replacePreviewNote(document.notes, gesture.original.id, next),
                [next.id]
            );
        } else if (gesture.kind === "marquee") {
            const distance = Math.hypot(
                gesture.currentX - gesture.startX,
                gesture.currentY - gesture.startY
            );
            if (distance < 4) {
                if (!gesture.additive) selectNotes([]);
            } else {
                const matched = document.notes
                    .filter((note) =>
                        chartNoteIntersectsRect(note, {
                            minLane: Math.min(
                                gesture.startLaneFloat,
                                gesture.currentLaneFloat
                            ),
                            maxLane: Math.max(
                                gesture.startLaneFloat,
                                gesture.currentLaneFloat
                            ),
                            minTick: Math.min(
                                gesture.startRawTick,
                                gesture.currentRawTick
                            ),
                            maxTick: Math.max(
                                gesture.startRawTick,
                                gesture.currentRawTick
                            ),
                        })
                    )
                    .map((note) => note.id);
                selectNotes(
                    gesture.additive
                        ? [...gesture.initialSelection, ...matched]
                        : matched
                );
            }
        }
        setGesture(null);
    }

    return (
        <div
            ref={hostRef}
            role="application"
            aria-label="28칸 WebGL 채보 작성 영역. 1~5 도구 전환, 좌클릭 작성과 선택, 우클릭 삭제, 드래그 범위 선택을 지원합니다."
            tabIndex={0}
            className={`h-full min-h-80 w-full overflow-hidden outline-none ${
                (gesture?.kind === "resize" && gesture.action === "end") ||
                (tool === "select" && isDurationHandleHovered)
                    ? "cursor-ns-resize"
                    : (gesture?.kind === "resize" &&
                            gesture.action !== "end") ||
                        gesture?.kind === "glissando-anchor" ||
                        (tool === "select" &&
                            (isResizeHandleHovered || isAnchorHovered))
                      ? "cursor-pointer"
                      : tool === "select"
                        ? "cursor-default"
                        : "cursor-crosshair"
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                }
                finishGesture();
            }}
            onPointerLeave={() => {
                if (!gesture) {
                    setIsResizeHandleHovered(false);
                    setIsAnchorHovered(false);
                    setIsDurationHandleHovered(false);
                }
            }}
            onPointerCancel={() => {
                setGesture(null);
                setIsResizeHandleHovered(false);
                setIsAnchorHovered(false);
                setIsDurationHandleHovered(false);
            }}
            onContextMenu={(event) => event.preventDefault()}
        />
    );
}

function capPolygon(x: number, y: number, width: number, height: number) {
    const bevel = Math.min(7, Math.max(2, height * 0.42, width * 0.05));
    return [
        x,
        y,
        x + width,
        y,
        x + width + bevel,
        y + height / 2,
        x + width,
        y + height,
        x,
        y + height,
        x - bevel,
        y + height / 2,
    ];
}

function drawCap({
    graphics,
    x,
    centerY,
    width,
    hand,
    alpha,
    selected,
    conflicted,
    small = false,
}: {
    graphics: Graphics;
    x: number;
    centerY: number;
    width: number;
    hand: ChartHand;
    alpha: number;
    selected: boolean;
    conflicted: boolean;
    small?: boolean;
}) {
    const height = small ? 7 : 10;
    const handColor = colorForHand(hand);
    const outer = capPolygon(
        x + 1,
        centerY - height / 2 - 2,
        Math.max(3, width - 2),
        height + 4
    );
    graphics.poly(outer, true).fill({ color: handColor, alpha: alpha * 0.24 });
    const shape = capPolygon(
        x + 2,
        centerY - height / 2,
        Math.max(1, width - 4),
        height
    );
    graphics
        .poly(shape, true)
        .fill({ color: colors.noteFace, alpha })
        .stroke({ color: handColor, width: 1.4, alpha });
    graphics
        .moveTo(x + 5, centerY + 1)
        .lineTo(x + width - 5, centerY + 1)
        .stroke({ color: handColor, width: 1, alpha: alpha * 0.34 });
    if (conflicted) {
        graphics
            .poly(
                capPolygon(x, centerY - height / 2 - 2.5, width, height + 5),
                true
            )
            .stroke({
                color: colors.conflict,
                width: 3.2,
                alpha: 0.95,
            });
    }
    if (selected) {
        graphics
            .poly(
                capPolygon(x, centerY - height / 2 - 2.5, width, height + 5),
                true
            )
            .stroke({
                color: colors.selection,
                width: 1.8,
                alpha: 0.95,
            });
    }
}

function drawDiamond(
    graphics: Graphics,
    centerX: number,
    centerY: number,
    size: number,
    fill: number,
    alpha = 1
) {
    graphics
        .poly(
            [
                centerX,
                centerY - size,
                centerX + size,
                centerY,
                centerX,
                centerY + size,
                centerX - size,
                centerY,
            ],
            true
        )
        .fill({ color: fill, alpha })
        .stroke({ color: colors.noteFace, width: 1, alpha });
}

function drawNote({
    graphics,
    note,
    laneWidth,
    judgmentY,
    pixelsPerMs,
    currentTimeMs,
    timingPoints,
    ticksPerQuarter,
    isPreview,
    isSelected,
    isDimmed,
    showControls,
    isConflicted,
}: {
    graphics: Graphics;
    note: ChartNote;
    laneWidth: number;
    judgmentY: number;
    pixelsPerMs: number;
    currentTimeMs: number;
    timingPoints: Parameters<typeof tickToMilliseconds>[1];
    ticksPerQuarter: number;
    isPreview: boolean;
    isSelected: boolean;
    isDimmed: boolean;
    showControls: boolean;
    isConflicted: boolean;
}) {
    const yForTick = (tick: number) =>
        judgmentY -
        (tickToMilliseconds(tick, timingPoints, ticksPerQuarter) -
            currentTimeMs) *
            pixelsPerMs;
    const baseAlpha = isDimmed ? 0.28 : isPreview ? 0.58 : 0.94;

    if (note.type === "standard") {
        drawCap({
            graphics,
            x: note.lane * laneWidth,
            centerY: yForTick(note.tick),
            width: note.width * laneWidth,
            hand: note.hand,
            alpha: baseAlpha,
            selected: isSelected,
            conflicted: isConflicted,
        });
    } else if (note.type === "trill") {
        const pairLane = note.pairLane ?? note.lane;
        const pairWidth = note.pairWidth ?? note.width;
        const stepTicks = Math.max(
            1,
            Math.round((ticksPerQuarter * 4) / (note.trillSnapDivisor ?? 8))
        );
        const stepCount = Math.max(
            1,
            Math.ceil(note.durationTicks / stepTicks)
        );
        for (let index = 0; index < stepCount; index += 1) {
            const startTick = note.tick + index * stepTicks;
            const endTick = Math.min(
                note.tick + note.durationTicks,
                startTick + stepTicks
            );
            const fromLane = index % 2 === 0 ? note.lane : pairLane;
            const fromWidth = index % 2 === 0 ? note.width : pairWidth;
            const toLane = index % 2 === 0 ? pairLane : note.lane;
            const toWidth = index % 2 === 0 ? pairWidth : note.width;
            const topY = yForTick(endTick);
            const bottomY = yForTick(startTick);
            const gap = Math.min(2.5, Math.abs(bottomY - topY) * 0.08);
            const polygon = [
                fromLane * laneWidth + 2,
                bottomY - gap,
                (fromLane + fromWidth) * laneWidth - 2,
                bottomY - gap,
                (toLane + toWidth) * laneWidth - 2,
                topY + gap,
                toLane * laneWidth + 2,
                topY + gap,
            ];
            graphics
                .poly(polygon, true)
                .fill({
                    color: colorForHand(note.hand),
                    alpha: baseAlpha * 0.72,
                })
                .stroke({
                    color: colors.noteFace,
                    width: 0.8,
                    alpha: baseAlpha * 0.45,
                });
            if (isSelected) {
                graphics.poly(polygon, true).stroke({
                    color: colors.selection,
                    width: 1.5,
                    alpha: 0.92,
                });
            }
            if (isConflicted) {
                graphics.poly(polygon, true).stroke({
                    color: colors.conflict,
                    width: 2.8,
                    alpha: 0.92,
                });
            }
        }
        const startCenterX = (note.lane + note.width / 2) * laneWidth;
        drawCap({
            graphics,
            x: note.lane * laneWidth,
            centerY: yForTick(note.tick),
            width: note.width * laneWidth,
            hand: note.hand,
            alpha: baseAlpha,
            selected: isSelected,
            conflicted: isConflicted,
        });
        const finalSegmentIndex = stepCount - 1;
        const endLane = finalSegmentIndex % 2 === 0 ? pairLane : note.lane;
        const endWidth = finalSegmentIndex % 2 === 0 ? pairWidth : note.width;
        drawCap({
            graphics,
            x: endLane * laneWidth,
            centerY: yForTick(note.tick + note.durationTicks),
            width: endWidth * laneWidth,
            hand: note.hand,
            alpha: baseAlpha,
            selected: isSelected,
            conflicted: isConflicted,
        });
        drawDiamond(
            graphics,
            startCenterX,
            yForTick(note.tick) - 1,
            5,
            colors.selection,
            baseAlpha
        );
        drawDiamond(
            graphics,
            startCenterX + 8,
            yForTick(note.tick) - 8,
            4,
            colors.selection,
            baseAlpha * 0.92
        );
    } else {
        const points = getChartNoteRenderPoints(note);
        for (let index = 0; index < points.length - 1; index += 1) {
            const first = points[index];
            const second = points[index + 1];
            const polygon = [
                first.lane * laneWidth + 2,
                yForTick(first.tick),
                (first.lane + first.width) * laneWidth - 2,
                yForTick(first.tick),
                (second.lane + second.width) * laneWidth - 2,
                yForTick(second.tick),
                second.lane * laneWidth + 2,
                yForTick(second.tick),
            ];
            graphics
                .poly(polygon, true)
                .fill({
                    color: colorForHand(first.hand),
                    alpha: baseAlpha * 0.58,
                })
                .stroke({
                    color: colorForHand(second.hand),
                    width: 1,
                    alpha: baseAlpha * 0.62,
                });
            graphics
                .moveTo(
                    (first.lane + first.width / 2) * laneWidth,
                    yForTick(first.tick)
                )
                .lineTo(
                    (second.lane + second.width / 2) * laneWidth,
                    yForTick(second.tick)
                )
                .stroke({
                    color: colors.noteFace,
                    width: 1.3,
                    alpha: baseAlpha * 0.72,
                });
            if (isSelected) {
                graphics.poly(polygon, true).stroke({
                    color: colors.selection,
                    width: 1.6,
                    alpha: 0.9,
                });
            }
            if (isConflicted) {
                graphics.poly(polygon, true).stroke({
                    color: colors.conflict,
                    width: 2.8,
                    alpha: 0.92,
                });
            }
        }
        const capPoints =
            note.type === "glissando"
                ? getGlissandoSnapRenderPoints(note, ticksPerQuarter)
                : points;
        for (const point of capPoints) {
            drawCap({
                graphics,
                x: point.lane * laneWidth,
                centerY: yForTick(point.tick),
                width: point.width * laneWidth,
                hand: point.hand,
                alpha: baseAlpha,
                selected: isSelected,
                conflicted: isConflicted,
                small:
                    point.tick !== note.tick &&
                    point.tick !== note.tick + note.durationTicks,
            });
        }
    }

    if (showControls) {
        const handleSize = 4;
        const startY = yForTick(note.tick);
        drawDiamond(
            graphics,
            note.lane * laneWidth,
            startY,
            handleSize,
            colors.selection
        );
        drawDiamond(
            graphics,
            (note.lane + note.width) * laneWidth,
            startY,
            handleSize,
            colors.selection
        );
        if (note.type !== "standard") {
            const endTick = note.tick + note.durationTicks;
            const endRange = chartNoteRangeAtTick(note, endTick);
            const endHandleLane =
                note.type === "glissando"
                    ? endRange.lane + endRange.width
                    : endRange.lane + endRange.width / 2;
            drawDiamond(
                graphics,
                endHandleLane * laneWidth,
                yForTick(endTick),
                handleSize,
                colors.selection
            );
        }
        if (note.type === "glissando") {
            for (const point of getGlissandoSnapRenderPoints(
                note,
                ticksPerQuarter
            )) {
                drawDiamond(
                    graphics,
                    (point.lane + point.width / 2) * laneWidth,
                    yForTick(point.tick),
                    4,
                    colors.selection
                );
            }
        } else if (note.type === "tenuto") {
            for (const point of getChartNoteRenderPoints(note)) {
                if (point.sourceIndex === null) continue;
                drawDiamond(
                    graphics,
                    (point.lane + point.width / 2) * laneWidth,
                    yForTick(point.tick),
                    5,
                    colors.selection
                );
            }
        }
    }
}
