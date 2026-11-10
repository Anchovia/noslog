import type { Graphics } from "pixi.js";

import { chartPianoColors, hasBlackKeyAfter } from "@/lib/chart-pattern/piano";
import {
    FALLING_COLORS,
    HAND_COLORS,
    hexToNumber,
    PIANO_COLORS,
    PRESSED_HAND_COLORS,
    SHEET_COLORS,
    STAGE_CANVAS,
} from "@/lib/chart-pattern/stageColors";
import {
    getActivePlaybackPianoRanges,
    getPlaybackVisualScale,
    getPlaybackRibbonVisibleEndMs,
    projectPlaybackLane,
    projectPlaybackRange,
    type PlaybackPathPoint,
    type PreparedPlaybackNote,
} from "@/lib/chart-pattern/playback";
import {
    clipPathSegment,
    sampleProjectedSegment,
    trillPointAt,
    type ProjectedRange,
} from "@/lib/chart-pattern/playbackPath";
import {
    CHART_LANE_COUNT,
    CHART_LANE_GROUP_BOUNDARIES,
    type ChartHand,
} from "@/lib/chart-pattern/schema";

// 손 색 · 무대 검정은 토큰(`--nl-hand-*` · `--nl-stage-canvas`)과 같은 값(2026-09-26)
const colors = {
    left: hexToNumber(HAND_COLORS.left),
    right: hexToNumber(HAND_COLORS.right),
    noteFace: hexToNumber(FALLING_COLORS.noteFace),
    judgment: hexToNumber(FALLING_COLORS.judgment),
    judgmentEdge: hexToNumber(FALLING_COLORS.judgmentEdge),
    judgmentFace: hexToNumber(FALLING_COLORS.judgmentFace),
    guideStrong: hexToNumber(FALLING_COLORS.guideStrong),
    pianoBody: hexToNumber(PIANO_COLORS.body),
    pianoKeyLine: hexToNumber(PIANO_COLORS.keyLine),
};

function colorForHand(hand: ChartHand) {
    return hand === "left" ? colors.left : colors.right;
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

const TRILL_FADE_STRIPS = 10;
const TRILL_SOLID_ALPHA = 0.82;
const TRILL_DIAMOND = hexToNumber(SHEET_COLORS.trillDiamond);
const TRILL_TAIL = hexToNumber(STAGE_CANVAS);

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

// 바탕은 칠하지 않는다 — 캔버스 아래 무대 칸이 `stage/canvas` 한 색이다
function drawPlayfield(
    graphics: Graphics,
    width: number,
    horizonY: number,
    judgmentY: number
) {
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
        .fill({ color: colors.pianoBody, alpha: 0.92 });
    for (let lane = 0; lane < CHART_LANE_COUNT; lane += 1) {
        const x = left + lane * laneWidth;
        const activeHand = activeLaneHands.get(lane);
        graphics
            .rect(x, pianoTop, laneWidth, pianoBottom - pianoTop)
            .fill({
                color:
                    activeHand === "left"
                        ? PRESSED_HAND_COLORS.left
                        : activeHand === "right"
                          ? PRESSED_HAND_COLORS.right
                          : lane % 2 === 0
                            ? chartPianoColors.white
                            : chartPianoColors.whiteAlt,
                alpha: activeHand === undefined ? 0.96 : 0.9,
            })
            .stroke({ color: colors.pianoKeyLine, width: 0.65, alpha: 0.7 });
    }

    for (let lane = 0; lane < CHART_LANE_COUNT - 1; lane += 1) {
        if (!hasBlackKeyAfter(lane)) continue;
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
        .fill({ color: colors.judgmentFace, alpha: 0.96 })
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

export function renderPlaybackFrame({
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
    drawPlayfield(graphics, width, horizonY, judgmentY);
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
