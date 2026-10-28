"use client";

import { useCallback, useEffect, useRef } from "react";

import {
    CHART_LANE_COUNT,
    CHART_TICKS_PER_QUARTER,
    isChartLaneGroupBoundary,
} from "@/lib/chart-pattern/schema";
import {
    getChartEditorNavigationDurationMs,
    getChartEditorVerticalLayout,
} from "@/lib/chart-pattern/editor";
import {
    formatBpm,
    formatEditorTime,
    getBeatMarkers,
} from "@/lib/chart-pattern/timing";

import { useTranslations } from "@/components/i18n/locale-provider";
import { chartPianoColors } from "@/lib/chart-pattern/piano";
import {
    EDITOR_COLORS,
    numberToHex,
    STAGE_CANVAS,
} from "@/lib/chart-pattern/stageColors";

import { useChartEditorStore } from "./chartEditorStore";

function drawTimingPiano(
    context: CanvasRenderingContext2D,
    viewWidth: number,
    viewHeight: number,
    judgmentY: number
) {
    const laneWidth = viewWidth / CHART_LANE_COUNT;
    const pianoTop = judgmentY + 5;
    const pianoHeight = Math.max(1, viewHeight - pianoTop);

    for (let lane = 0; lane < CHART_LANE_COUNT; lane += 1) {
        context.fillStyle = numberToHex(
            lane % 2 === 0 ? chartPianoColors.white : chartPianoColors.whiteAlt
        );
        context.fillRect(lane * laneWidth, pianoTop, laneWidth, pianoHeight);
        context.strokeStyle = EDITOR_COLORS.pianoKeyLine;
        context.lineWidth = 0.65;
        context.strokeRect(lane * laneWidth, pianoTop, laneWidth, pianoHeight);
    }

    const blackAfter = new Set([0, 1, 3, 4, 5]);
    context.fillStyle = numberToHex(chartPianoColors.black);
    for (let lane = 0; lane < CHART_LANE_COUNT - 1; lane += 1) {
        if (!blackAfter.has(lane % 7)) continue;
        const x = (lane + 1) * laneWidth;
        context.fillRect(
            x - laneWidth * 0.22,
            pianoTop,
            laneWidth * 0.44,
            pianoHeight * 0.56
        );
    }

    context.fillStyle = EDITOR_COLORS.pianoRail;
    context.strokeStyle = EDITOR_COLORS.pianoEdge;
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(0, judgmentY - 5, viewWidth, 10, 4);
    context.fill();
    context.stroke();
    context.strokeStyle = EDITOR_COLORS.playhead;
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(5, judgmentY - 1.5);
    context.lineTo(viewWidth - 5, judgmentY - 1.5);
    context.stroke();
}

