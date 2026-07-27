"use client";

import {
    type PointerEvent as ReactPointerEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import type { Application, Graphics } from "pixi.js";

import {
    CHART_LANE_COUNT,
    type ChartHand,
    type ChartNote,
    type ChartNoteType,
} from "@/lib/chart-pattern/schema";
import {
    getBeatMarkers,
    millisecondsToTick,
    snapTick,
    tickToMilliseconds,
} from "@/lib/chart-pattern/timing";

import { useChartEditorStore } from "./chartEditorStore";

export type NoteEditorTool = "select" | ChartNoteType;

interface CreateGesture {
    kind: "create";
    startLane: number;
    startTick: number;
    currentLane: number;
    currentTick: number;
}

interface EditGesture {
    kind: "edit";
    action: "move" | "resize-left" | "resize-right" | "resize-end";
    original: ChartNote;
    startLane: number;
    startTick: number;
    currentLane: number;
    currentTick: number;
}

type NoteGesture = CreateGesture | EditGesture;

interface PixiRuntime {
    Graphics: typeof import("pixi.js").Graphics;
}

interface RenderPoint {
    lane: number;
    width: number;
    tick: number;
    hand: ChartHand;
}

const colors = {
    background: 0x0b0b10,
    laneStrong: 0x30303c,
    laneWeak: 0x1f1f29,
    beatStrong: 0x5f5f6f,
    beatWeak: 0x292934,
    left: 0x62d4e8,
    right: 0xf06b68,
    selected: 0xf4f4f7,
    judgment: 0xf2f2f5,
    preview: 0xfacc15,
};

function colorForHand(hand: ChartHand) {
    return hand === "left" ? colors.left : colors.right;
}

function clampLane(lane: number, width = 1) {
    return Math.min(CHART_LANE_COUNT - width, Math.max(0, lane));
}

function noteRenderPoints(note: ChartNote): RenderPoint[] {
    const points: RenderPoint[] = [
        {
            lane: note.lane,
            width: note.width,
            tick: note.tick,
            hand: note.hand,
        },
        ...note.points.map((point) => ({
            lane: point.lane,
            width: point.width,
            tick: note.tick + point.tickOffset,
            hand: point.hand ?? note.hand,
        })),
    ].sort((first, second) => first.tick - second.tick);

    const endTick = note.tick + note.durationTicks;
    if (points.at(-1)?.tick !== endTick) {
        const previous = points.at(-1) ?? points[0];
        points.push({ ...previous, tick: endTick });
    }
    return points;
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
        const moved = gesture.currentLane !== gesture.startLane;
        const lane = moved
            ? Math.min(gesture.startLane, gesture.currentLane)
            : clampLane(gesture.startLane, width);
        const noteWidth = moved
            ? Math.abs(gesture.currentLane - gesture.startLane) + 1
            : Math.min(width, CHART_LANE_COUNT - lane);
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
    const rawDuration = Math.abs(gesture.currentTick - gesture.startTick);
    const durationTicks = Math.max(
        rawDuration,
        Math.max(1, Math.round(ticksPerQuarter / snapDivisor))
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

function buildEditedNote(gesture: EditGesture): ChartNote {
    const note = gesture.original;
    const laneDelta = gesture.currentLane - gesture.startLane;
    const tickDelta = gesture.currentTick - gesture.startTick;

    if (gesture.action === "resize-left") {
        const right = note.lane + note.width;
        const lane = Math.min(right - 1, Math.max(0, gesture.currentLane));
        return {
            ...note,
            lane,
            width: right - lane,
        };
    }

    if (gesture.action === "resize-right") {
        const right = Math.min(
            CHART_LANE_COUNT,
            Math.max(note.lane + 1, gesture.currentLane + 1)
        );
        return {
            ...note,
            width: right - note.lane,
        };
    }

    if (gesture.action === "resize-end") {
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

    const occupied = [
        { lane: note.lane, width: note.width },
        ...note.points.map((point) => ({
            lane: point.lane,
            width: point.width,
        })),
        ...(note.pairLane !== undefined && note.pairWidth !== undefined
            ? [{ lane: note.pairLane, width: note.pairWidth }]
            : []),
    ];
    const minLane = Math.min(...occupied.map((point) => point.lane));
    const maxLane = Math.max(
        ...occupied.map((point) => point.lane + point.width)
    );
    const clampedDelta = Math.min(
        CHART_LANE_COUNT - maxLane,
        Math.max(-minLane, laneDelta)
    );
    return {
        ...note,
        tick: Math.max(-10_000_000, note.tick + tickDelta),
        lane: note.lane + clampedDelta,
        pairLane:
            note.pairLane === undefined
                ? undefined
                : note.pairLane + clampedDelta,
        points: note.points.map((point) => ({
            ...point,
            lane: point.lane + clampedDelta,
        })),
    };
}

export default function PixiNoteEditor({
    pixelsPerSecond,
    tool,
    hand,
    defaultWidth,
    onSeek,
}: {
    pixelsPerSecond: number;
    tool: NoteEditorTool;
    hand: ChartHand;
    defaultWidth: number;
    onSeek: (timeMs: number) => void;
}) {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const applicationRef = useRef<Application | null>(null);
    const runtimeRef = useRef<PixiRuntime | null>(null);
    const [rendererReady, setRendererReady] = useState(false);
    const [gesture, setGesture] = useState<NoteGesture | null>(null);
    const document = useChartEditorStore((state) => state.document);
    const currentTimeMs = useChartEditorStore((state) => state.currentTimeMs);
    const snapDivisor = useChartEditorStore((state) => state.snapDivisor);
    const selectedNoteId = useChartEditorStore((state) => state.selectedNoteId);
    const selectNote = useChartEditorStore((state) => state.selectNote);
    const replaceNotes = useChartEditorStore((state) => state.replaceNotes);

    const previewNote =
        gesture?.kind === "create" && tool !== "select"
            ? buildPreviewNote({
                  gesture,
                  tool,
                  hand,
                  width: defaultWidth,
                  ticksPerQuarter: document.ticksPerQuarter,
                  snapDivisor,
              })
            : gesture?.kind === "edit"
              ? buildEditedNote(gesture)
              : null;

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
            runtimeRef.current = {
                Graphics: pixi.Graphics,
            };
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
            scene
                .moveTo(x + 0.5, 0)
                .lineTo(x + 0.5, height)
                .stroke({
                    color: lane % 4 === 0 ? colors.laneStrong : colors.laneWeak,
                    width: lane % 4 === 0 ? 1 : 0.5,
                });
        }

        const beatMarkers = getBeatMarkers(
            document.timingPoints,
            document.ticksPerQuarter,
            startMs,
            endMs
        );
        for (const beat of beatMarkers) {
            const y = judgmentY - (beat.timeMs - currentTimeMs) * pixelsPerMs;
            scene
                .moveTo(0, y + 0.5)
                .lineTo(width, y + 0.5)
                .stroke({
                    color: beat.accent ? colors.beatStrong : colors.beatWeak,
                    width: beat.accent ? 1.4 : 0.8,
                });
        }

        const notesToRender = previewNote
            ? gesture?.kind === "edit"
                ? document.notes.map((note) =>
                      note.id === gesture.original.id ? previewNote : note
                  )
                : [...document.notes, previewNote]
            : document.notes;
        for (const note of notesToRender) {
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
            const isPreview =
                note.id === "preview" ||
                (gesture?.kind === "edit" && note.id === gesture.original.id);
            const isSelected = note.id === selectedNoteId;
            drawNote({
                graphics: scene,
                note,
                laneWidth,
                judgmentY,
                pixelsPerMs,
                currentTimeMs,
                timingPoints: document.timingPoints,
                ticksPerQuarter: document.ticksPerQuarter,
                isPreview,
                isSelected,
            });
        }

        scene
            .moveTo(0, judgmentY + 0.5)
            .lineTo(width, judgmentY + 0.5)
            .stroke({ color: colors.judgment, width: 2 });
        application.stage.addChild(scene);
        application.render();
    }, [
        currentTimeMs,
        document.notes,
        document.ticksPerQuarter,
        document.timingPoints,
        pixelsPerSecond,
        previewNote,
        gesture,
        selectedNoteId,
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

    function pointerPosition(clientX: number, clientY: number) {
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
        return {
            lane: Math.min(
                CHART_LANE_COUNT - 1,
                Math.max(0, Math.floor(x / (bounds.width / CHART_LANE_COUNT)))
            ),
            tick: Math.round(
                snapTick(rawTick, snapDivisor, document.ticksPerQuarter)
            ),
        };
    }

    function findNoteAt(lane: number, tick: number) {
        const hitPadding = Math.max(
            1,
            Math.round(document.ticksPerQuarter / snapDivisor / 2)
        );
        return [...document.notes].reverse().find((note) => {
            const laneHit =
                (lane >= note.lane && lane < note.lane + note.width) ||
                (note.type === "trill" &&
                    note.pairLane !== undefined &&
                    note.pairWidth !== undefined &&
                    lane >= note.pairLane &&
                    lane < note.pairLane + note.pairWidth) ||
                note.points.some(
                    (point) =>
                        lane >= point.lane && lane < point.lane + point.width
                );
            if (!laneHit) return false;
            if (note.type === "standard") {
                return Math.abs(tick - note.tick) <= hitPadding;
            }
            return (
                tick >= note.tick - hitPadding &&
                tick <= note.tick + note.durationTicks + hitPadding
            );
        });
    }

    function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
        const position = pointerPosition(event.clientX, event.clientY);
        if (!position) return;
        event.currentTarget.focus();
        event.currentTarget.setPointerCapture(event.pointerId);
        if (tool === "select") {
            const note = findNoteAt(position.lane, position.tick);
            selectNote(note?.id ?? null);
            if (note) {
                const hitPadding = Math.max(
                    1,
                    Math.round(document.ticksPerQuarter / snapDivisor / 2)
                );
                let action: EditGesture["action"] = "move";
                if (
                    note.type !== "standard" &&
                    Math.abs(
                        position.tick - (note.tick + note.durationTicks)
                    ) <= hitPadding
                ) {
                    action = "resize-end";
                } else if (position.lane === note.lane && note.width > 1) {
                    action = "resize-left";
                } else if (
                    position.lane === note.lane + note.width - 1 &&
                    note.width > 1
                ) {
                    action = "resize-right";
                }
                setGesture({
                    kind: "edit",
                    action,
                    original: note,
                    startLane: position.lane,
                    startTick: position.tick,
                    currentLane: position.lane,
                    currentTick: position.tick,
                });
            }
            return;
        }
        setGesture({
            kind: "create",
            startLane: position.lane,
            startTick: position.tick,
            currentLane: position.lane,
            currentTick: position.tick,
        });
    }

    function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
        if (!gesture) return;
        const position = pointerPosition(event.clientX, event.clientY);
        if (!position) return;
        setGesture((current) =>
            current
                ? {
                      ...current,
                      currentLane: position.lane,
                      currentTick: position.tick,
                  }
                : null
        );
    }

    function finishGesture() {
        if (!gesture) return;
        if (gesture.kind === "edit") {
            const next = buildEditedNote(gesture);
            replaceNotes(
                document.notes.map((note) =>
                    note.id === gesture.original.id ? next : note
                ),
                next.id
            );
            setGesture(null);
            return;
        }
        if (tool === "select") {
            setGesture(null);
            return;
        }
        const next = buildPreviewNote({
            gesture,
            tool,
            hand,
            width: defaultWidth,
            ticksPerQuarter: document.ticksPerQuarter,
            snapDivisor,
        });
        next.id = crypto.randomUUID();
        replaceNotes([...document.notes, next], next.id);
        setGesture(null);
    }

    return (
        <div
            ref={hostRef}
            role="application"
            aria-label="28칸 WebGL 채보 작성 영역"
            tabIndex={0}
            className={`h-full min-h-80 w-full overflow-hidden outline-none ${
                tool === "select" ? "cursor-default" : "cursor-crosshair"
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                }
                finishGesture();
            }}
            onPointerCancel={() => setGesture(null)}
            onWheel={(event) => {
                event.preventDefault();
                onSeek(
                    Math.min(
                        document.durationMs,
                        Math.max(0, currentTimeMs + event.deltaY * 2)
                    )
                );
            }}
            onKeyDown={(event) => {
                if (
                    (event.key === "Delete" || event.key === "Backspace") &&
                    selectedNoteId
                ) {
                    event.preventDefault();
                    replaceNotes(
                        document.notes.filter(
                            (note) => note.id !== selectedNoteId
                        ),
                        null
                    );
                }
            }}
            onContextMenu={(event) => event.preventDefault()}
        />
    );
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
}) {
    const yForTick = (tick: number) =>
        judgmentY -
        (tickToMilliseconds(tick, timingPoints, ticksPerQuarter) -
            currentTimeMs) *
            pixelsPerMs;
    const headHeight = 9;
    const alpha = isPreview ? 0.58 : 0.88;
    const outlineColor = isPreview ? colors.preview : colors.selected;

    if (note.type !== "standard") {
        if (note.type === "trill") {
            const endY = yForTick(note.tick + note.durationTicks);
            const startY = yForTick(note.tick);
            const top = Math.min(startY, endY);
            const height = Math.max(headHeight, Math.abs(endY - startY));
            const pairLane = note.pairLane ?? note.lane;
            const pairWidth = note.pairWidth ?? note.width;
            graphics
                .roundRect(
                    note.lane * laneWidth + 1,
                    top,
                    note.width * laneWidth - 2,
                    height,
                    3
                )
                .fill({ color: colorForHand(note.hand), alpha: alpha * 0.5 });
            graphics
                .roundRect(
                    pairLane * laneWidth + 1,
                    top,
                    pairWidth * laneWidth - 2,
                    height,
                    3
                )
                .fill({ color: colorForHand(note.hand), alpha: alpha * 0.5 });

            const steps = Math.min(
                64,
                Math.max(2, Math.floor(note.durationTicks / 120))
            );
            for (let index = 0; index <= steps; index += 1) {
                const lane = index % 2 === 0 ? note.lane : pairLane;
                const width = index % 2 === 0 ? note.width : pairWidth;
                const tick =
                    note.tick +
                    Math.round((note.durationTicks * index) / steps);
                graphics
                    .roundRect(
                        lane * laneWidth + 1,
                        yForTick(tick) - headHeight / 2,
                        width * laneWidth - 2,
                        headHeight,
                        3
                    )
                    .fill({ color: colorForHand(note.hand), alpha });
            }
        } else {
            const points = noteRenderPoints(note);
            const polygon: number[] = [];
            for (const point of points) {
                polygon.push(point.lane * laneWidth + 1, yForTick(point.tick));
            }
            for (const point of [...points].reverse()) {
                polygon.push(
                    (point.lane + point.width) * laneWidth - 1,
                    yForTick(point.tick)
                );
            }
            graphics
                .poly(polygon, true)
                .fill({ color: colorForHand(note.hand), alpha: alpha * 0.52 });

            for (const point of points) {
                graphics
                    .roundRect(
                        point.lane * laneWidth + 1,
                        yForTick(point.tick) - headHeight / 2,
                        point.width * laneWidth - 2,
                        headHeight,
                        3
                    )
                    .fill({
                        color: colorForHand(point.hand),
                        alpha:
                            point.tick === note.tick ||
                            point.tick === note.tick + note.durationTicks
                                ? alpha
                                : alpha * 0.82,
                    });
            }
        }
    } else {
        graphics
            .roundRect(
                note.lane * laneWidth + 1,
                yForTick(note.tick) - headHeight / 2,
                note.width * laneWidth - 2,
                headHeight,
                3
            )
            .fill({ color: colorForHand(note.hand), alpha });
    }

    if (isSelected || isPreview) {
        const startY = yForTick(note.tick);
        graphics
            .roundRect(
                note.lane * laneWidth,
                startY - headHeight / 2 - 1,
                note.width * laneWidth,
                headHeight + 2,
                4
            )
            .stroke({ color: outlineColor, width: isSelected ? 2 : 1 });
        if (isSelected) {
            const handleSize = 7;
            const left = note.lane * laneWidth;
            const right = (note.lane + note.width) * laneWidth;
            graphics
                .roundRect(
                    left - handleSize / 2,
                    startY - handleSize / 2,
                    handleSize,
                    handleSize,
                    2
                )
                .fill(colors.selected);
            graphics
                .roundRect(
                    right - handleSize / 2,
                    startY - handleSize / 2,
                    handleSize,
                    handleSize,
                    2
                )
                .fill(colors.selected);
            if (note.type !== "standard") {
                const endY = yForTick(note.tick + note.durationTicks);
                const centerX = (note.lane + note.width / 2) * laneWidth;
                graphics
                    .roundRect(
                        centerX - handleSize / 2,
                        endY - handleSize / 2,
                        handleSize,
                        handleSize,
                        2
                    )
                    .fill(colors.selected);
            }
        }
    }
}
