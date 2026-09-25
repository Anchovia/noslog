"use client";

import * as Popover from "@radix-ui/react-popover";
import {
    Maximize,
    Minimize,
    Pause,
    Play,
    RotateCcw,
    Settings,
    Upload,
    Volume2,
} from "lucide-react";
import {
    type ChangeEvent,
    useCallback,
    useEffect,
    useEffectEvent,
    useMemo,
    useRef,
    useState,
} from "react";
import type { Application, Graphics } from "pixi.js";

import { useTranslations } from "@/components/i18n/localeProvider";
import { Checkbox } from "@/components/ui/checkbox";
import CompactSelect from "@/components/ui/compactSelect";
import { getMetronomePeakGain } from "@/lib/chart-pattern/metronome";
import { chartPianoColors } from "@/lib/chart-pattern/piano";
import {
    getActivePlaybackPianoRanges,
    getApproachDurationMs,
    getChartPlaybackDurationMs,
    getPlaybackVisualScale,
    getPlaybackRibbonVisibleEndMs,
    prepareChartPlaybackNotes,
    projectPlaybackLane,
    projectPlaybackRange,
    type PlaybackPathPoint,
    type PlaybackTrillSegment,
    type PreparedPlaybackNote,
} from "@/lib/chart-pattern/playback";
import {
    CHART_LANE_COUNT,
    CHART_LANE_GROUP_BOUNDARIES,
    type ChartDocument,
    type ChartHand,
} from "@/lib/chart-pattern/schema";
import { formatEditorTime, getBeatMarkers } from "@/lib/chart-pattern/timing";

import { useFullscreen } from "./useFullscreen";
import { useMetronomeVolume } from "./useMetronomeVolume";
import { useStrictPerformance } from "./useStrictPerformance";
interface FallingChartViewerProps {
    document: ChartDocument;
    jacketUrl: string | null;
    /** 밖에서 재생 위치 옮기기(채보 의견 시각 · 주소 `?t=`) — key 가 바뀔 때마다, 처음 그릴 때도 한 번 */
    seekRequest?: { timeMs: number; key: number } | null;
    /** 진행 막대 눈금(채보 의견 시각, 2026-09-24 D1) */
    markers?: readonly number[];
    onTimeChange?: (timeMs: number) => void;
}

interface PlaybackClockAnchor {
    startedAt: number;
    offsetMs: number;
}

interface ProjectedRange {
    left: number;
    right: number;
    center: number;
    y: number;
    depth: number;
}

const colors = {
    left: 0x4fc8dc,
    right: 0xe85f5d,
    noteFace: 0xf8f7f1,
    judgment: 0xf2f0e9,
    judgmentEdge: 0x8f929d,
    guideStrong: 0x727786,
};

function colorForHand(hand: ChartHand) {
    return hand === "left" ? colors.left : colors.right;
}

function interpolate(start: number, end: number, progress: number) {
    return start + (end - start) * progress;
}

function interpolatePathPoint(
    first: PlaybackPathPoint,
    second: PlaybackPathPoint,
    timeMs: number
): PlaybackPathPoint {
    const progress =
        second.timeMs === first.timeMs
            ? 0
            : Math.min(
                  1,
                  Math.max(
                      0,
                      (timeMs - first.timeMs) / (second.timeMs - first.timeMs)
                  )
              );
    return {
        lane: interpolate(first.lane, second.lane, progress),
        width: interpolate(first.width, second.width, progress),
        timeMs,
        hand: progress < 0.5 ? first.hand : second.hand,
    };
}

function clipPathSegment(
    first: PlaybackPathPoint,
    second: PlaybackPathPoint,
    startTimeMs: number,
    endTimeMs: number
) {
    const clippedStart = Math.max(first.timeMs, startTimeMs);
    const clippedEnd = Math.min(second.timeMs, endTimeMs);
    if (clippedStart > clippedEnd) return null;
    return {
        first: interpolatePathPoint(first, second, clippedStart),
        second: interpolatePathPoint(first, second, clippedEnd),
    };
}

function trillPointAt(
    segment: PlaybackTrillSegment,
    timeMs: number,
    hand: ChartHand
): PlaybackPathPoint {
    const progress =
        segment.endTimeMs === segment.startTimeMs
            ? 0
            : Math.min(
                  1,
                  Math.max(
                      0,
                      (timeMs - segment.startTimeMs) /
                          (segment.endTimeMs - segment.startTimeMs)
                  )
              );
    return {
        lane: interpolate(segment.fromLane, segment.toLane, progress),
        width: interpolate(segment.fromWidth, segment.toWidth, progress),
        timeMs,
        hand,
    };
}

function capPolygon(
    left: number,
    right: number,
    centerY: number,
    height: number,
    visualScale: number
) {
    const width = Math.max(2, right - left);
    const bevel = Math.min(
        8 * visualScale,
        Math.max(2 * visualScale, width * 0.08)
    );
    return [
        left + bevel,
        centerY - height / 2,
        right - bevel,
        centerY - height / 2,
        right,
        centerY,
        right - bevel,
        centerY + height / 2,
        left + bevel,
        centerY + height / 2,
        left,
        centerY,
    ];
}

function drawPlaybackCap(
    graphics: Graphics,
    projected: ProjectedRange,
    hand: ChartHand,
    alpha: number,
    visualScale: number,
    small = false
) {
    const height =
        ((small ? 6 : 10) + projected.depth * (small ? 3 : 5)) * visualScale;
    const handColor = colorForHand(hand);
    graphics
        .poly(
            capPolygon(
                projected.left - 2 * visualScale,
                projected.right + 2 * visualScale,
                projected.y,
                height + 5 * visualScale,
                visualScale
            ),
            true
        )
        .fill({ color: handColor, alpha: alpha * 0.2 });
    graphics
        .poly(
            capPolygon(
                projected.left,
                projected.right,
                projected.y,
                height,
                visualScale
            ),
            true
        )
        .fill({ color: colors.noteFace, alpha })
        .stroke({ color: handColor, width: 1.5 * visualScale, alpha });
    graphics
        .moveTo(projected.left + 5 * visualScale, projected.y + visualScale)
        .lineTo(projected.right - 5 * visualScale, projected.y + visualScale)
        .stroke({
            color: handColor,
            width: visualScale,
            alpha: alpha * 0.45,
        });
}

