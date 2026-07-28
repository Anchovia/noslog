"use client";

import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
} from "react";

import {
    getBrowserSupportSnapshot,
    getServerBrowserSupportSnapshot,
    subscribeBrowserSupport,
} from "@/lib/browserSupport";
import {
    getChartNoteRenderPoints,
    getGlissandoSnapRenderPoints,
} from "@/lib/chart-pattern/editor";
import {
    CHART_LANE_COUNT,
    isChartLaneGroupBoundary,
    type ChartDocument,
    type ChartHand,
    type ChartNote,
} from "@/lib/chart-pattern/schema";
import {
    formatEditorTime,
    getBeatMarkers,
    tickToMilliseconds,
} from "@/lib/chart-pattern/timing";

import FallingChartViewer from "./fallingChartViewer";

interface ChartSheetViewerProps {
    title: string;
    artist: string | null;
    difficulty: string;
    level: number;
    revision: number | null;
    document: ChartDocument;
    backHref: string;
    jacketUrl: string | null;
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
    jacketUrl,
    preview = false,
}: ChartSheetViewerProps) {
    const [viewMode, setViewMode] = useState<"falling" | "sheet">("falling");
    const browserSupport = useSyncExternalStore(
        subscribeBrowserSupport,
        getBrowserSupportSnapshot,
        getServerBrowserSupportSnapshot
    );
    const effectiveViewMode =
        browserSupport === "supported" ? viewMode : "sheet";
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
                <div
                    role="tablist"
                    aria-label="채보 보기 방식"
                    className="border-border bg-surface inline-flex rounded-md border p-1"
                >
                    <button
                        type="button"
                        role="tab"
                        aria-selected={effectiveViewMode === "falling"}
                        disabled={browserSupport !== "supported"}
                        onClick={() => setViewMode("falling")}
                        className={`h-8 rounded px-3 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${
                            effectiveViewMode === "falling"
                                ? "bg-text-primary text-bg"
                                : "text-text-secondary hover:bg-surface-muted"
                        }`}
                    >
                        낙하형
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={effectiveViewMode === "sheet"}
                        onClick={() => setViewMode("sheet")}
                        className={`h-8 rounded px-3 text-xs font-semibold ${
                            effectiveViewMode === "sheet"
                                ? "bg-text-primary text-bg"
                                : "text-text-secondary hover:bg-surface-muted"
                        }`}
                    >
                        전체 악보
                    </button>
                </div>

                <div className="border-border bg-surface text-caption flex items-start gap-2 rounded-md border px-3 py-2.5">
                    <Info className="mt-0.5 size-3.5 shrink-0" />
                    {browserSupport === "safari" ? (
                        <p>
                            Safari에서는 낙하형 뷰어를 지원하지 않아 전체 악보로
                            표시합니다. 낙하형은 Chrome 또는 Edge에서
                            확인해주세요.
                        </p>
                    ) : effectiveViewMode === "falling" ? (
                        <p>
                            노트가 판정선에 도착하는 흐름을 재생합니다. 로컬
                            음원을 불러오면 브라우저에서만 사용되며 서버에는
                            전송되지 않습니다.
                        </p>
                    ) : (
                        <p>
                            각 열은 아래에서 위로 진행합니다. 화면을 가로로
                            스크롤하면 곡 전체 채보를 순서대로 확인할 수
                            있습니다.
                        </p>
                    )}
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
            ) : browserSupport === "checking" ? (
                <div className="border-border bg-surface mx-auto mt-4 min-h-64 w-full max-w-7xl rounded-md border" />
            ) : effectiveViewMode === "falling" ? (
                <section className="mx-auto mt-4 w-full max-w-5xl">
                    <FallingChartViewer
                        document={document}
                        jacketUrl={jacketUrl}
                    />
                </section>
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
        const isGroupBoundary = isChartLaneGroupBoundary(lane);
        context.strokeStyle = isGroupBoundary ? "#343441" : "#20202a";
        context.lineWidth = isGroupBoundary ? 1 : 0.5;
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
    const drawHead = (
        lane: number,
        width: number,
        tick: number,
        hand: ChartHand = note.hand,
        small = false
    ) =>
        drawSheetCap(
            context,
            lane * laneWidth,
            yForTick(tick),
            width * laneWidth,
            handColors[hand],
            small
        );

    if (note.type === "standard") {
        drawHead(note.lane, note.width, note.tick);
        return;
    }

    if (note.type === "trill") {
        const pairLane = note.pairLane ?? note.lane;
        const pairWidth = note.pairWidth ?? note.width;
        const stepTicks = Math.max(
            1,
            Math.round(
                (document.ticksPerQuarter * 4) / (note.trillSnapDivisor ?? 8)
            )
        );
        const steps = Math.max(1, Math.ceil(note.durationTicks / stepTicks));
        for (let index = 0; index < steps; index += 1) {
            const startTick = note.tick + index * stepTicks;
            const endTick = Math.min(
                note.tick + note.durationTicks,
                startTick + stepTicks
            );
            const fromLane = index % 2 === 0 ? note.lane : pairLane;
            const fromWidth = index % 2 === 0 ? note.width : pairWidth;
            const toLane = index % 2 === 0 ? pairLane : note.lane;
            const toWidth = index % 2 === 0 ? pairWidth : note.width;
            context.save();
            context.globalAlpha = 0.78;
            context.fillStyle = handColors[note.hand];
            context.strokeStyle = "rgba(255,255,255,.42)";
            context.lineWidth = 0.7;
            context.beginPath();
            context.moveTo(fromLane * laneWidth + 1, yForTick(startTick) - 1);
            context.lineTo(
                (fromLane + fromWidth) * laneWidth - 1,
                yForTick(startTick) - 1
            );
            context.lineTo(
                (toLane + toWidth) * laneWidth - 1,
                yForTick(endTick) + 1
            );
            context.lineTo(toLane * laneWidth + 1, yForTick(endTick) + 1);
            context.closePath();
            context.fill();
            context.stroke();
            context.restore();
        }
        drawHead(note.lane, note.width, note.tick);
        const centerX = (note.lane + note.width / 2) * laneWidth;
        drawSheetDiamond(
            context,
            centerX,
            yForTick(note.tick) - 1,
            3.3,
            "#f2c75c"
        );
        drawSheetDiamond(
            context,
            centerX + 5,
            yForTick(note.tick) - 5,
            2.4,
            "#f2c75c"
        );
        return;
    }

    const points = getChartNoteRenderPoints(note);
    for (let index = 0; index < points.length - 1; index += 1) {
        const first = points[index];
        const second = points[index + 1];
        context.save();
        context.globalAlpha = 0.58;
        context.fillStyle = handColors[first.hand];
        context.strokeStyle = handColors[second.hand];
        context.lineWidth = 0.8;
        context.beginPath();
        context.moveTo(first.lane * laneWidth + 1, yForTick(first.tick));
        context.lineTo(
            (first.lane + first.width) * laneWidth - 1,
            yForTick(first.tick)
        );
        context.lineTo(
            (second.lane + second.width) * laneWidth - 1,
            yForTick(second.tick)
        );
        context.lineTo(second.lane * laneWidth + 1, yForTick(second.tick));
        context.closePath();
        context.fill();
        context.stroke();
        context.globalAlpha = 0.72;
        context.strokeStyle = "#f7f7f2";
        context.lineWidth = 0.9;
        context.beginPath();
        context.moveTo(
            (first.lane + first.width / 2) * laneWidth,
            yForTick(first.tick)
        );
        context.lineTo(
            (second.lane + second.width / 2) * laneWidth,
            yForTick(second.tick)
        );
        context.stroke();
        context.restore();
    }
    const capPoints =
        note.type === "glissando"
            ? getGlissandoSnapRenderPoints(note, document.ticksPerQuarter)
            : points;
    for (const point of capPoints) {
        drawHead(
            point.lane,
            point.width,
            point.tick,
            point.hand,
            point.tick !== note.tick &&
                point.tick !== note.tick + note.durationTicks
        );
    }
}

