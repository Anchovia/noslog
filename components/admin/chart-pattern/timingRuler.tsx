"use client";

import { useCallback, useEffect, useRef } from "react";

import {
    CHART_LANE_COUNT,
    CHART_TICKS_PER_QUARTER,
} from "@/lib/chart-pattern/schema";
import {
    formatBpm,
    formatEditorTime,
    getBeatMarkers,
} from "@/lib/chart-pattern/timing";

import { useChartEditorStore } from "./chartEditorStore";

function cssColor(name: string, fallback: string) {
    if (typeof window === "undefined") return fallback;
    return (
        getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim() || fallback
    );
}

export default function TimingRuler({
    pixelsPerSecond,
    onSeek,
}: {
    pixelsPerSecond: number;
    onSeek: (timeMs: number) => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const currentTimeMs = useChartEditorStore((state) => state.currentTimeMs);
    const durationMs = useChartEditorStore(
        (state) => state.document.durationMs
    );
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
        const judgmentY = viewHeight * 0.76;
        const pixelsPerMs = pixelsPerSecond / 1_000;
        const startMs = currentTimeMs - (viewHeight - judgmentY) / pixelsPerMs;
        const endMs = currentTimeMs + judgmentY / pixelsPerMs;

        context.clearRect(0, 0, viewWidth, viewHeight);
        context.fillStyle = cssColor("--color-bg", "#0b0b10");
        context.fillRect(0, 0, viewWidth, viewHeight);

        const laneWidth = viewWidth / CHART_LANE_COUNT;
        for (let lane = 0; lane <= CHART_LANE_COUNT; lane += 1) {
            const x = lane * laneWidth;
            context.strokeStyle =
                lane % 4 === 0
                    ? cssColor("--color-border", "#2a2a35")
                    : cssColor("--color-divider", "#20202a");
            context.lineWidth = lane % 4 === 0 ? 1 : 0.5;
            context.beginPath();
            context.moveTo(x + 0.5, 0);
            context.lineTo(x + 0.5, viewHeight);
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
                ? cssColor("--color-text-disabled", "#666674")
                : cssColor("--color-divider", "#20202a");
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
                    ? cssColor("--color-score", "#facc15")
                    : cssColor("--color-chart", "#38bdf8");
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

        context.strokeStyle = cssColor("--color-text-primary", "#f2f2f5");
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(0, judgmentY + 0.5);
        context.lineTo(viewWidth, judgmentY + 0.5);
        context.stroke();

        context.fillStyle = cssColor("--color-surface", "#121218");
        context.fillRect(8, judgmentY - 26, 92, 20);
        context.fillStyle = cssColor("--color-text-primary", "#f2f2f5");
        context.font = "12px monospace";
        context.textBaseline = "middle";
        context.fillText(formatEditorTime(currentTimeMs), 14, judgmentY - 16);
    }, [currentTimeMs, pixelsPerSecond, selectedTimingPointId, timingPoints]);

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
        const judgmentY = bounds.height * 0.76;
        const pixelsPerMs = pixelsPerSecond / 1_000;
        const nextTime =
            currentTimeMs + (judgmentY - (clientY - bounds.top)) / pixelsPerMs;
        onSeek(Math.min(durationMs, Math.max(0, nextTime)));
    }

    return (
        <canvas
            ref={canvasRef}
            role="application"
            aria-label="타이밍 정렬 영역"
            tabIndex={0}
            className="h-full min-h-80 w-full touch-none"
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