function drawHitGlow(
    graphics: Graphics,
    projected: ProjectedRange,
    hand: ChartHand,
    distanceMs: number,
    visualScale: number
) {
    if (Math.abs(distanceMs) > 95) return;
    const strength = 1 - Math.abs(distanceMs) / 95;
    const noteWidth = projected.right - projected.left;
    const glowWidth = Math.min(
        48 * visualScale,
        Math.max(12 * visualScale, noteWidth * 0.45)
    );
    graphics
        .ellipse(
            projected.center,
            projected.y,
            glowWidth * (1 + strength * 0.15),
            (8 + strength * 10) * visualScale
        )
        .fill({
            color: colorForHand(hand),
            alpha: 0.1 + strength * 0.18,
        });
    graphics
        .circle(projected.center, projected.y, (3 + strength * 5) * visualScale)
        .fill({ color: colors.noteFace, alpha: strength * 0.42 });
}

function drawRibbon(
    graphics: Graphics,
    points: ProjectedRange[],
    hand: ChartHand,
    visualScale: number,
    alpha = 0.62
) {
    if (points.length < 2) return;
    const leftEdge = points.flatMap((point) => {
        const inset = Math.min(
            2 * visualScale,
            (point.right - point.left) * 0.08
        );
        return [point.left + inset, point.y];
    });
    const rightEdge = [...points].reverse().flatMap((point) => {
        const inset = Math.min(
            2 * visualScale,
            (point.right - point.left) * 0.08
        );
        return [point.right - inset, point.y];
    });
    const handColor = colorForHand(hand);
    graphics
        .poly([...leftEdge, ...rightEdge], true)
        .fill({ color: handColor, alpha })
        .stroke({
            color: handColor,
            width: visualScale,
            alpha: alpha * 0.9,
        });
    graphics.moveTo(points[0].center, points[0].y);
    for (let index = 1; index < points.length; index += 1) {
        graphics.lineTo(points[index].center, points[index].y);
    }
    graphics.stroke({
        color: colors.noteFace,
        width: 1.1 * visualScale,
        alpha: alpha * 0.72,
    });
}

function sampleProjectedSegment(
    first: PlaybackPathPoint,
    second: PlaybackPathPoint,
    project: (point: PlaybackPathPoint) => ProjectedRange
) {
    const durationMs = Math.abs(second.timeMs - first.timeMs);
    const steps = Math.min(32, Math.max(6, Math.ceil(durationMs / 90)));
    return Array.from({ length: steps + 1 }, (_, index) => {
        const progress = index / steps;
        return project(
            interpolatePathPoint(
                first,
                second,
                interpolate(first.timeMs, second.timeMs, progress)
            )
        );
    });
}

const TRILL_FADE_STRIPS = 10;
const TRILL_SOLID_ALPHA = 0.82;
const TRILL_DIAMOND = 0xf2c75c;
const TRILL_TAIL = 0x070910;

/**
 * 트릴(2026-09-24 B′, 사용자) — 두 자리를 합친 범위 전체에 촘촘한 육각형, 칠 자리 쪽만 진하고 반대편은 옅어진다.
 * 그라데이션 채우기는 텍스처를 매번 만들어 무거워, 옅어지는 부분은 투명도를 줄여 가는 띠 몇 개로 그린다
 */
function drawTrillShape(
    graphics: Graphics,
    note: PreparedPlaybackNote,
    shape: NonNullable<PreparedPlaybackNote["trillShape"]>,
    {
        currentTimeMs,
        visibleEnd,
        project,
        visualScale,
    }: {
        currentTimeMs: number;
        visibleEnd: number;
        project: (point: PlaybackPathPoint) => ProjectedRange;
        visualScale: number;
    }
) {
    const color = colorForHand(note.hand);
    const at = (timeMs: number) =>
        project({ ...shape.union, timeMs, hand: note.hand });
    for (let index = shape.hexes.length - 1; index >= 0; index -= 1) {
        const hex = shape.hexes[index];
        const start = Math.max(hex.startTimeMs, currentTimeMs);
        const end = Math.min(hex.endTimeMs, visibleEnd);
        if (start >= end) continue;
        const bottom = at(start);
        const top = at(end);
        const middle = at((start + end) / 2);
        const bevel = Math.min(
            6 * visualScale,
            (middle.right - middle.left) * 0.12
        );
        // 범위 안 위치(0~1) → 세 높이의 x. 위 · 아래는 육각형 모서리만큼 안쪽으로
        const xAt = (range: ProjectedRange, fraction: number, inset: number) =>
            Math.min(
                range.right - inset,
                Math.max(
                    range.left + inset,
                    range.left + (range.right - range.left) * fraction
                )
            );
        const band = (from: number, to: number, alpha: number) => {
            graphics
                .poly(
                    [
                        xAt(bottom, from, bevel),
                        bottom.y,
                        xAt(bottom, to, bevel),
                        bottom.y,
                        xAt(middle, to, 0),
                        middle.y,
                        xAt(top, to, bevel),
                        top.y,
                        xAt(top, from, bevel),
                        top.y,
                        xAt(middle, from, 0),
                        middle.y,
                    ],
                    true
                )
                .fill({ color, alpha });
        };
        const lane = (hex.lane - shape.union.lane) / shape.union.width;
        const span = {
            from: lane,
            to: lane + hex.width / shape.union.width,
        };
        band(span.from, span.to, TRILL_SOLID_ALPHA);
        for (let strip = 0; strip < TRILL_FADE_STRIPS; strip += 1) {
            const alpha =
                TRILL_SOLID_ALPHA * (1 - (strip + 0.5) / TRILL_FADE_STRIPS);
            if (span.from > 0) {
                const width = span.from / TRILL_FADE_STRIPS;
                band(
                    span.from - (strip + 1) * width,
                    span.from - strip * width,
                    alpha
                );
            }
            if (span.to < 1) {
                const width = (1 - span.to) / TRILL_FADE_STRIPS;
                band(
                    span.to + strip * width,
                    span.to + (strip + 1) * width,
                    alpha
                );
            }
        }
    }

    // 끝 막대 · 머리(범위 전체) · 마름모
    if (note.endTimeMs >= currentTimeMs && note.endTimeMs <= visibleEnd) {
        const tail = at(note.endTimeMs);
        const height = (4 + tail.depth * 2) * visualScale;
        graphics
            .poly(
                capPolygon(tail.left, tail.right, tail.y, height, visualScale),
                true
            )
            .fill({ color: TRILL_TAIL, alpha: 0.95 })
            .stroke({ color, width: visualScale, alpha: 0.9 });
    }
    if (
        note.startTimeMs >= currentTimeMs - 90 &&
        note.startTimeMs <= visibleEnd
    ) {
        const head = at(note.startTimeMs);
        drawHitGlow(
            graphics,
            head,
            note.hand,
            note.startTimeMs - currentTimeMs,
            visualScale
        );
        drawPlaybackCap(graphics, head, note.hand, 0.98, visualScale);
        const size = (4.5 + head.depth * 2) * visualScale;
        for (const [dx, dy, scale] of [
            [-0.8, 0.4, 1],
            [0.8, -1, 0.72],
        ] as const) {
            const cx = head.center + dx * size;
            const cy = head.y + dy * size;
            const r = size * scale;
            graphics
                .poly([cx, cy - r, cx + r, cy, cx, cy + r, cx - r, cy], true)
                .fill({ color: TRILL_DIAMOND, alpha: 0.98 });
        }
    }
}

