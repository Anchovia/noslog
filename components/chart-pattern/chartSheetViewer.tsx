"use client";

import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

import {
    CHART_LANE_COUNT,
    type ChartDocument,
    type ChartHand,
    type ChartNote,
} from "@/lib/chart-pattern/schema";
import {
    formatEditorTime,
    getBeatMarkers,
    tickToMilliseconds,
} from "@/lib/chart-pattern/timing";

interface ChartSheetViewerProps {
    title: string;
    artist: string | null;
    difficulty: string;
    level: number;
    revision: number | null;
    document: ChartDocument;
    backHref: string;
    preview?: boolean;
}

const PANEL_DURATION_MS = 12_000;
const PANEL_WIDTH = 220;
const PANEL_HEIGHT = 720;
const PADDING_TOP = 30;
const PADDING_BOTTOM = 34;

const handColors: Record<ChartHand, string> = {
    left: "#62d4e8",
    right: "#f06b68",
};

function chartDuration(document: ChartDocument) {
    const noteEnd = document.notes.reduce((maximum, note) => {
        const time = tickToMilliseconds(
            note.tick + note.durationTicks,
            document.timingPoints,
            document.ticksPerQuarter
        );
        return Math.max(maximum, time);
    }, 0);
    return Math.max(document.durationMs, Math.ceil(noteEnd + 1_000), 1_000);
}

