"use client";

import {
    getChartNoteRenderPoints,
    getGlissandoSnapRenderPoints,
} from "@/lib/chart-pattern/editor";
import {
    HAND_COLORS,
    SHEET_COLORS,
    STAGE_CANVAS,
} from "@/lib/chart-pattern/stageColors";
import {
    trillHexes,
    trillSolidSpan,
    trillUnion,
} from "@/lib/chart-pattern/trillShape";
import {
    CHART_LANE_COUNT,
    isChartLaneGroupBoundary,
    type ChartDocument,
    type ChartHand,
    type ChartNote,
} from "@/lib/chart-pattern/schema";
import {
    formatBpm,
    formatEditorTime,
    getBeatMarkers,
    tickToMilliseconds,
    type MeasureMarker,
} from "@/lib/chart-pattern/timing";

const CHART_WIDTH = 220;
const MEASURE_GUTTER_WIDTH = 56;
export const PANEL_WIDTH = CHART_WIDTH + MEASURE_GUTTER_WIDTH;
export const PANEL_HEIGHT = 720;
export type SheetPanel = { index: number; startMs: number; endMs: number };
export const PADDING_TOP = 30;
export const PADDING_BOTTOM = 34;
const PANEL_NOTE_EDGE_INSET = 4;
export const PANEL_MEASURE_EDGE_INSET = 5;
const PANEL_BOUNDARY_EPSILON_MS = 0.001;

// 손 색 = 토큰 `--nl-hand-*` 와 같은 값(2026-09-26 H1 — 범례 · 전체 악보 · 낙하형 한 벌)
const handColors: Record<ChartHand, string> = HAND_COLORS;

export function drawPanel(
    context: CanvasRenderingContext2D,
    {
        startMs,
        endMs,
        document,
        measureMarkers,
        startDetails = true,
    }: {
        startMs: number;
        endMs: number;
        document: ChartDocument;
        measureMarkers: MeasureMarker[];
        /**
         * 열 맨 아래(시작) 마디선의 BPM · 박자 글자 — 전체 악보 띠는 열 아래 여백을 잘라 이어 붙여 글자가 반만 보인다.
         * 띠는 이 글자를 아래 열 이음새 라벨(시각 위)로 따로 쓰므로 그리지 않는다(2026-09-25)
         */
        startDetails?: boolean;
    }
) {
    const chartHeight = PANEL_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
    const laneWidth = CHART_WIDTH / CHART_LANE_COUNT;
    const panelDuration = Math.max(1, endMs - startMs);
    const chartBottom = PANEL_HEIGHT - PADDING_BOTTOM;
    const yForTime = (timeMs: number) =>
        chartBottom - ((timeMs - startMs) / panelDuration) * chartHeight;
    const yForMeasureTime = (timeMs: number) =>
        Math.min(chartBottom - PANEL_MEASURE_EDGE_INSET, yForTime(timeMs));

    context.clearRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
    context.fillStyle = STAGE_CANVAS;
    context.fillRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);

    context.save();
    context.beginPath();
    context.rect(0, PADDING_TOP, PANEL_WIDTH, chartHeight);
    context.clip();

    for (let lane = 0; lane <= CHART_LANE_COUNT; lane += 1) {
        const x = MEASURE_GUTTER_WIDTH + lane * laneWidth + 0.5;
        const isGroupBoundary = isChartLaneGroupBoundary(lane);
        context.strokeStyle = isGroupBoundary
            ? SHEET_COLORS.laneGroupLine
            : SHEET_COLORS.laneLine;
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
        if (beat.timeMs >= endMs - PANEL_BOUNDARY_EPSILON_MS) continue;
        const y =
            (beat.accent
                ? yForMeasureTime(beat.timeMs)
                : yForTime(beat.timeMs)) + 0.5;
        context.strokeStyle = beat.accent
            ? SHEET_COLORS.beatAccentLine
            : SHEET_COLORS.beatLine;
        context.lineWidth = beat.accent ? 1.2 : 0.7;
        context.beginPath();
        context.moveTo(beat.accent ? 3 : MEASURE_GUTTER_WIDTH, y);
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
        const hasDuration = noteEnd > noteStart + PANEL_BOUNDARY_EPSILON_MS;
        const overlapsPanel = hasDuration
            ? noteEnd > startMs + PANEL_BOUNDARY_EPSILON_MS &&
              noteStart < endMs - PANEL_BOUNDARY_EPSILON_MS
            : noteStart >= startMs - PANEL_BOUNDARY_EPSILON_MS &&
              noteStart < endMs - PANEL_BOUNDARY_EPSILON_MS;
        if (!overlapsPanel) continue;
        drawSheetNote(context, {
            note,
            laneWidth,
            chartLeft: MEASURE_GUTTER_WIDTH,
            yForTime,
            chartTop: PADDING_TOP,
            chartBottom,
            document,
        });
    }
    context.restore();

    context.fillStyle = SHEET_COLORS.columnBackground;
    context.fillRect(0, 0, PANEL_WIDTH, PADDING_TOP);
    context.fillRect(
        0,
        PANEL_HEIGHT - PADDING_BOTTOM,
        PANEL_WIDTH,
        PADDING_BOTTOM
    );
    context.fillStyle = SHEET_COLORS.measureDetail;
    context.font = "10px ui-monospace, monospace";
    context.textBaseline = "middle";
    context.fillText(
        formatEditorTime(endMs),
        MEASURE_GUTTER_WIDTH + 6,
        PADDING_TOP / 2
    );
    drawMeasureAnnotations(context, {
        markers: measureMarkers,
        startMs,
        endMs,
        yForMeasureTime,
        startDetails,
    });
}