function drawPlayfield(
    graphics: Graphics,
    width: number,
    height: number,
    horizonY: number,
    judgmentY: number
) {
    graphics.rect(0, 0, width, height).fill({
        color: 0x070910,
        alpha: 0.74,
    });
    for (const lane of CHART_LANE_GROUP_BOUNDARIES) {
        for (let step = 0; step <= 48; step += 1) {
            const point = projectPlaybackLane({
                lane,
                progress: step / 48,
                canvasWidth: width,
                horizonY,
                judgmentY,
            });
            if (step === 0) {
                graphics.moveTo(point.x, point.y);
            } else {
                graphics.lineTo(point.x, point.y);
            }
        }
        graphics.stroke({
            color: colors.guideStrong,
            width: 1,
            alpha: 0.38,
        });
    }
}

/**
 * 가로 박자선(2026-09-25 G1) — 게임처럼 박마다 같은 선이 노트와 함께 내려온다(노트 뒤).
 * 레인 0–28 끝을 같은 원근으로 잇고, 가까울수록 굵게. 색은 판정선 흰색 30%(레인 안내선과 비슷한 무게, 2026-09-25 O2)
 */
function drawBeatLines(
    graphics: Graphics,
    beatTimes: readonly number[],
    currentTimeMs: number,
    approachDurationMs: number,
    width: number,
    horizonY: number,
    judgmentY: number
) {
    for (const timeMs of beatTimes) {
        const progress = 1 - (timeMs - currentTimeMs) / approachDurationMs;
        if (progress < 0 || progress > 1) continue;
        const left = projectPlaybackLane({
            lane: 0,
            progress,
            canvasWidth: width,
            horizonY,
            judgmentY,
        });
        const right = projectPlaybackLane({
            lane: CHART_LANE_COUNT,
            progress,
            canvasWidth: width,
            horizonY,
            judgmentY,
        });
        graphics
            .moveTo(left.x, left.y)
            .lineTo(right.x, right.y)
            .stroke({
                color: colors.judgment,
                width: 2 * (0.6 + 0.8 * progress),
                alpha: 0.3,
            });
    }
}

function drawPiano(
    graphics: Graphics,
    width: number,
    height: number,
    judgmentY: number,
    currentTimeMs: number,
    notes: PreparedPlaybackNote[],
    strictPerformance: boolean
) {
    const left = width * 0.03;
    const right = width * 0.97;
    const pianoTop = judgmentY + 5;
    const pianoBottom = height;
    const laneWidth = (right - left) / CHART_LANE_COUNT;
    const activeLaneHands = new Map<number, ChartHand>();

    for (const range of getActivePlaybackPianoRanges(
        notes,
        currentTimeMs,
        strictPerformance
    )) {
        for (
            let lane = Math.floor(range.lane);
            lane < Math.ceil(range.lane + range.width);
            lane += 1
        ) {
            activeLaneHands.set(lane, range.hand);
        }
    }

    graphics
        .rect(left, pianoTop, right - left, pianoBottom - pianoTop)
        .fill({ color: 0xbfc2c4, alpha: 0.92 });
    for (let lane = 0; lane < CHART_LANE_COUNT; lane += 1) {
        const x = left + lane * laneWidth;
        const activeHand = activeLaneHands.get(lane);
        graphics
            .rect(x, pianoTop, laneWidth, pianoBottom - pianoTop)
            .fill({
                color:
                    activeHand === "left"
                        ? chartPianoColors.pressedLeft
                        : activeHand === "right"
                          ? chartPianoColors.pressedRight
                          : lane % 2 === 0
                            ? chartPianoColors.white
                            : chartPianoColors.whiteAlt,
                alpha: activeHand === undefined ? 0.96 : 0.9,
            })
            .stroke({ color: 0x565a63, width: 0.65, alpha: 0.7 });
    }

    const blackAfter = new Set([0, 1, 3, 4, 5]);
    for (let lane = 0; lane < CHART_LANE_COUNT - 1; lane += 1) {
        if (!blackAfter.has(lane % 7)) continue;
        const x = left + (lane + 1) * laneWidth;
        graphics
            .rect(
                x - laneWidth * 0.22,
                pianoTop,
                laneWidth * 0.44,
                (pianoBottom - pianoTop) * 0.56
            )
            .fill({ color: chartPianoColors.black, alpha: 0.98 });
    }
}

function drawJudgmentLine(
    graphics: Graphics,
    width: number,
    judgmentY: number
) {
    const left = width * 0.018;
    const lineWidth = width * 0.964;
    graphics
        .roundRect(left, judgmentY - 5, lineWidth, 10, 5)
        .fill({ color: 0x1c2029, alpha: 0.96 })
        .stroke({ color: colors.judgmentEdge, width: 2.5, alpha: 0.95 });
    graphics
        .moveTo(left + 7, judgmentY - 1.5)
        .lineTo(left + lineWidth - 7, judgmentY - 1.5)
        .stroke({ color: colors.judgment, width: 1.5, alpha: 0.95 });
}