function drawSheetCap(
    context: CanvasRenderingContext2D,
    x: number,
    centerY: number,
    width: number,
    handColor: string,
    small = false
) {
    const height = small ? 4 : 6;
    const bevel = Math.min(3.5, Math.max(1, width * 0.08));
    const left = x + 1.5;
    const right = x + width - 1.5;
    const top = centerY - height / 2;
    const bottom = centerY + height / 2;

    context.save();
    context.shadowColor = handColor;
    context.shadowBlur = 4;
    context.fillStyle = "rgba(247,247,242,.96)";
    context.strokeStyle = handColor;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(left + bevel, top);
    context.lineTo(right - bevel, top);
    context.lineTo(right, centerY);
    context.lineTo(right - bevel, bottom);
    context.lineTo(left + bevel, bottom);
    context.lineTo(left, centerY);
    context.closePath();
    context.fill();
    context.stroke();
    context.shadowBlur = 0;
    context.globalAlpha = 0.32;
    context.strokeStyle = handColor;
    context.beginPath();
    context.moveTo(left + bevel + 1, centerY + 1);
    context.lineTo(right - bevel - 1, centerY + 1);
    context.stroke();
    context.restore();
}

function drawSheetDiamond(
    context: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    size: number,
    color: string
) {
    context.save();
    context.fillStyle = color;
    context.strokeStyle = "#fff8df";
    context.lineWidth = 0.8;
    context.beginPath();
    context.moveTo(centerX, centerY - size);
    context.lineTo(centerX + size, centerY);
    context.lineTo(centerX, centerY + size);
    context.lineTo(centerX - size, centerY);
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
}