function drawMeasureAnnotations(
    context: CanvasRenderingContext2D,
    {
        markers,
        startMs,
        endMs,
        yForMeasureTime,
        startDetails,
    }: {
        markers: MeasureMarker[];
        startMs: number;
        endMs: number;
        yForMeasureTime: (timeMs: number) => number;
        startDetails: boolean;
    }
) {
    const visibleMarkers = markers.filter(
        (marker) =>
            marker.timeMs >= startMs - PANEL_BOUNDARY_EPSILON_MS &&
            marker.timeMs < endMs - PANEL_BOUNDARY_EPSILON_MS
    );

    context.save();
    context.textAlign = "left";
    for (const marker of visibleMarkers) {
        const y = yForMeasureTime(marker.timeMs) + 0.5;
        context.fillStyle = SHEET_COLORS.measureNumber;
        context.font = "600 8px ui-monospace, monospace";
        context.textBaseline = "bottom";
        context.fillText(String(marker.measureNumber), 4, y - 2);

        if (
            !startDetails &&
            Math.abs(marker.timeMs - startMs) <= PANEL_BOUNDARY_EPSILON_MS
        )
            continue;
        let detailY = y + 2;
        context.fillStyle = SHEET_COLORS.measureDetail;
        context.font = "9px ui-monospace, monospace";
        context.textBaseline = "top";
        if (marker.showBpm) {
            context.fillText(`BPM ${formatBpm(marker.bpm)}`, 4, detailY);
            detailY += 10;
        }
        if (marker.showTimeSignature) {
            context.fillText(
                `${marker.numerator}/${marker.denominator}`,
                4,
                detailY
            );
        }
    }
    context.restore();
}