function drawPreparedNote({
    graphics,
    note,
    currentTimeMs,
    approachDurationMs,
    width,
    horizonY,
    judgmentY,
    visualScale,
}: {
    graphics: Graphics;
    note: PreparedPlaybackNote;
    currentTimeMs: number;
    approachDurationMs: number;
    width: number;
    horizonY: number;
    judgmentY: number;
    visualScale: number;
}) {
    const visibleEnd =
        note.type === "standard"
            ? currentTimeMs + approachDurationMs
            : getPlaybackRibbonVisibleEndMs(currentTimeMs, approachDurationMs);
    if (note.endTimeMs < currentTimeMs - 130 || note.startTimeMs > visibleEnd) {
        return;
    }
    const project = (point: PlaybackPathPoint) =>
        projectPlaybackRange({
            lane: point.lane,
            width: point.width,
            timeMs: point.timeMs,
            currentTimeMs,
            approachDurationMs,
            canvasWidth: width,
            horizonY,
            judgmentY,
        });

    if (note.type === "standard") {
        const point = note.pathPoints[0];
        const projected = project(point);
        const alpha =
            point.timeMs >= currentTimeMs
                ? 0.98
                : Math.max(0, 1 - (currentTimeMs - point.timeMs) / 130);
        drawHitGlow(
            graphics,
            projected,
            point.hand,
            point.timeMs - currentTimeMs,
            visualScale
        );
        drawPlaybackCap(graphics, projected, point.hand, alpha, visualScale);
        return;
    }

    if (note.type === "trill" && note.trillShape) {
        drawTrillShape(graphics, note, note.trillShape, {
            currentTimeMs,
            visibleEnd,
            project,
            visualScale,
        });
        return;
    }

    if (note.type === "trill") {
        for (
            let index = note.trillSegments.length - 1;
            index >= 0;
            index -= 1
        ) {
            const segment = note.trillSegments[index];
            const startTimeMs = Math.max(segment.startTimeMs, currentTimeMs);
            const endTimeMs = Math.min(segment.endTimeMs, visibleEnd);
            if (startTimeMs > endTimeMs) continue;
            const first = trillPointAt(segment, startTimeMs, note.hand);
            const second = trillPointAt(segment, endTimeMs, note.hand);
            drawRibbon(
                graphics,
                sampleProjectedSegment(first, second, project),
                note.hand,
                visualScale,
                0.74
            );
        }
        for (const point of [...note.pathPoints].reverse()) {
            if (
                point.timeMs < currentTimeMs - 90 ||
                point.timeMs > visibleEnd
            ) {
                continue;
            }
            const projected = project(point);
            drawHitGlow(
                graphics,
                projected,
                point.hand,
                point.timeMs - currentTimeMs,
                visualScale
            );
            drawPlaybackCap(graphics, projected, point.hand, 0.98, visualScale);
        }
        return;
    }

    for (let index = note.pathPoints.length - 2; index >= 0; index -= 1) {
        const clipped = clipPathSegment(
            note.pathPoints[index],
            note.pathPoints[index + 1],
            currentTimeMs,
            visibleEnd
        );
        if (!clipped) continue;
        drawRibbon(
            graphics,
            sampleProjectedSegment(clipped.first, clipped.second, project),
            clipped.first.hand,
            visualScale,
            note.type === "glissando" ? 0.7 : 0.62
        );
    }

    const capPoints =
        note.type === "glissando"
            ? note.pathPoints
            : [note.pathPoints[0], note.pathPoints.at(-1)!];
    for (let index = capPoints.length - 1; index >= 0; index -= 1) {
        const point = capPoints[index];
        if (point.timeMs < currentTimeMs - 90 || point.timeMs > visibleEnd) {
            continue;
        }
        const projected = project(point);
        drawHitGlow(
            graphics,
            projected,
            point.hand,
            point.timeMs - currentTimeMs,
            visualScale
        );
        drawPlaybackCap(
            graphics,
            projected,
            point.hand,
            0.98,
            visualScale,
            note.type === "glissando" &&
                point.timeMs !== note.startTimeMs &&
                point.timeMs !== note.endTimeMs
        );
    }
}

/**
 * 무대는 한 가지 그림(2026-09-25 A1) — 16:9 논리 크기에 그리고 화면 폭에 맞춰 통째로 줄인다.
 * 그래서 어느 기기에서나 원근 · 노트 간격 · 두께 · 내려오는 비율이 같고 크기만 다르다.
 */
const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 720;
const NOTE_SPEED_MIN = 1;
const NOTE_SPEED_MAX = 4;
const noteSpeedOptions = Array.from({ length: 31 }, (_, index) => {
    const value = (NOTE_SPEED_MIN + index * 0.1).toFixed(1);
    return { value, label: value };
});
/** 유튜브와 같은 이동 폭 — 화살표 5초 · 폰 두 번 두드리기 10초 · 두 번으로 치는 간격 */
const KEY_SEEK_MS = 5_000;
const DOUBLE_TAP_SEEK_MS = 10_000;
const DOUBLE_TAP_WINDOW_MS = 300;
/** 재생 중 조작 줄을 숨기기까지 가만히 있는 시간 — 동영상 플레이어와 같은 문법(2026-09-26 부터 인라인도) */
const OVERLAY_IDLE_MS = 3_000;

function renderPlaybackFrame({
    graphics,
    notes,
    currentTimeMs,
    approachDurationMs,
    width,
    height,
    strictPerformance,
    beatTimes,
}: {
    graphics: Graphics;
    notes: PreparedPlaybackNote[];
    currentTimeMs: number;
    approachDurationMs: number;
    width: number;
    height: number;
    strictPerformance: boolean;
    beatTimes: readonly number[];
}) {
    const horizonY = Math.max(40, height * 0.12);
    const judgmentY = height * 0.79;
    const visualScale = getPlaybackVisualScale(width);
    graphics.clear();
    drawPlayfield(graphics, width, height, horizonY, judgmentY);
    drawBeatLines(
        graphics,
        beatTimes,
        currentTimeMs,
        approachDurationMs,
        width,
        horizonY,
        judgmentY
    );

    for (let index = notes.length - 1; index >= 0; index -= 1) {
        drawPreparedNote({
            graphics,
            note: notes[index],
            currentTimeMs,
            approachDurationMs,
            width,
            horizonY,
            judgmentY,
            visualScale,
        });
    }

    drawPiano(
        graphics,
        width,
        height,
        judgmentY,
        currentTimeMs,
        notes,
        strictPerformance
    );
    drawJudgmentLine(graphics, width, judgmentY);
}

