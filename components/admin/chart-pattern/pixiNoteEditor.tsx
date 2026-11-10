"use client";

import {
    type PointerEvent as ReactPointerEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import type { Application } from "pixi.js";

import { loadPixi } from "@/lib/chart-pattern/loadPixi";
import {
    CHART_EDITOR_SNAP_DIVISORS,
    clampChartLane,
    chartNoteContainsPoint,
    chartNoteIntersectsRect,
    chartNoteRangeAtTick,
    cloneChartNotesAtTick,
    findChartNoteConflicts,
    flipChartNotesHorizontally,
    getChartEditorNavigationDurationMs,
    getChartEditorVerticalLayout,
    getChartNoteHorizontalResizeHandle,
    getGlissandoSnapRenderPoints,
    moveGlissandoSnapAnchor,
    moveChartNotes,
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
import { findOffGridNotes } from "@/lib/chart-pattern/snapCheck";

import { useTranslations } from "@/components/i18n/locale-provider";

import { useChartEditorStore } from "./chartEditorStore";
import { drawCommentLine, drawOffGridMarker } from "./snapCheckMarker";
import {
    buildHoverPreviewNote,
    buildPointEditedNote,
    buildPreviewNote,
    buildResizedNote,
    type HoverPreviewPosition,
    moveNotesForGesture,
    type NoteGesture,
    replacePreviewNote,
    selectedNotesFrom,
} from "./noteGestures";
import {
    colors,
    drawEditorPiano,
    drawImportFocus,
    drawImportNote,
    drawImportRemoval,
    drawImportTiming,
    drawNote,
    styleForSnapSubdivision,
} from "./pixiNoteDraw";

export type NoteEditorTool = "select" | ChartNoteType;

interface PointerPosition {
    lane: number;
    laneFloat: number;
    tick: number;
    rawTick: number;
    x: number;
    y: number;
}

interface PixiRuntime {
    Graphics: typeof import("pixi.js").Graphics;
}

const DURATION_RESIZE_HIT_RADIUS_PX = 7;

export default function PixiNoteEditor({
    pixelsPerSecond,
    pianoVisible,
    tool,
    hand,
    defaultWidth,
    onSeek,
    onToolChange,
}: {
    pixelsPerSecond: number;
    pianoVisible: boolean;
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
    const [hoverPreviewPosition, setHoverPreviewPosition] =
        useState<HoverPreviewPosition | null>(null);
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
    const importPreview = useChartEditorStore((state) => state.importPreview);
    const commentTimes = useChartEditorStore((state) => state.commentTimes);
    const t = useTranslations();
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
    // 스냅 확인(격자 밖 노트) 점선 — 목록은 노트 검사기 아래 SnapCheckSection
    const offGridNoteIds = useMemo(
        () => new Set(findOffGridNotes(document).map((item) => item.id)),
        [document]
    );

    const previewNotes = (() => {
        if (!gesture) {
            if (tool === "select" || !hoverPreviewPosition) {
                return document.notes;
            }
            return [
                ...document.notes,
                buildHoverPreviewNote({
                    position: hoverPreviewPosition,
                    tool,
                    hand,
                    width: defaultWidth,
                    ticksPerQuarter: document.ticksPerQuarter,
                    snapDivisor,
                }),
            ];
        }
        if (gesture.kind === "move") {
            return moveNotesForGesture(
                document.notes,
                gesture,
                snapDivisor,
                document.ticksPerQuarter
            );
        }
        if (gesture.kind === "resize") {
            return replacePreviewNote(
                document.notes,
                gesture.original.id,
                buildResizedNote(gesture, snapDivisor, document.ticksPerQuarter)
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
            const pixi = await loadPixi();
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
        const { judgmentY } = getChartEditorVerticalLayout(
            height,
            pianoVisible
        );
        const pixelsPerMs = pixelsPerSecond / 1_000;
        const startMs = pianoVisible
            ? currentTimeMs
            : currentTimeMs - (height - judgmentY) / pixelsPerMs;
        const endMs = currentTimeMs + judgmentY / pixelsPerMs;
        const laneWidth = width / CHART_LANE_COUNT;

        scene.rect(0, 0, width, height).fill(colors.background);
        for (let lane = 0; lane <= CHART_LANE_COUNT; lane += 1) {
            const x = lane * laneWidth;
            const isGroupBoundary = isChartLaneGroupBoundary(lane);
            scene
                .moveTo(x + 0.5, 0)
                .lineTo(x + 0.5, pianoVisible ? judgmentY : height)
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
        const yForTick = (tick: number) =>
            judgmentY -
            (tickToMilliseconds(
                tick,
                document.timingPoints,
                document.ticksPerQuarter
            ) -
                currentTimeMs) *
                pixelsPerMs;
        const isVisible = (note: ChartNote) =>
            tickToMilliseconds(
                note.tick + note.durationTicks,
                document.timingPoints,
                document.ticksPerQuarter
            ) >= startMs &&
            tickToMilliseconds(
                note.tick,
                document.timingPoints,
                document.ticksPerQuarter
            ) <= endMs;
        if (
            importPreview?.focusTick !== null &&
            importPreview?.focusTick !== undefined
        ) {
            drawImportFocus(scene, width, yForTick(importPreview.focusTick));
        }
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
            const isPlacementPreview =
                note.id === "preview" || note.id === "hover-preview";
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
                isPreview:
                    isPlacementPreview || (gesture !== null && isSelected),
                isSelected,
                isDimmed:
                    importPreview !== null ||
                    (hasSelection && !isSelected && !isPlacementPreview),
                showControls: isSelected && selected.size === 1,
                isConflicted: conflictingNoteIds.has(note.id),
            });
        }

        if (importPreview) {
            for (const tick of importPreview.timingTicks) {
                const y = yForTick(tick);
                if (y < 0 || y > height) continue;
                drawImportTiming(scene, width, y);
            }
            const removing = new Set(importPreview.removingIds);
            for (const note of document.notes) {
                if (!removing.has(note.id) || !isVisible(note)) continue;
                drawImportRemoval(scene, note, laneWidth, yForTick);
            }
            for (const note of importPreview.incoming) {
                if (!isVisible(note)) continue;
                drawImportNote(scene, note, laneWidth, yForTick);
            }
        } else {
            for (const note of document.notes) {
                if (!offGridNoteIds.has(note.id) || !isVisible(note)) continue;
                drawOffGridMarker(scene, note, laneWidth, yForTick);
            }
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

        if (pianoVisible) {
            const activeLaneHands = new Map<number, ChartHand>();
            const currentTick = millisecondsToTick(
                currentTimeMs,
                document.timingPoints,
                document.ticksPerQuarter
            );
            const markRange = (
                laneValue: number,
                widthValue: number,
                handValue: ChartHand
            ) => {
                for (
                    let lane = Math.floor(laneValue);
                    lane < Math.ceil(laneValue + widthValue);
                    lane += 1
                ) {
                    if (lane >= 0 && lane < CHART_LANE_COUNT) {
                        activeLaneHands.set(lane, handValue);
                    }
                }
            };
            for (const note of previewNotes) {
                if (note.id === "hover-preview") continue;
                const noteStartMs = tickToMilliseconds(
                    note.tick,
                    document.timingPoints,
                    document.ticksPerQuarter
                );
                if (note.type === "standard") {
                    if (Math.abs(noteStartMs - currentTimeMs) <= 90) {
                        markRange(note.lane, note.width, note.hand);
                    }
                    continue;
                }
                const noteEndMs = tickToMilliseconds(
                    note.tick + note.durationTicks,
                    document.timingPoints,
                    document.ticksPerQuarter
                );
                if (currentTimeMs < noteStartMs || currentTimeMs > noteEndMs) {
                    continue;
                }
                if (
                    note.type === "trill" &&
                    note.pairLane !== undefined &&
                    note.pairWidth !== undefined
                ) {
                    markRange(note.lane, note.width, note.hand);
                    markRange(note.pairLane, note.pairWidth, note.hand);
                    continue;
                }
                const range = chartNoteRangeAtTick(note, currentTick);
                markRange(range.lane, range.width, range.hand);
            }
            drawEditorPiano(scene, width, height, judgmentY, activeLaneHands);
        } else {
            scene
                .moveTo(0, judgmentY + 0.5)
                .lineTo(width, judgmentY + 0.5)
                .stroke({ color: colors.judgment, width: 2 });
        }
        // 시각 댓글 자리는 판정선 위에도 보이게 맨 마지막에(2026-09-24 B1)
        for (const timeMs of commentTimes) {
            if (timeMs < startMs || timeMs > endMs) continue;
            drawCommentLine(
                scene,
                width,
                judgmentY - (timeMs - currentTimeMs) * pixelsPerMs
            );
        }
        application.stage.addChild(scene);
        application.render();
    }, [
        commentTimes,
        currentTimeMs,
        document.notes,
        document.ticksPerQuarter,
        document.timingPoints,
        gesture,
        conflictingNoteIds,
        importPreview,
        offGridNoteIds,
        pixelsPerSecond,
        pianoVisible,
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
                if (CHART_EDITOR_SNAP_DIVISORS.includes(divisor)) {
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
                const currentIndex =
                    CHART_EDITOR_SNAP_DIVISORS.indexOf(snapDivisor);
                const direction = event.deltaY > 0 ? 1 : -1;
                const nextIndex = Math.min(
                    CHART_EDITOR_SNAP_DIVISORS.length - 1,
                    Math.max(0, currentIndex + direction)
                );
                setSnapDivisor(CHART_EDITOR_SNAP_DIVISORS[nextIndex]);
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
        const { judgmentY } = getChartEditorVerticalLayout(
            bounds.height,
            pianoVisible
        );
        if (pianoVisible && y > judgmentY) return null;
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
        const { judgmentY } = getChartEditorVerticalLayout(
            host.clientHeight,
            pianoVisible
        );
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
        const { judgmentY } = getChartEditorVerticalLayout(
            host.clientHeight,
            pianoVisible
        );
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
        const lane = clampChartLane(Math.round(range.lane), width);
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
            setHoverPreviewPosition(null);
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
            anchorTick: hit.tick,
            startLane: position.lane,
            startTick: position.tick,
            currentLane: position.lane,
            currentTick: position.tick,
            startX: position.x,
            startY: position.y,
            currentX: position.x,
            currentY: position.y,
        });
    }

    function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
        const position = pointerPosition(event.clientX, event.clientY);
        if (!position) {
            if (!gesture) setHoverPreviewPosition(null);
            return;
        }
        if (!gesture) {
            if (tool !== "select") {
                setHoverPreviewPosition((current) =>
                    current?.lane === position.lane &&
                    current.tick === position.tick
                        ? current
                        : {
                              lane: position.lane,
                              tick: position.tick,
                          }
                );
                setIsAnchorHovered(false);
                setIsDurationHandleHovered(false);
                setIsResizeHandleHovered(false);
                return;
            }
            setHoverPreviewPosition(null);
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
            if (current.kind === "move") {
                return {
                    ...current,
                    currentLane: position.lane,
                    currentTick: position.tick,
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
                moveNotesForGesture(
                    document.notes,
                    gesture,
                    snapDivisor,
                    document.ticksPerQuarter
                ),
                gesture.selectedIds
            );
        } else if (gesture.kind === "resize") {
            const next = buildResizedNote(
                gesture,
                snapDivisor,
                document.ticksPerQuarter
            );
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
            aria-label={t("editor.canvasLabel")}
            tabIndex={0}
            className={`nl-editor-canvas-min h-full w-full overflow-hidden outline-none ${
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
                setHoverPreviewPosition(null);
                if (!gesture) {
                    setIsResizeHandleHovered(false);
                    setIsAnchorHovered(false);
                    setIsDurationHandleHovered(false);
                }
            }}
            onPointerCancel={() => {
                setGesture(null);
                setHoverPreviewPosition(null);
                setIsResizeHandleHovered(false);
                setIsAnchorHovered(false);
                setIsDurationHandleHovered(false);
            }}
            onContextMenu={(event) => event.preventDefault()}
        />
    );
}