function drawSheetNote(
    context: CanvasRenderingContext2D,
    {
        note,
        laneWidth,
        chartLeft,
        yForTime,
        chartTop,
        chartBottom,
        document,
    }: {
        note: ChartNote;
        laneWidth: number;
        chartLeft: number;
        yForTime: (timeMs: number) => number;
        chartTop: number;
        chartBottom: number;
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
    const yForRenderedTick = (tick: number) => {
        const rawY = yForTick(tick);
        return rawY >= chartTop - PANEL_BOUNDARY_EPSILON_MS &&
            rawY <= chartBottom + PANEL_BOUNDARY_EPSILON_MS
            ? Math.min(
                  chartBottom - PANEL_NOTE_EDGE_INSET,
                  Math.max(chartTop + PANEL_NOTE_EDGE_INSET, rawY)
              )
            : rawY;
    };
    const drawHead = (
        lane: number,
        width: number,
        tick: number,
        hand: ChartHand = note.hand,
        small = false
    ) =>
        drawSheetCap(
            context,
            chartLeft + lane * laneWidth,
            yForRenderedTick(tick),
            width * laneWidth,
            handColors[hand],
            small
        );

    if (note.type === "standard") {
        drawHead(note.lane, note.width, note.tick);
        return;
    }

    if (note.type === "trill") {
        // 게임처럼(2026-09-24 B′): 두 자리를 합친 범위 전체에 촘촘한 육각형, 칠 자리 쪽만 진하고 반대편은 옅어짐
        const union = trillUnion(note);
        const x1 = chartLeft + union.lane * laneWidth + 1;
        const x2 = chartLeft + (union.lane + union.width) * laneWidth - 1;
        const hexes = trillHexes(note, document.ticksPerQuarter);
        for (let index = hexes.length - 1; index >= 0; index -= 1) {
            const hex = hexes[index];
            const yBottom = yForRenderedTick(hex.startTick) - 0.5;
            const yTop = yForRenderedTick(hex.endTick) + 0.5;
            // 긴 트릴은 여러 패널에 걸쳐 그려진다 — 이 패널 밖 조각은 보이지 않으니 그레이디언트를 만들지 않는다
            if (yBottom < chartTop || yTop > chartBottom) continue;
            const middle = (yBottom + yTop) / 2;
            // 악보는 세로가 촘촘해 육각형이 낮다 — 모서리를 높이에 맞춰 화살표처럼 보이지 않게
            const bevel = Math.min(
                6,
                (x2 - x1) * 0.12,
                (yBottom - yTop) * 0.35
            );
            const span = trillSolidSpan(hex, union);
            const gradient = context.createLinearGradient(x1, 0, x2, 0);
            const solid = colorWithAlpha(handColors[note.hand], 0.82);
            const clear = colorWithAlpha(handColors[note.hand], 0.04);
            gradient.addColorStop(0, span.fadeLeft ? clear : solid);
            gradient.addColorStop(span.from, solid);
            gradient.addColorStop(span.to, solid);
            gradient.addColorStop(1, span.fadeRight ? clear : solid);
            context.save();
            context.fillStyle = gradient;
            context.beginPath();
            context.moveTo(x1 + bevel, yBottom);
            context.lineTo(x2 - bevel, yBottom);
            context.lineTo(x2, middle);
            context.lineTo(x2 - bevel, yTop);
            context.lineTo(x1 + bevel, yTop);
            context.lineTo(x1, middle);
            context.closePath();
            context.fill();
            context.restore();
        }
        // 끝 막대(어두운 막대, 게임과 같은 자리)
        const endY = yForRenderedTick(note.tick + note.durationTicks);
        context.save();
        context.fillStyle = STAGE_CANVAS;
        context.strokeStyle = handColors[note.hand];
        context.lineWidth = 1.2;
        context.beginPath();
        context.roundRect(x1 + 1, endY - 2.5, x2 - x1 - 2, 5, 2.5);
        context.fill();
        context.stroke();
        context.restore();
        drawHead(union.lane, union.width, note.tick);
        const centerX = chartLeft + (union.lane + union.width / 2) * laneWidth;
        drawSheetDiamond(
            context,
            centerX - 2.5,
            yForRenderedTick(note.tick) + 1,
            3.3,
            SHEET_COLORS.trillDiamond
        );
        drawSheetDiamond(
            context,
            centerX + 2.5,
            yForRenderedTick(note.tick) - 3,
            2.4,
            SHEET_COLORS.trillDiamond
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
        context.moveTo(
            chartLeft + first.lane * laneWidth + 1,
            yForRenderedTick(first.tick)
        );
        context.lineTo(
            chartLeft + (first.lane + first.width) * laneWidth - 1,
            yForRenderedTick(first.tick)
        );
        context.lineTo(
            chartLeft + (second.lane + second.width) * laneWidth - 1,
            yForRenderedTick(second.tick)
        );
        context.lineTo(
            chartLeft + second.lane * laneWidth + 1,
            yForRenderedTick(second.tick)
        );
        context.closePath();
        context.fill();
        context.stroke();
        context.globalAlpha = 0.72;
        context.strokeStyle = SHEET_COLORS.noteOutline;
        context.lineWidth = 0.9;
        context.beginPath();
        context.moveTo(
            chartLeft + (first.lane + first.width / 2) * laneWidth,
            yForRenderedTick(first.tick)
        );
        context.lineTo(
            chartLeft + (second.lane + second.width / 2) * laneWidth,
            yForRenderedTick(second.tick)
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
    const height = small ? 3 : 4;
    const bevel = Math.min(3.5, Math.max(1, width * 0.08));
    const left = x + 1.5;
    const right = x + width - 1.5;
    const top = centerY - height / 2;
    const bottom = centerY + height / 2;

    context.save();
    context.shadowColor = handColor;
    context.shadowBlur = 2;
    context.fillStyle = SHEET_COLORS.noteFace;
    context.strokeStyle = handColor;
    context.lineWidth = 0.7;
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
    context.lineWidth = 0.6;
    context.beginPath();
    context.moveTo(left + bevel + 1, centerY + 1);
    context.lineTo(right - bevel - 1, centerY + 1);
    context.stroke();
    context.restore();
}

/** "#rrggbb" → 같은 색의 rgba — 그라데이션이 투명 쪽에서 검게 번지지 않게 */
function colorWithAlpha(hex: string, alpha: number) {
    const value = Number.parseInt(hex.slice(1), 16);
    return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
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
    context.strokeStyle = SHEET_COLORS.noteHighlight;
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