export default function FallingChartViewer({
    document,
    jacketUrl,
    seekRequest,
    markers,
    onTimeChange,
}: FallingChartViewerProps) {
    const t = useTranslations();
    const hostRef = useRef<HTMLDivElement | null>(null);
    const screenRef = useRef<HTMLDivElement | null>(null);
    const fullscreen = useFullscreen(screenRef);
    const [overlayIdle, setOverlayIdle] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    // 설정 창을 닫으려고 무대를 누른 것은 재생 · 일시정지로 치지 않는다(동영상 플레이어처럼)
    const closedSettingsRef = useRef(false);
    // 누르기 시작(pointerdown)에 기록 — iOS Safari 의 click 에는 pointerType 이 없고, 손가락으로 바깥을 누르면
    // Radix 는 창 닫힘을 click 때로 미뤄 무대 click 이 먼저 온다(2026-09-25). 그래서 click 대신 누르기 시작을 본다
    const pressRef = useRef<{ touch: boolean; settingsOpen: boolean }>({
        touch: false,
        settingsOpen: false,
    });
    const idleTimerRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const objectUrlRef = useRef<string | null>(null);
    const isPlayingRef = useRef(false);
    const currentTimeRef = useRef(0);
    const durationRef = useRef(getChartPlaybackDurationMs(document));
    const noteSpeedRef = useRef(2);
    // 박자선 계산용 — 렌더 루프(Pixi 틱)는 문서가 바뀌어도 다시 만들지 않으므로 최신 타이밍을 ref 로 본다
    const timingRef = useRef({
        points: document.timingPoints,
        ticksPerQuarter: document.ticksPerQuarter,
    });
    useEffect(() => {
        timingRef.current = {
            points: document.timingPoints,
            ticksPerQuarter: document.ticksPerQuarter,
        };
    }, [document.ticksPerQuarter, document.timingPoints]);
    const strictPerformanceRef = useRef(false);
    const clockAnchorRef = useRef<PlaybackClockAnchor | null>(null);
    const lastUiUpdateRef = useRef(0);
    const metronomeContextRef = useRef<AudioContext | null>(null);
    const scheduledThroughMsRef = useRef(0);
    const [currentTimeMs, setCurrentTimeMs] = useState(0);
    const [audioDurationMs, setAudioDurationMs] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [noteSpeed, setNoteSpeed] = useState(2);
    const [metronomeEnabled, setMetronomeEnabled] = useState(false);
    const [metronomeVolume, setMetronomeVolume] = useMetronomeVolume();
    const [strictPerformance, setStrictPerformance] = useStrictPerformance();
    const [fileName, setFileName] = useState<string | null>(null);
    const [audioError, setAudioError] = useState<string | null>(null);
    const preparedNotes = useMemo(
        () => prepareChartPlaybackNotes(document),
        [document]
    );
    const chartDurationMs = useMemo(
        () => getChartPlaybackDurationMs(document),
        [document]
    );
    const durationMs = Math.max(chartDurationMs, audioDurationMs);

    useEffect(() => {
        durationRef.current = durationMs;
    }, [durationMs]);

    // 조작 줄(인라인 · 전체화면 같음) — 재생 중 3초 가만히 있으면 숨기고, 움직이거나 누르면 바로 다시(움직임 없이)
    const wakeOverlay = useCallback(() => {
        setOverlayIdle(false);
        if (idleTimerRef.current !== null)
            window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = window.setTimeout(
            () => setOverlayIdle(true),
            OVERLAY_IDLE_MS
        );
    }, []);
    useEffect(
        () => () => {
            if (idleTimerRef.current !== null)
                window.clearTimeout(idleTimerRef.current);
        },
        []
    );
    // 설정 창이 열려 있는 동안은 숨기지 않는다
    const overlayHidden = isPlaying && overlayIdle && !settingsOpen;
    // 마우스가 무대를 벗어나면 재생 중에는 바로 숨긴다(유튜브와 같음)
    const hideOverlay = useCallback(() => {
        if (idleTimerRef.current !== null)
            window.clearTimeout(idleTimerRef.current);
        setOverlayIdle(true);
    }, []);
    function stepNoteSpeed(delta: number) {
        setNoteSpeed((speed) =>
            Math.min(
                NOTE_SPEED_MAX,
                Math.max(NOTE_SPEED_MIN, Math.round((speed + delta) * 10) / 10)
            )
        );
    }

    const applySeekRequest = useEffectEvent((timeMs: number) => seek(timeMs));
    useEffect(() => {
        if (seekRequest) applySeekRequest(seekRequest.timeMs);
    }, [seekRequest]);

    useEffect(() => {
        onTimeChange?.(currentTimeMs);
    }, [currentTimeMs, onTimeChange]);

    useEffect(() => {
        noteSpeedRef.current = noteSpeed;
    }, [noteSpeed]);

    useEffect(() => {
        strictPerformanceRef.current = strictPerformance;
    }, [strictPerformance]);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;
        let disposed = false;
        let application: Application | null = null;
        let scene: Graphics | null = null;
        let resizeObserver: ResizeObserver | null = null;

        void (async () => {
            const pixi = await import("pixi.js");
            if (disposed) return;
            const nextApplication = new pixi.Application();
            await nextApplication.init({
                resizeTo: host,
                // 폰처럼 작게 줄여 그려도 선이 뭉개지지 않게 기기 픽셀 밀도로 그린다
                resolution: window.devicePixelRatio || 1,
                autoDensity: true,
                antialias: true,
                backgroundAlpha: 0,
                preference: "webgl",
                autoStart: true,
            });
            if (disposed) {
                nextApplication.destroy(true);
                return;
            }
            application = nextApplication;
            scene = new pixi.Graphics();
            nextApplication.stage.addChild(scene);
            host.replaceChildren(nextApplication.canvas);
            // resizeTo 는 창 크기 변화만 본다 — 창은 그대로인데 무대 상자만 바뀌는 전체화면 진입 · 나감도 따라간다
            resizeObserver = new ResizeObserver(() => nextApplication.resize());
            resizeObserver.observe(host);

            nextApplication.ticker.add(() => {
                if (!scene || !application) return;
                const now = performance.now();
                if (isPlayingRef.current) {
                    const audio = audioRef.current;
                    if (audio && fileName && !audio.paused) {
                        currentTimeRef.current = audio.currentTime * 1_000;
                    } else if (clockAnchorRef.current) {
                        currentTimeRef.current =
                            clockAnchorRef.current.offsetMs +
                            (now - clockAnchorRef.current.startedAt);
                    }
                    if (currentTimeRef.current >= durationRef.current) {
                        currentTimeRef.current = durationRef.current;
                        isPlayingRef.current = false;
                        clockAnchorRef.current = null;
                        setIsPlaying(false);
                    }
                    if (now - lastUiUpdateRef.current >= 60) {
                        lastUiUpdateRef.current = now;
                        setCurrentTimeMs(currentTimeRef.current);
                    }
                }
                // 16:9 논리 무대를 화면에 맞게 줄여 가운데에(무대 상자가 16:9 라 보통 여백 없음)
                const scale = Math.min(
                    application.screen.width / STAGE_WIDTH,
                    application.screen.height / STAGE_HEIGHT
                );
                scene.scale.set(scale);
                scene.position.set(
                    (application.screen.width - STAGE_WIDTH * scale) / 2,
                    (application.screen.height - STAGE_HEIGHT * scale) / 2
                );
                const approachDurationMs = getApproachDurationMs(
                    noteSpeedRef.current
                );
                const playhead = currentTimeRef.current;
                renderPlaybackFrame({
                    graphics: scene,
                    notes: preparedNotes,
                    currentTimeMs: playhead,
                    approachDurationMs,
                    width: STAGE_WIDTH,
                    height: STAGE_HEIGHT,
                    strictPerformance: strictPerformanceRef.current,
                    beatTimes: getBeatMarkers(
                        timingRef.current.points,
                        timingRef.current.ticksPerQuarter,
                        playhead,
                        playhead + approachDurationMs
                    ).map((beat) => beat.timeMs),
                });
            });
        })();

        return () => {
            disposed = true;
            resizeObserver?.disconnect();
            application?.destroy(true);
            host.replaceChildren();
        };
    }, [fileName, preparedNotes]);

    useEffect(
        () => () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
            }
            void metronomeContextRef.current?.close();
            metronomeContextRef.current = null;
        },
        []
    );

    useEffect(() => {
        if (!isPlaying || !metronomeEnabled) return;

        const interval = window.setInterval(() => {
            const context = metronomeContextRef.current;
            if (!context) return;

            const audio = audioRef.current;
            let playbackTimeMs = currentTimeRef.current;
            if (audio && fileName && !audio.paused) {
                playbackTimeMs = audio.currentTime * 1_000;
            } else if (clockAnchorRef.current) {
                playbackTimeMs =
                    clockAnchorRef.current.offsetMs +
                    (performance.now() - clockAnchorRef.current.startedAt);
            }

            const startMs = Math.max(
                playbackTimeMs,
                scheduledThroughMsRef.current
            );
            const endMs = playbackTimeMs + 180;
            const beats = getBeatMarkers(
                document.timingPoints,
                document.ticksPerQuarter,
                startMs,
                endMs
            );

            for (const beat of beats) {
                const peakGain = getMetronomePeakGain(
                    metronomeVolume,
                    beat.accent
                );
                if (peakGain <= 0) continue;
                const scheduledTime = Math.max(
                    context.currentTime,
                    context.currentTime + (beat.timeMs - playbackTimeMs) / 1_000
                );
                const oscillator = context.createOscillator();
                const gain = context.createGain();
                oscillator.frequency.value = beat.accent ? 1_320 : 880;
                gain.gain.setValueAtTime(0.0001, scheduledTime);
                gain.gain.exponentialRampToValueAtTime(
                    peakGain,
                    scheduledTime + 0.002
                );
                gain.gain.exponentialRampToValueAtTime(
                    0.0001,
                    scheduledTime + 0.045
                );
                oscillator.connect(gain);
                gain.connect(context.destination);
                oscillator.start(scheduledTime);
                oscillator.stop(scheduledTime + 0.05);
            }
            scheduledThroughMsRef.current = endMs + 0.001;
        }, 40);

        return () => window.clearInterval(interval);
    }, [
        document.ticksPerQuarter,
        document.timingPoints,
        fileName,
        isPlaying,
        metronomeEnabled,
        metronomeVolume,
    ]);

    function getMetronomeContext() {
        if (!metronomeContextRef.current) {
            metronomeContextRef.current = new AudioContext();
        }
        return metronomeContextRef.current;
    }

    function togglePlayback() {
        if (isPlayingRef.current) pausePlayback();
        else void startPlayback();
    }

    // 키보드(2026-09-25, 유튜브와 같게) — 스페이스 재생 · 일시정지, ← → 5초,
    // Shift + > · < 노트 속도 ±0.1(2026-09-26 — 유튜브의 속도 단축키 자리).
    // 글 입력 · 버튼 · 막대 · 셀렉트에 포커스가 있으면 그 부품의 원래 동작을 둔다(두 번 눌리지 않게)
    const handleKey = useEffectEvent((event: KeyboardEvent) => {
        if (
            event.defaultPrevented ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey
        )
            return;
        const target = event.target as HTMLElement | null;
        if (
            target?.closest(
                "input, textarea, select, button, a, [contenteditable], [role=button], [role=radio], [role=checkbox], [role=slider], [role=combobox], [role=option], [role=menuitem], [role=dialog]"
            )
        )
            return;
        if (event.key === " ") {
            event.preventDefault();
            togglePlayback();
        } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            seek(
                currentTimeRef.current +
                    (event.key === "ArrowLeft" ? -KEY_SEEK_MS : KEY_SEEK_MS)
            );
        } else if (event.key === ">" || event.key === "<") {
            event.preventDefault();
            stepNoteSpeed(event.key === ">" ? 0.1 : -0.1);
        } else return;
        wakeOverlay();
    });
    useEffect(() => {
        const listener = (event: KeyboardEvent) => handleKey(event);
        window.addEventListener("keydown", listener);
        return () => window.removeEventListener("keydown", listener);
    }, []);

    // 무대 누르기 — 마우스는 누를 때마다 재생 · 일시정지. 손가락은 두 번 두드리면 그쪽 절반으로 10초,
    // 한 번이면 두 번째를 기다렸다가(300ms) 재생 · 일시정지
    const tapRef = useRef<{ time: number; timer: number | null }>({
        time: 0,
        timer: null,
    });
    function handleStageTap(side: -1 | 1) {
        const tap = tapRef.current;
        const now = performance.now();
        if (tap.timer !== null && now - tap.time < DOUBLE_TAP_WINDOW_MS) {
            window.clearTimeout(tap.timer);
            tap.timer = null;
            // 이어서 두드리면 계속 이동한다
            tap.time = now;
            seek(currentTimeRef.current + side * DOUBLE_TAP_SEEK_MS);
            tap.timer = window.setTimeout(() => {
                tap.timer = null;
            }, DOUBLE_TAP_WINDOW_MS);
            return;
        }
        tap.time = now;
        tap.timer = window.setTimeout(() => {
            tap.timer = null;
            togglePlayback();
        }, DOUBLE_TAP_WINDOW_MS);
    }
    useEffect(
        () => () => {
            if (tapRef.current.timer !== null)
                window.clearTimeout(tapRef.current.timer);
        },
        []
    );

    function pausePlayback() {
        const audio = audioRef.current;
        if (audio && fileName) {
            audio.pause();
            currentTimeRef.current = audio.currentTime * 1_000;
        } else if (clockAnchorRef.current) {
            currentTimeRef.current =
                clockAnchorRef.current.offsetMs +
                (performance.now() - clockAnchorRef.current.startedAt);
        }
        clockAnchorRef.current = null;
        isPlayingRef.current = false;
        setIsPlaying(false);
        setCurrentTimeMs(currentTimeRef.current);
    }

    async function startPlayback() {
        if (currentTimeRef.current >= durationRef.current - 10) {
            seek(0);
        }
        if (metronomeEnabled) {
            await getMetronomeContext().resume();
        }
        scheduledThroughMsRef.current = currentTimeRef.current - 1;
        const audio = audioRef.current;
        if (audio && fileName) {
            audio.currentTime = Math.min(
                currentTimeRef.current / 1_000,
                Number.isFinite(audio.duration) ? audio.duration : Infinity
            );
            try {
                await audio.play();
            } catch {
                setAudioError(t("chart.audioError"));
                return;
            }
        } else {
            clockAnchorRef.current = {
                startedAt: performance.now(),
                offsetMs: currentTimeRef.current,
            };
        }
        isPlayingRef.current = true;
        setIsPlaying(true);
        wakeOverlay();
    }

    function seek(nextTimeMs: number) {
        const next = Math.min(durationRef.current, Math.max(0, nextTimeMs));
        currentTimeRef.current = next;
        scheduledThroughMsRef.current = next - 1;
        setCurrentTimeMs(next);
        const audio = audioRef.current;
        if (audio && fileName && Number.isFinite(audio.duration)) {
            audio.currentTime = Math.min(next / 1_000, audio.duration);
        }
        if (isPlayingRef.current && !fileName) {
            clockAnchorRef.current = {
                startedAt: performance.now(),
                offsetMs: next,
            };
        }
    }

    async function updateMetronomeEnabled(enabled: boolean) {
        if (enabled) {
            await getMetronomeContext().resume();
            scheduledThroughMsRef.current = currentTimeRef.current - 1;
        }
        setMetronomeEnabled(enabled);
    }

    function loadAudio(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        pausePlayback();
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
        }
        const url = URL.createObjectURL(file);
        objectUrlRef.current = url;
        setFileName(file.name);
        setAudioDurationMs(0);
        setAudioError(null);
        currentTimeRef.current = 0;
        setCurrentTimeMs(0);
        if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.load();
        }
    }

    // 메트로놈 음량 — 설정 창 안
    const volumeControl = (
        <label className="nl-chart-stage__option nl-chart-stage__volume">
            <Volume2 className="nl-icon nl-muted" aria-hidden />
            <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={metronomeVolume}
                onChange={(event) =>
                    setMetronomeVolume(Number(event.target.value))
                }
                aria-label={t("chart.metronomeVolume")}
                className="nl-chart-stage__seek"
            />
            <span className="nl-metric-value nl-chart-stage__percent">
                {metronomeVolume}%
            </span>
        </label>
    );

    // 재생 막대 — 조작 줄 맨 위 한 줄(유튜브처럼 폭 가득)
    const seekTrack = (
        <div className="nl-chart-stage__seek-track">
            <input
                type="range"
                min="0"
                max={Math.max(1, durationMs)}
                step="10"
                value={Math.min(currentTimeMs, durationMs)}
                onChange={(event) => seek(Number(event.target.value))}
                aria-label={t("chart.position")}
                className="nl-chart-stage__seek"
            />
            {/* 의견 시각 눈금 — 손잡이 중심이 움직이는 폭(양끝 10 안쪽)에 맞춘다. 누르는 건 의견 목록의 시각 */}
            {markers?.map((timeMs, index) => (
                <span
                    key={`${timeMs}-${index}`}
                    aria-hidden
                    className="nl-chart-stage__marker"
                    style={{
                        left: `calc(10px + (100% - 20px) * ${Math.min(
                            1,
                            Math.max(0, timeMs / Math.max(1, durationMs))
                        )})`,
                    }}
                />
            ))}
        </div>
    );
    // 떠 있는 창 · 셀렉트 목록은 전체화면이면 전체화면 요소 안에(밖에 뜨면 안 보임), 인라인이면 문서에(무대에 잘리지 않게)
    const layerContainer = fullscreen.active ? screenRef.current : undefined;

    return (
        <section className="nl-chart-stage">
            <div
                ref={screenRef}
                className="nl-chart-stage__screen"
                data-fullscreen={
                    fullscreen.active ? fullscreen.mode : undefined
                }
                data-idle={overlayHidden || undefined}
                onPointerMove={wakeOverlay}
                onPointerDown={wakeOverlay}
                onPointerLeave={(event) => {
                    if (
                        event.pointerType === "mouse" &&
                        isPlayingRef.current &&
                        !settingsOpen
                    )
                        hideOverlay();
                }}
            >
                {/* 무대를 누르면 재생 · 일시정지(2026-09-25, 동영상 플레이어처럼) — 키보드는 재생 버튼으로 */}
                <div
                    className="nl-chart-stage__canvas"
                    onPointerDownCapture={(event) => {
                        pressRef.current = {
                            touch: event.pointerType === "touch",
                            settingsOpen,
                        };
                    }}
                    onClick={(event) => {
                        const press = pressRef.current;
                        pressRef.current = {
                            touch: false,
                            settingsOpen: false,
                        };
                        if (closedSettingsRef.current || press.settingsOpen) {
                            closedSettingsRef.current = false;
                            return;
                        }
                        const native = event.nativeEvent as PointerEvent;
                        if (press.touch || native.pointerType === "touch") {
                            const rect =
                                event.currentTarget.getBoundingClientRect();
                            handleStageTap(
                                event.clientX - rect.left < rect.width / 2
                                    ? -1
                                    : 1
                            );
                            return;
                        }
                        togglePlayback();
                    }}
                >
                    {jacketUrl ? (
                        <div
                            aria-hidden
                            className="nl-chart-stage__art"
                            style={{ backgroundImage: `url("${jacketUrl}")` }}
                        />
                    ) : null}
                    <div aria-hidden className="nl-chart-stage__scrim" />
                    <div
                        ref={hostRef}
                        role="img"
                        aria-label={t("chart.fallingAria", {
                            time: formatEditorTime(currentTimeMs),
                        })}
                        className="nl-chart-stage__host"
                    />
                </div>
                {/* 조작 줄(2026-09-26 A, 유튜브 시청 페이지와 같게) — 무대 아래쪽에 겹친다. 인라인 · 전체화면 같은 줄.
                    재생 막대 한 줄 → 재생 · 처음으로 · 시각 / 길이 … 노트 속도 · 설정 · 전체화면 */}
                <div
                    className="nl-chart-stage__overlay"
                    hidden={overlayHidden}
                    onFocus={wakeOverlay}
                >
                    {seekTrack}
                    <div className="nl-chart-stage__bar">
                        <button
                            type="button"
                            className="nl-chart-stage__media-button"
                            onClick={() =>
                                isPlaying
                                    ? pausePlayback()
                                    : void startPlayback()
                            }
                            aria-label={
                                isPlaying ? t("chart.pause") : t("chart.play")
                            }
                        >
                            {isPlaying ? (
                                <Pause
                                    className="nl-icon"
                                    fill="currentColor"
                                />
                            ) : (
                                <Play className="nl-icon" fill="currentColor" />
                            )}
                        </button>
                        <button
                            type="button"
                            className="nl-chart-stage__media-button nl-chart-stage__restart"
                            onClick={() => {
                                pausePlayback();
                                seek(0);
                            }}
                            aria-label={t("chart.restart")}
                        >
                            <RotateCcw className="nl-icon" />
                        </button>
                        <span className="nl-metric-value nl-chart-stage__time">
                            {formatEditorTime(currentTimeMs)}
                            {" / "}
                            {formatEditorTime(durationMs)}
                        </span>
                        {/* 노트 속도 — 지금 값을 보여 주고 누르면 설정 창(좁은 화면은 설정 창에서만) */}
                        <button
                            type="button"
                            className="nl-chart-stage__media-button nl-chart-stage__speed nl-metric-value"
                            onClick={() => setSettingsOpen(true)}
                            aria-label={`${t("chart.noteSpeed")} ${noteSpeed.toFixed(1)}`}
                        >
                            {noteSpeed.toFixed(1)}×
                        </button>
                        {/* 설정(2026-09-25 C1) — 톱니 → 조작 줄 위 떠 있는 창 */}
                        <Popover.Root
                            open={settingsOpen}
                            onOpenChange={setSettingsOpen}
                        >
                            <Popover.Trigger asChild>
                                <button
                                    type="button"
                                    className="nl-chart-stage__media-button"
                                    aria-label={t("chart.settings")}
                                >
                                    <Settings className="nl-icon" />
                                </button>
                            </Popover.Trigger>
                            <Popover.Portal container={layerContainer}>
                                {/* 문서에 띄울 때도 공용 스타일 범위(.noslog-ui) 안에 — ⋯ 메뉴와 같은 방식 */}
                                <div className="noslog-ui">
                                    <Popover.Content
                                        side="top"
                                        align="end"
                                        sideOffset={8}
                                        collisionPadding={16}
                                        className="nl-chart-stage__settings"
                                        onPointerDownOutside={(event) => {
                                            const target = event.detail
                                                .originalEvent
                                                .target as Element | null;
                                            closedSettingsRef.current = Boolean(
                                                target?.closest(
                                                    ".nl-chart-stage__canvas"
                                                )
                                            );
                                        }}
                                    >
                                        <div className="nl-chart-stage__option">
                                            <span className="nl-control nl-muted">
                                                {t("chart.noteSpeed")}
                                            </span>
                                            <CompactSelect
                                                label={t("chart.noteSpeed")}
                                                value={noteSpeed.toFixed(1)}
                                                onValueChange={(value) =>
                                                    setNoteSpeed(Number(value))
                                                }
                                                outlined
                                                container={layerContainer}
                                                options={noteSpeedOptions}
                                            />
                                        </div>
                                        <Checkbox
                                            label={t("chart.metronome")}
                                            checked={metronomeEnabled}
                                            onChange={(event) =>
                                                void updateMetronomeEnabled(
                                                    event.target.checked
                                                )
                                            }
                                        />
                                        {volumeControl}
                                        <Checkbox
                                            label={t("chart.strictPerformance")}
                                            checked={strictPerformance}
                                            onChange={(event) =>
                                                setStrictPerformance(
                                                    event.target.checked
                                                )
                                            }
                                        />
                                        {/* 로컬 음원 — 브라우저 안에서만 재생(올리지 않음) */}
                                        <div className="nl-chart-stage__audio">
                                            <label className="nl-button nl-button--secondary">
                                                <Upload
                                                    className="nl-icon"
                                                    aria-hidden
                                                />
                                                {t("chart.localAudio")}
                                                <input
                                                    type="file"
                                                    accept="audio/mpeg,audio/ogg,audio/wav,audio/flac,audio/mp4"
                                                    onChange={loadAudio}
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="nl-metadata nl-muted nl-chart-stage__file">
                                                {fileName ??
                                                    t("chart.audioHelp")}
                                            </p>
                                        </div>
                                    </Popover.Content>
                                </div>
                            </Popover.Portal>
                        </Popover.Root>
                        <button
                            type="button"
                            className="nl-chart-stage__media-button"
                            onClick={() => void fullscreen.toggle()}
                            aria-label={t(
                                fullscreen.active
                                    ? "chart.exitFullscreen"
                                    : "chart.fullscreen"
                            )}
                        >
                            {fullscreen.active ? (
                                <Minimize className="nl-icon" />
                            ) : (
                                <Maximize className="nl-icon" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {audioError ? (
                <p className="nl-body-secondary nl-chart-stage__error">
                    {audioError}
                </p>
            ) : null}
            <audio
                ref={audioRef}
                preload="metadata"
                onLoadedMetadata={(event) =>
                    setAudioDurationMs(
                        Math.round(event.currentTarget.duration * 1_000)
                    )
                }
                onEnded={() => {
                    isPlayingRef.current = false;
                    clockAnchorRef.current = null;
                    setIsPlaying(false);
                }}
            />
        </section>
    );
}