export default function ChartSheetViewer({
    title,
    artist,
    difficulty,
    level,
    revision,
    document,
    backHref,
    preview = false,
}: ChartSheetViewerProps) {
    const durationMs = useMemo(() => chartDuration(document), [document]);
    const panels = useMemo(
        () =>
            Array.from(
                {
                    length: Math.max(
                        1,
                        Math.ceil(durationMs / PANEL_DURATION_MS)
                    ),
                },
                (_, index) => ({
                    index,
                    startMs: index * PANEL_DURATION_MS,
                    endMs: Math.min(
                        durationMs,
                        (index + 1) * PANEL_DURATION_MS
                    ),
                })
            ),
        [durationMs]
    );

    return (
        <main className="bg-bg fixed inset-0 z-[100] w-full overflow-y-auto px-3 pt-4 pb-24 sm:px-5">
            <header className="mx-auto flex w-full max-w-7xl items-start gap-3">
                <Link
                    href={backHref}
                    aria-label="악곡 상세로 돌아가기"
                    className="border-border bg-surface hover:bg-surface-muted flex size-10 shrink-0 items-center justify-center rounded-md border"
                >
                    <ArrowLeft className="size-4" />
                </Link>
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-title truncate">{title}</h1>
                        <span className="bg-surface-muted text-caption rounded px-2 py-1 font-semibold">
                            {difficulty} · Lv {level}
                        </span>
                        {preview ? (
                            <span className="border-chart/40 text-chart rounded border px-2 py-1 text-[11px] font-semibold">
                                관리자 초안 미리보기
                            </span>
                        ) : null}
                    </div>
                    <p className="text-body-muted mt-1 truncate">
                        {artist ?? "아티스트 정보 없음"}
                    </p>
                    <p className="text-caption mt-2">
                        노트 {document.notes.length.toLocaleString("ko-KR")}개
                        {revision === null
                            ? ""
                            : ` · ${preview ? "저장" : "공개"} v${revision}`}
                        {" · "}
                        {formatEditorTime(durationMs)}
                    </p>
                </div>
            </header>

            <section className="mx-auto mt-4 w-full max-w-7xl">
                <div className="border-border bg-surface text-caption flex items-start gap-2 rounded-md border px-3 py-2.5">
                    <Info className="mt-0.5 size-3.5 shrink-0" />
                    <p>
                        각 열은 아래에서 위로 진행합니다. 화면을 가로로
                        스크롤하면 곡 전체 채보를 순서대로 확인할 수 있습니다.
                    </p>
                </div>

                <div className="mt-3 flex items-center gap-4 px-1 text-xs">
                    <Legend color={handColors.left} label="왼손 안내" />
                    <Legend color={handColors.right} label="오른손 안내" />
                    <span className="text-text-disabled ml-auto">
                        28칸 · 열당 12초
                    </span>
                </div>
            </section>

            {document.notes.length === 0 ? (
                <div className="border-border bg-surface text-text-secondary mx-auto mt-4 flex min-h-64 w-full max-w-7xl items-center justify-center rounded-md border text-sm">
                    표시할 노트가 없습니다.
                </div>
            ) : (
                <section
                    tabIndex={0}
                    aria-label="전체 채보 가로 스크롤"
                    className="border-border bg-surface focus:border-text-secondary mt-4 overflow-x-auto rounded-lg border p-3 outline-none"
                >
                    <div className="flex w-max gap-3">
                        {panels.map((panel) => (
                            <ChartSheetPanel
                                key={panel.index}
                                index={panel.index}
                                startMs={panel.startMs}
                                endMs={panel.endMs}
                                document={document}
                            />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}

function Legend({ color, label }: { color: string; label: string }) {
    return (
        <span className="text-text-secondary flex items-center gap-1.5">
            <span
                className="size-2.5 rounded-sm"
                style={{ backgroundColor: color }}
            />
            {label}
        </span>
    );
}

function ChartSheetPanel({
    index,
    startMs,
    endMs,
    document,
}: {
    index: number;
    startMs: number;
    endMs: number;
    document: ChartDocument;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.round(PANEL_WIDTH * ratio);
        canvas.height = Math.round(PANEL_HEIGHT * ratio);
        const context = canvas.getContext("2d");
        if (!context) return;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        drawPanel(context, { startMs, endMs, document });
    }, [document, endMs, startMs]);

    return (
        <figure className="shrink-0">
            <figcaption className="text-micro mb-1.5 flex items-center justify-between px-1">
                <span>{index + 1}열</span>
                <span className="font-mono tabular-nums">
                    {formatEditorTime(startMs)}–{formatEditorTime(endMs)}
                </span>
            </figcaption>
            <canvas
                ref={canvasRef}
                role="img"
                aria-label={`${index + 1}열 ${formatEditorTime(startMs)}부터 ${formatEditorTime(endMs)}까지`}
                className="border-border h-[720px] w-[220px] rounded-sm border"
            />
        </figure>
    );
}

function drawPanel(
    context: CanvasRenderingContext2D,
    {
        startMs,
        endMs,
        document,
    }: {
        startMs: number;
        endMs: number;
        document: ChartDocument;
    }
) {
    const chartHeight = PANEL_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
    const laneWidth = PANEL_WIDTH / CHART_LANE_COUNT;
    const panelDuration = Math.max(1, endMs - startMs);
    const yForTime = (timeMs: number) =>
        PANEL_HEIGHT -
        PADDING_BOTTOM -
        ((timeMs - startMs) / panelDuration) * chartHeight;

    context.clearRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
    context.fillStyle = "#0b0b10";
    context.fillRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);

    context.save();
    context.beginPath();
    context.rect(0, PADDING_TOP, PANEL_WIDTH, chartHeight);
    context.clip();

    for (let lane = 0; lane <= CHART_LANE_COUNT; lane += 1) {
        const x = lane * laneWidth + 0.5;
        context.strokeStyle = lane % 4 === 0 ? "#343441" : "#20202a";
        context.lineWidth = lane % 4 === 0 ? 1 : 0.5;
        context.beginPath();
        context.moveTo(x, PADDING_TOP);
        context.lineTo(x, PANEL_HEIGHT - PADDING_BOTTOM);
        context.stroke();
    }

    const beats = getBeatMarkers(
        document.timingPoints,
        document.ticksPerQuarter,
        startMs,
        endMs
    );
    for (const beat of beats) {
        const y = yForTime(beat.timeMs) + 0.5;
        context.strokeStyle = beat.accent ? "#656574" : "#2a2a34";
        context.lineWidth = beat.accent ? 1.2 : 0.7;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(PANEL_WIDTH, y);
        context.stroke();
    }

    for (const note of document.notes) {
        const noteStart = tickToMilliseconds(
            note.tick,
            document.timingPoints,
            document.ticksPerQuarter
        );
        const noteEnd = tickToMilliseconds(
            note.tick + note.durationTicks,
            document.timingPoints,
            document.ticksPerQuarter
        );
        if (noteEnd < startMs || noteStart > endMs) continue;
        drawSheetNote(context, {
            note,
            laneWidth,
            yForTime,
            document,
        });
    }
    context.restore();

    context.fillStyle = "#111117";
    context.fillRect(0, 0, PANEL_WIDTH, PADDING_TOP);
    context.fillRect(
        0,
        PANEL_HEIGHT - PADDING_BOTTOM,
        PANEL_WIDTH,
        PADDING_BOTTOM
    );
    context.fillStyle = "#8e8e9a";
    context.font = "10px ui-monospace, monospace";
    context.textBaseline = "middle";
    context.fillText(formatEditorTime(endMs), 6, PADDING_TOP / 2);
    context.fillText(
        formatEditorTime(startMs),
        6,
        PANEL_HEIGHT - PADDING_BOTTOM / 2
    );
}

function drawSheetNote(
    context: CanvasRenderingContext2D,
    {
        note,
        laneWidth,
        yForTime,
        document,
    }: {
        note: ChartNote;
        laneWidth: number;
        yForTime: (timeMs: number) => number;
        document: ChartDocument;
    }
) {
    const yForTick = (tick: number) =>
        yForTime(
            tickToMilliseconds(
                tick,
                document.timingPoints,
                document.ticksPerQuarter
            )
        );
    const color = handColors[note.hand];
    const headHeight = 5;
    const drawHead = (
        lane: number,
        width: number,
        tick: number,
        hand: ChartHand = note.hand
    ) => {
        context.fillStyle = handColors[hand];
        context.fillRect(
            lane * laneWidth + 1,
            yForTick(tick) - headHeight / 2,
            width * laneWidth - 2,
            headHeight
        );
    };

    if (note.type === "standard") {
        drawHead(note.lane, note.width, note.tick);
        return;
    }

    if (note.type === "trill") {
        const pairLane = note.pairLane ?? note.lane;
        const pairWidth = note.pairWidth ?? note.width;
        const startY = yForTick(note.tick);
        const endY = yForTick(note.tick + note.durationTicks);
        context.globalAlpha = 0.38;
        context.fillStyle = color;
        context.fillRect(
            note.lane * laneWidth + 1,
            Math.min(startY, endY),
            note.width * laneWidth - 2,
            Math.abs(endY - startY)
        );
        context.fillRect(
            pairLane * laneWidth + 1,
            Math.min(startY, endY),
            pairWidth * laneWidth - 2,
            Math.abs(endY - startY)
        );
        context.globalAlpha = 1;
        const steps = Math.min(
            64,
            Math.max(2, Math.floor(note.durationTicks / 120))
        );
        for (let index = 0; index <= steps; index += 1) {
            const lane = index % 2 === 0 ? note.lane : pairLane;
            const width = index % 2 === 0 ? note.width : pairWidth;
            drawHead(
                lane,
                width,
                note.tick + Math.round((note.durationTicks * index) / steps)
            );
        }
        return;
    }

    const points = [
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
        points.push({ ...(points.at(-1) ?? points[0]), tick: endTick });
    }

    context.globalAlpha = 0.45;
    context.fillStyle = color;
    context.beginPath();
    points.forEach((point, index) => {
        const x = point.lane * laneWidth + 1;
        const y = yForTick(point.tick);
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
    });
    [...points].reverse().forEach((point) => {
        context.lineTo(
            (point.lane + point.width) * laneWidth - 1,
            yForTick(point.tick)
        );
    });
    context.closePath();
    context.fill();
    context.globalAlpha = 1;
    for (const point of points) {
        drawHead(point.lane, point.width, point.tick, point.hand);
    }
}
