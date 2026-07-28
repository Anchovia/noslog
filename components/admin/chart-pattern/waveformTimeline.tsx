"use client";

import { useCallback, useEffect, useRef } from "react";

import { formatEditorTime } from "@/lib/chart-pattern/timing";

import { useChartEditorStore } from "./chartEditorStore";

interface WaveformTimelineProps {
    peaks: Float32Array | null;
    onSeek: (timeMs: number) => void;
}

function cssColor(name: string, fallback: string) {
    if (typeof window === "undefined") return fallback;
    return (
        getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim() || fallback
    );
}

export default function WaveformTimeline({
    peaks,
    onSeek,
}: WaveformTimelineProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const durationMs = useChartEditorStore(
        (state) => state.document.durationMs
    );
    const timingPoints = useChartEditorStore(
        (state) => state.document.timingPoints
    );
    const currentTimeMs = useChartEditorStore((state) => state.currentTimeMs);
    const selectedTimingPointId = useChartEditorStore(
        (state) => state.selectedTimingPointId
    );
    const selectTimingPoint = useChartEditorStore(
        (state) => state.selectTimingPoint
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
        const centerY = viewHeight / 2;

        context.clearRect(0, 0, viewWidth, viewHeight);
        context.fillStyle = cssColor("--color-surface-muted", "#1a1a22");
        context.fillRect(0, 0, viewWidth, viewHeight);

        context.strokeStyle = cssColor("--color-divider", "#20202a");
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, centerY + 0.5);
        context.lineTo(viewWidth, centerY + 0.5);
        context.stroke();

        if (peaks && peaks.length > 0) {
            context.fillStyle = cssColor("--color-text-disabled", "#666674");
            const barWidth = viewWidth / peaks.length;
            for (let index = 0; index < peaks.length; index += 1) {
                const x = index * barWidth;
                const barHeight = Math.max(1, peaks[index] * (viewHeight - 20));
                context.fillRect(
                    x,
                    centerY - barHeight / 2,
                    Math.max(1, barWidth),
                    barHeight
                );
            }
        } else {
            context.fillStyle = cssColor("--color-text-disabled", "#666674");
            context.font = "12px sans-serif";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(
                durationMs > 0
                    ? "음원을 불러오면 파형이 표시됩니다."
                    : "먼저 로컬 음원을 불러오세요.",
                viewWidth / 2,
                centerY
            );
        }

        if (durationMs > 0) {
            for (const point of timingPoints) {
                if (point.timeMs < 0 || point.timeMs > durationMs) continue;
                const x = (point.timeMs / durationMs) * viewWidth;
                context.strokeStyle =
                    point.id === selectedTimingPointId
                        ? cssColor("--color-score", "#facc15")
                        : cssColor("--color-chart", "#38bdf8");
                context.lineWidth = point.id === selectedTimingPointId ? 2 : 1;
                context.beginPath();
                context.moveTo(x + 0.5, 0);
                context.lineTo(x + 0.5, viewHeight);
                context.stroke();
            }

            const playheadX =
                (Math.min(currentTimeMs, durationMs) / durationMs) * viewWidth;
            context.strokeStyle = cssColor("--color-text-primary", "#f2f2f5");
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(playheadX + 0.5, 0);
            context.lineTo(playheadX + 0.5, viewHeight);
            context.stroke();
        }
    }, [currentTimeMs, durationMs, peaks, selectedTimingPointId, timingPoints]);

    useEffect(() => {
        draw();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const observer = new ResizeObserver(draw);
        observer.observe(canvas);
        return () => observer.disconnect();
    }, [draw]);

    function seekFromClientX(clientX: number) {
        const canvas = canvasRef.current;
        if (!canvas || durationMs <= 0) return;
        const bounds = canvas.getBoundingClientRect();
        const ratio = Math.min(
            1,
            Math.max(0, (clientX - bounds.left) / bounds.width)
        );
        const nextTime = ratio * durationMs;
        const marker = timingPoints.find(
            (point) =>
                Math.abs(point.timeMs - nextTime) <=
                (durationMs / bounds.width) * 7
        );
        if (marker) selectTimingPoint(marker.id);
        onSeek(nextTime);
    }

    return (
        <div className="relative min-w-0 flex-1">
            <canvas
                ref={canvasRef}
                role="slider"
                aria-label="곡 전체 타임라인"
                aria-valuemin={0}
                aria-valuemax={durationMs}
                aria-valuenow={Math.round(currentTimeMs)}
                aria-valuetext={formatEditorTime(currentTimeMs)}
                tabIndex={0}
                className="h-20 w-full touch-none rounded-md"
                onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    seekFromClientX(event.clientX);
                }}
                onPointerMove={(event) => {
                    if (
                        event.currentTarget.hasPointerCapture(event.pointerId)
                    ) {
                        seekFromClientX(event.clientX);
                    }
                }}
                onKeyDown={(event) => {
                    if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        onSeek(Math.max(0, currentTimeMs - 100));
                    } else if (event.key === "ArrowRight") {
                        event.preventDefault();
                        onSeek(Math.min(durationMs, currentTimeMs + 100));
                    }
                }}
            />
        </div>
    );
}