export default function TimingRuler({
    pixelsPerSecond,
    pianoVisible,
    onSeek,
}: {
    pixelsPerSecond: number;
    pianoVisible: boolean;
    onSeek: (timeMs: number) => void;
}) {
    const t = useTranslations();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const currentTimeMs = useChartEditorStore((state) => state.currentTimeMs);
    const chartDocument = useChartEditorStore((state) => state.document);
    const durationMs = getChartEditorNavigationDurationMs(chartDocument);
    const timingPoints = useChartEditorStore(
        (state) => state.document.timingPoints
    );
    const selectedTimingPointId = useChartEditorStore(
        (state) => state.selectedTimingPointId
    );

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const bounds = canvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        const width = Math.max(1, Math.floor(bounds.width * ratio));
        const height = Math.max(1, Math.floor(bounds.height * ratio));
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }

        const context = canvas.getContext("2d");
        if (!context) return;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        const viewWidth = bounds.width;
        const viewHeight = bounds.height;
        const { judgmentY } = getChartEditorVerticalLayout(
            viewHeight,
            pianoVisible
        );
        const pixelsPerMs = pixelsPerSecond / 1_000;
        const startMs = pianoVisible
            ? currentTimeMs
            : currentTimeMs - (viewHeight - judgmentY) / pixelsPerMs;
        const endMs = currentTimeMs + judgmentY / pixelsPerMs;

        context.clearRect(0, 0, viewWidth, viewHeight);
        // 바탕은 노트 캔버스와 같은 무대 색
        context.fillStyle = STAGE_CANVAS;
        context.fillRect(0, 0, viewWidth, viewHeight);

        const laneWidth = viewWidth / CHART_LANE_COUNT;
        for (let lane = 0; lane <= CHART_LANE_COUNT; lane += 1) {
            const x = lane * laneWidth;
            const isGroupBoundary = isChartLaneGroupBoundary(lane);
            context.strokeStyle = isGroupBoundary
                ? EDITOR_COLORS.rulerLaneGroupLine
                : EDITOR_COLORS.rulerLine;
            context.lineWidth = isGroupBoundary ? 1 : 0.5;
            context.beginPath();
            context.moveTo(x + 0.5, 0);
            context.lineTo(x + 0.5, pianoVisible ? judgmentY : viewHeight);
            context.stroke();
        }

        const beats = getBeatMarkers(
            timingPoints,
            CHART_TICKS_PER_QUARTER,
            startMs,
            endMs
        );
        for (const beat of beats) {
            const y = judgmentY - (beat.timeMs - currentTimeMs) * pixelsPerMs;
            context.strokeStyle = beat.accent
                ? EDITOR_COLORS.rulerBeatAccentLine
                : EDITOR_COLORS.rulerLine;
            context.lineWidth = beat.accent ? 1.5 : 1;
            context.beginPath();
            context.moveTo(0, y + 0.5);
            context.lineTo(viewWidth, y + 0.5);
            context.stroke();
        }

        context.font = "11px sans-serif";
        context.textBaseline = "top";
        for (const point of timingPoints) {
            if (point.timeMs < startMs || point.timeMs > endMs) continue;
            const y = judgmentY - (point.timeMs - currentTimeMs) * pixelsPerMs;
            context.strokeStyle =
                point.id === selectedTimingPointId
                    ? EDITOR_COLORS.preview
                    : EDITOR_COLORS.timingPoint;
            context.lineWidth = point.id === selectedTimingPointId ? 2 : 1.5;
            context.beginPath();
            context.moveTo(0, y + 0.5);
            context.lineTo(viewWidth, y + 0.5);
            context.stroke();
            context.fillStyle = context.strokeStyle;
            context.fillText(
                `${formatBpm(point.bpm)} BPM · ${point.numerator}/${point.denominator}`,
                8,
                Math.min(viewHeight - 18, y + 4)
            );
        }

        if (pianoVisible) {
            drawTimingPiano(context, viewWidth, viewHeight, judgmentY);
        } else {
            context.strokeStyle = EDITOR_COLORS.playhead;
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(0, judgmentY + 0.5);
            context.lineTo(viewWidth, judgmentY + 0.5);
            context.stroke();
        }

        context.fillStyle = EDITOR_COLORS.timeLabel;
        context.fillRect(8, judgmentY - 26, 92, 20);
        context.fillStyle = EDITOR_COLORS.playhead;
        context.font = "12px monospace";
        context.textBaseline = "middle";
        context.fillText(formatEditorTime(currentTimeMs), 14, judgmentY - 16);
    }, [
        currentTimeMs,
        pianoVisible,
        pixelsPerSecond,
        selectedTimingPointId,
        timingPoints,
    ]);

    useEffect(() => {
        draw();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const observer = new ResizeObserver(draw);
        observer.observe(canvas);
        return () => observer.disconnect();
    }, [draw]);

    function seekFromY(clientY: number) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const bounds = canvas.getBoundingClientRect();
        const y = clientY - bounds.top;
        const { judgmentY } = getChartEditorVerticalLayout(
            bounds.height,
            pianoVisible
        );
        if (pianoVisible && y > judgmentY) return;
        const pixelsPerMs = pixelsPerSecond / 1_000;
        const nextTime = currentTimeMs + (judgmentY - y) / pixelsPerMs;
        onSeek(Math.min(durationMs, Math.max(0, nextTime)));
    }

    return (
        <canvas
            ref={canvasRef}
            role="application"
            aria-label={t("editor.rulerLabel")}
            tabIndex={0}
            className="nl-editor-canvas-min h-full w-full touch-none"
            onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                seekFromY(event.clientY);
            }}
            onPointerMove={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    seekFromY(event.clientY);
                }
            }}
            onWheel={(event) => {
                event.preventDefault();
                onSeek(
                    Math.min(
                        durationMs,
                        Math.max(0, currentTimeMs + event.deltaY * 2)
                    )
                );
            }}
            onKeyDown={(event) => {
                if (event.key === "ArrowUp") {
                    event.preventDefault();
                    onSeek(Math.min(durationMs, currentTimeMs + 100));
                } else if (event.key === "ArrowDown") {
                    event.preventDefault();
                    onSeek(Math.max(0, currentTimeMs - 100));
                }
            }}
        />
    );
}
