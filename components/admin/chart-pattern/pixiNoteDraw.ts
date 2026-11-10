import type { Graphics } from "pixi.js";

import { chartPianoColors, hasBlackKeyAfter } from "@/lib/chart-pattern/piano";
import {
    EDITOR_COLORS,
    HAND_COLORS,
    hexToNumber,
    STAGE_CANVAS,
} from "@/lib/chart-pattern/stageColors";
import {
    chartNoteRangeAtTick,
    getChartNoteRenderPoints,
    getGlissandoSnapRenderPoints,
} from "@/lib/chart-pattern/editor";
import {
    CHART_LANE_COUNT,
    type ChartHand,
    type ChartNote,
} from "@/lib/chart-pattern/schema";
import { tickToMilliseconds } from "@/lib/chart-pattern/timing";
import {
    trillHexes,
    trillSolidSpan,
    trillUnion,
} from "@/lib/chart-pattern/trillShape";

// 무대 바탕 · 손 색은 공개 뷰어와 같은 토큰 값, 나머지는 에디터 캔버스 상수(Pixi 는 CSS 변수를 못 읽는다)
export const colors = {
    background: hexToNumber(STAGE_CANVAS),
    laneStrong: hexToNumber(EDITOR_COLORS.laneStrong),
    laneWeak: hexToNumber(EDITOR_COLORS.laneWeak),
    snapWhite: hexToNumber(EDITOR_COLORS.snapWhite),
    snapRed: hexToNumber(EDITOR_COLORS.snapRed),
    snapPurpleStrong: hexToNumber(EDITOR_COLORS.snapPurpleStrong),
    snapBlue: hexToNumber(EDITOR_COLORS.snapBlue),
    snapPurpleWeak: hexToNumber(EDITOR_COLORS.snapPurpleWeak),
    snapYellow: hexToNumber(EDITOR_COLORS.snapYellow),
    snapGrayStrong: hexToNumber(EDITOR_COLORS.snapGrayStrong),
    snapGray: hexToNumber(EDITOR_COLORS.snapGray),
    snapGrayWeak: hexToNumber(EDITOR_COLORS.snapGrayWeak),
    left: hexToNumber(HAND_COLORS.left),
    right: hexToNumber(HAND_COLORS.right),
    noteFace: hexToNumber(EDITOR_COLORS.noteFace),
    noteShadow: hexToNumber(EDITOR_COLORS.noteShadow),
    judgment: hexToNumber(EDITOR_COLORS.judgment),
    preview: hexToNumber(EDITOR_COLORS.preview),
    selection: hexToNumber(EDITOR_COLORS.selection),
    conflict: hexToNumber(EDITOR_COLORS.conflict),
    pianoRail: hexToNumber(EDITOR_COLORS.pianoRail),
    pianoEdge: hexToNumber(EDITOR_COLORS.pianoEdge),
    pianoKeyLine: hexToNumber(EDITOR_COLORS.pianoKeyLine),
};

/** 트릴 몸통(B′) — 칠 자리 투명도 · 옅어지는 쪽을 나눌 띠 수(공개 뷰어 낙하형과 같은 방식) */
const TRILL_SOLID_ALPHA = 0.82;
const TRILL_FADE_STRIPS = 8;

function colorForHand(hand: ChartHand) {
    return hand === "left" ? colors.left : colors.right;
}

export function styleForSnapSubdivision(subdivision: number) {
    if (subdivision === 1) {
        // 흰색은 박자표의 마디 첫 박자에만 사용한다. 1/1 스냅까지
        // 흰색이면 3/4처럼 한 마디가 온음표와 다른 박자에서 두 기준선이
        // 섞여 보이므로, 온음표 스냅은 강한 중립색으로 한 단계 낮춘다.
        return { color: colors.snapGrayStrong, width: 1.1, alpha: 0.72 };
    }
    if (subdivision === 2) {
        return { color: colors.snapRed, width: 1.05, alpha: 0.8 };
    }
    if (subdivision === 3) {
        return {
            color: colors.snapPurpleStrong,
            width: 0.95,
            alpha: 0.72,
        };
    }
    if (subdivision === 4) {
        return { color: colors.snapBlue, width: 0.85, alpha: 0.64 };
    }
    if (subdivision === 6) {
        return {
            color: colors.snapPurpleWeak,
            width: 0.75,
            alpha: 0.56,
        };
    }
    if (subdivision === 8) {
        return { color: colors.snapYellow, width: 0.65, alpha: 0.5 };
    }
    if (subdivision === 12) {
        return {
            color: colors.snapGrayStrong,
            width: 0.58,
            alpha: 0.44,
        };
    }
    if (subdivision === 16) {
        return { color: colors.snapGray, width: 0.52, alpha: 0.38 };
    }
    if (subdivision === 24) {
        return {
            color: colors.snapGrayWeak,
            width: 0.46,
            alpha: 0.32,
        };
    }
    return { color: colors.snapGrayWeak, width: 0.42, alpha: 0.27 };
}

export function drawEditorPiano(
    graphics: Graphics,
    width: number,
    height: number,
    judgmentY: number,
    activeLaneHands: Map<number, ChartHand>
) {
    const laneWidth = width / CHART_LANE_COUNT;
    const pianoTop = judgmentY + 5;
    const pianoHeight = Math.max(1, height - pianoTop);

    for (let lane = 0; lane < CHART_LANE_COUNT; lane += 1) {
        const x = lane * laneWidth;
        const activeHand = activeLaneHands.get(lane);
        graphics
            .rect(x, pianoTop, laneWidth, pianoHeight)
            .fill({
                color:
                    activeHand === undefined
                        ? lane % 2 === 0
                            ? chartPianoColors.white
                            : chartPianoColors.whiteAlt
                        : activeHand === "left"
                          ? chartPianoColors.pressedLeft
                          : chartPianoColors.pressedRight,
                alpha: activeHand === undefined ? 0.96 : 0.9,
            })
            .stroke({ color: colors.pianoKeyLine, width: 0.65, alpha: 0.72 });
    }

    for (let lane = 0; lane < CHART_LANE_COUNT - 1; lane += 1) {
        if (!hasBlackKeyAfter(lane)) continue;
        const x = (lane + 1) * laneWidth;
        graphics
            .rect(
                x - laneWidth * 0.22,
                pianoTop,
                laneWidth * 0.44,
                pianoHeight * 0.56
            )
            .fill({ color: chartPianoColors.black, alpha: 0.98 });
    }

    graphics
        .roundRect(0, judgmentY - 5, width, 10, 4)
        .fill({ color: colors.pianoRail, alpha: 0.98 })
        .stroke({ color: colors.pianoEdge, width: 2, alpha: 0.96 });
    graphics
        .moveTo(5, judgmentY - 1.5)
        .lineTo(width - 5, judgmentY - 1.5)
        .stroke({ color: colors.judgment, width: 1.5, alpha: 0.96 });
}

/**
 * 영상 추출 가져오기 미리보기 노트 — 손 색 대신 미리보기 노랑을 꽉 채우고, 캔버스 바탕색 테두리로 아래(흐린 초안) 노트와 가른다.
 * 테누토 · 트릴은 몸통을 옅은 노랑 + 노랑 선으로, 트릴은 두 위치를 모두 덮는다.
 */
export function drawImportNote(
    graphics: Graphics,
    note: ChartNote,
    laneWidth: number,
    yForTick: (tick: number) => number
) {
    const startY = yForTick(note.tick);
    const cap = (
        lane: number,
        width: number,
        centerY: number,
        small = false
    ) => {
        const height = small ? 7 : 10;
        graphics
            .poly(
                capPolygon(
                    lane * laneWidth,
                    centerY - height / 2 - 2.5,
                    width * laneWidth,
                    height + 5
                ),
                true
            )
            .fill({ color: colors.background, alpha: 0.9 });
        graphics
            .poly(
                capPolygon(
                    lane * laneWidth + 2,
                    centerY - height / 2,
                    Math.max(1, width * laneWidth - 4),
                    height
                ),
                true
            )
            .fill({ color: colors.preview, alpha: 1 })
            .stroke({ color: colors.noteShadow, width: 1.2, alpha: 1 });
    };
    if (note.type === "glissando" && note.durationTicks > 0) {
        // 글리산도는 경로를 따라(영상 추출 가져오기, 2026-09-24) — 왼쪽 가장자리를 올라가 오른쪽으로 내려오는 띠
        const points = getChartNoteRenderPoints(note);
        graphics
            .poly(
                [
                    ...points.flatMap((point) => [
                        point.lane * laneWidth + 3,
                        yForTick(point.tick),
                    ]),
                    ...[...points]
                        .reverse()
                        .flatMap((point) => [
                            (point.lane + point.width) * laneWidth - 3,
                            yForTick(point.tick),
                        ]),
                ],
                true
            )
            .fill({ color: colors.preview, alpha: 0.24 })
            .stroke({ color: colors.preview, width: 1.4, alpha: 0.9 });
        const last = points[points.length - 1];
        cap(last.lane, last.width, yForTick(last.tick), true);
    } else if (note.type !== "standard" && note.durationTicks > 0) {
        const endY = yForTick(note.tick + note.durationTicks);
        const lanes =
            note.type === "trill" && note.pairLane !== undefined
                ? [
                      Math.min(note.lane, note.pairLane),
                      Math.max(
                          note.lane + note.width,
                          note.pairLane + (note.pairWidth ?? note.width)
                      ),
                  ]
                : [note.lane, note.lane + note.width];
        graphics
            .rect(
                lanes[0] * laneWidth + 3,
                endY,
                Math.max(1, (lanes[1] - lanes[0]) * laneWidth - 6),
                Math.max(1, startY - endY)
            )
            .fill({ color: colors.preview, alpha: 0.24 })
            .stroke({ color: colors.preview, width: 1.4, alpha: 0.9 });
        if (note.type === "trill" && note.pairLane !== undefined) {
            cap(note.pairLane, note.pairWidth ?? note.width, endY, true);
        } else {
            cap(note.lane, note.width, endY, true);
        }
    }
    cap(note.lane, note.width, startY);
}

/** 넣으면 빠질 지금 초안 노트 — 충돌 빨강 테두리 + 사선 */
export function drawImportRemoval(
    graphics: Graphics,
    note: ChartNote,
    laneWidth: number,
    yForTick: (tick: number) => number
) {
    const centerY = yForTick(note.tick);
    const x = note.lane * laneWidth;
    const width = note.width * laneWidth;
    if (note.type !== "standard" && note.durationTicks > 0) {
        const endY = yForTick(note.tick + note.durationTicks);
        graphics
            .rect(
                x + 2,
                endY,
                Math.max(1, width - 4),
                Math.max(1, centerY - endY)
            )
            .stroke({ color: colors.conflict, width: 1.6, alpha: 0.85 });
    }
    graphics
        .poly(capPolygon(x, centerY - 7.5, width, 15), true)
        .stroke({ color: colors.conflict, width: 2.4, alpha: 0.95 });
    graphics
        .moveTo(x + 4, centerY - 5)
        .lineTo(x + width - 4, centerY + 5)
        .stroke({ color: colors.conflict, width: 2, alpha: 0.95 });
}

/** 넣으면 생길 타이밍 포인트(템포 변화 제안) — 미리보기 노랑 점선과 양 끝 삼각 표지 */
export function drawImportTiming(graphics: Graphics, width: number, y: number) {
    for (let x = 0; x < width; x += 12) {
        graphics
            .moveTo(x, y)
            .lineTo(Math.min(width, x + 7), y)
            .stroke({ color: colors.preview, width: 2, alpha: 0.95 });
    }
    graphics
        .poly([0, y - 7, 10, y, 0, y + 7], true)
        .fill({ color: colors.preview, alpha: 0.95 });
    graphics
        .poly([width, y - 7, width - 10, y, width, y + 7], true)
        .fill({ color: colors.preview, alpha: 0.95 });
}

/** 가져오기 목록에서 고른 곳 — 흰 띠와 양 끝 막대(노랑 미리보기 · 선택 색과 헷갈리지 않게 마디선 흰색) */
export function drawImportFocus(
    graphics: Graphics,
    width: number,
    centerY: number
) {
    graphics
        .rect(0, centerY - 16, width, 32)
        .fill({ color: colors.snapWhite, alpha: 0.1 });
    graphics
        .rect(0, centerY - 16, 4, 32)
        .fill({ color: colors.snapWhite, alpha: 0.95 });
    graphics
        .rect(width - 4, centerY - 16, 4, 32)
        .fill({ color: colors.snapWhite, alpha: 0.95 });
}

function capPolygon(x: number, y: number, width: number, height: number) {
    const bevel = Math.min(7, Math.max(2, height * 0.42, width * 0.05));
    return [
        x,
        y,
        x + width,
        y,
        x + width + bevel,
        y + height / 2,
        x + width,
        y + height,
        x,
        y + height,
        x - bevel,
        y + height / 2,
    ];
}

function drawCap({
    graphics,
    x,
    centerY,
    width,
    hand,
    alpha,
    selected,
    conflicted,
    small = false,
}: {
    graphics: Graphics;
    x: number;
    centerY: number;
    width: number;
    hand: ChartHand;
    alpha: number;
    selected: boolean;
    conflicted: boolean;
    small?: boolean;
}) {
    const height = small ? 7 : 10;
    const handColor = colorForHand(hand);
    const outer = capPolygon(
        x + 1,
        centerY - height / 2 - 2,
        Math.max(3, width - 2),
        height + 4
    );
    graphics.poly(outer, true).fill({ color: handColor, alpha: alpha * 0.24 });
    const shape = capPolygon(
        x + 2,
        centerY - height / 2,
        Math.max(1, width - 4),
        height
    );
    graphics
        .poly(shape, true)
        .fill({ color: colors.noteFace, alpha })
        .stroke({ color: handColor, width: 1.4, alpha });
    graphics
        .moveTo(x + 5, centerY + 1)
        .lineTo(x + width - 5, centerY + 1)
        .stroke({ color: handColor, width: 1, alpha: alpha * 0.34 });
    if (conflicted) {
        graphics
            .poly(
                capPolygon(x, centerY - height / 2 - 2.5, width, height + 5),
                true
            )
            .stroke({
                color: colors.conflict,
                width: 3.2,
                alpha: 0.95,
            });
    }
    if (selected) {
        graphics
            .poly(
                capPolygon(x, centerY - height / 2 - 2.5, width, height + 5),
                true
            )
            .stroke({
                color: colors.selection,
                width: 1.8,
                alpha: 0.95,
            });
    }
}

function drawDiamond(
    graphics: Graphics,
    centerX: number,
    centerY: number,
    size: number,
    fill: number,
    alpha = 1
) {
    graphics
        .poly(
            [
                centerX,
                centerY - size,
                centerX + size,
                centerY,
                centerX,
                centerY + size,
                centerX - size,
                centerY,
            ],
            true
        )
        .fill({ color: fill, alpha })
        .stroke({ color: colors.noteFace, width: 1, alpha });
}

export function drawNote({
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
    isDimmed,
    showControls,
    isConflicted,
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
    isDimmed: boolean;
    showControls: boolean;
    isConflicted: boolean;
}) {
    const yForTick = (tick: number) =>
        judgmentY -
        (tickToMilliseconds(tick, timingPoints, ticksPerQuarter) -
            currentTimeMs) *
            pixelsPerMs;
    const baseAlpha = isDimmed ? 0.28 : isPreview ? 0.58 : 0.94;

    if (note.type === "standard") {
        drawCap({
            graphics,
            x: note.lane * laneWidth,
            centerY: yForTick(note.tick),
            width: note.width * laneWidth,
            hand: note.hand,
            alpha: baseAlpha,
            selected: isSelected,
            conflicted: isConflicted,
        });
    } else if (note.type === "trill") {
        // 공개 뷰어와 같은 게임식(2026-09-24 B′): 두 자리를 합친 범위 전체에 촘촘한 육각형, 칠 자리 쪽만 진하고 반대편은 옅어짐
        const union = trillUnion(note);
        const x1 = union.lane * laneWidth + 2;
        const x2 = (union.lane + union.width) * laneWidth - 2;
        const color = colorForHand(note.hand);
        for (const hex of trillHexes(note, ticksPerQuarter)) {
            const bottomY = yForTick(hex.startTick) - 0.5;
            const topY = yForTick(hex.endTick) + 0.5;
            const middleY = (bottomY + topY) / 2;
            const bevel = Math.min(
                6,
                (x2 - x1) * 0.12,
                (bottomY - topY) * 0.35
            );
            const xAt = (fraction: number, inset: number) =>
                Math.min(
                    x2 - inset,
                    Math.max(x1 + inset, x1 + (x2 - x1) * fraction)
                );
            const band = (from: number, to: number, alpha: number) =>
                graphics
                    .poly(
                        [
                            xAt(from, bevel),
                            bottomY,
                            xAt(to, bevel),
                            bottomY,
                            xAt(to, 0),
                            middleY,
                            xAt(to, bevel),
                            topY,
                            xAt(from, bevel),
                            topY,
                            xAt(from, 0),
                            middleY,
                        ],
                        true
                    )
                    .fill({ color, alpha: baseAlpha * alpha });
            const span = trillSolidSpan(hex, union);
            band(span.from, span.to, TRILL_SOLID_ALPHA);
            for (let strip = 0; strip < TRILL_FADE_STRIPS; strip += 1) {
                const alpha =
                    TRILL_SOLID_ALPHA * (1 - (strip + 0.5) / TRILL_FADE_STRIPS);
                if (span.fadeLeft) {
                    const step = span.from / TRILL_FADE_STRIPS;
                    band(
                        span.from - (strip + 1) * step,
                        span.from - strip * step,
                        alpha
                    );
                }
                if (span.fadeRight) {
                    const step = (1 - span.to) / TRILL_FADE_STRIPS;
                    band(
                        span.to + strip * step,
                        span.to + (strip + 1) * step,
                        alpha
                    );
                }
            }
        }
        const headY = yForTick(note.tick);
        const tailY = yForTick(note.tick + note.durationTicks);
        if (isSelected || isConflicted) {
            graphics
                .rect(x1, tailY, x2 - x1, Math.max(1, headY - tailY))
                .stroke({
                    color: isConflicted ? colors.conflict : colors.selection,
                    width: isConflicted ? 2.8 : 1.5,
                    alpha: 0.92,
                });
        }
        // 끝 막대(어두운 막대 + 손 색 테두리) · 머리(범위 전체) · 마름모
        graphics
            .poly(capPolygon(x1, tailY - 3.5, x2 - x1, 7), true)
            .fill({ color: colors.background, alpha: baseAlpha })
            .stroke({ color, width: 1.4, alpha: baseAlpha });
        drawCap({
            graphics,
            x: union.lane * laneWidth,
            centerY: headY,
            width: union.width * laneWidth,
            hand: note.hand,
            alpha: baseAlpha,
            selected: isSelected,
            conflicted: isConflicted,
        });
        const centerX = (union.lane + union.width / 2) * laneWidth;
        drawDiamond(
            graphics,
            centerX - 3,
            headY + 1,
            5,
            colors.selection,
            baseAlpha
        );
        drawDiamond(
            graphics,
            centerX + 4,
            headY - 5,
            4,
            colors.selection,
            baseAlpha * 0.92
        );
    } else {
        const points = getChartNoteRenderPoints(note);
        for (let index = 0; index < points.length - 1; index += 1) {
            const first = points[index];
            const second = points[index + 1];
            const polygon = [
                first.lane * laneWidth + 2,
                yForTick(first.tick),
                (first.lane + first.width) * laneWidth - 2,
                yForTick(first.tick),
                (second.lane + second.width) * laneWidth - 2,
                yForTick(second.tick),
                second.lane * laneWidth + 2,
                yForTick(second.tick),
            ];
            graphics
                .poly(polygon, true)
                .fill({
                    color: colorForHand(first.hand),
                    alpha: baseAlpha * 0.58,
                })
                .stroke({
                    color: colorForHand(second.hand),
                    width: 1,
                    alpha: baseAlpha * 0.62,
                });
            graphics
                .moveTo(
                    (first.lane + first.width / 2) * laneWidth,
                    yForTick(first.tick)
                )
                .lineTo(
                    (second.lane + second.width / 2) * laneWidth,
                    yForTick(second.tick)
                )
                .stroke({
                    color: colors.noteFace,
                    width: 1.3,
                    alpha: baseAlpha * 0.72,
                });
            if (isSelected) {
                graphics.poly(polygon, true).stroke({
                    color: colors.selection,
                    width: 1.6,
                    alpha: 0.9,
                });
            }
            if (isConflicted) {
                graphics.poly(polygon, true).stroke({
                    color: colors.conflict,
                    width: 2.8,
                    alpha: 0.92,
                });
            }
        }
        const capPoints =
            note.type === "glissando"
                ? getGlissandoSnapRenderPoints(note, ticksPerQuarter)
                : points;
        for (const point of capPoints) {
            drawCap({
                graphics,
                x: point.lane * laneWidth,
                centerY: yForTick(point.tick),
                width: point.width * laneWidth,
                hand: point.hand,
                alpha: baseAlpha,
                selected: isSelected,
                conflicted: isConflicted,
                small:
                    point.tick !== note.tick &&
                    point.tick !== note.tick + note.durationTicks,
            });
        }
    }

    if (showControls) {
        const handleSize = 4;
        const startY = yForTick(note.tick);
        drawDiamond(
            graphics,
            note.lane * laneWidth,
            startY,
            handleSize,
            colors.selection
        );
        drawDiamond(
            graphics,
            (note.lane + note.width) * laneWidth,
            startY,
            handleSize,
            colors.selection
        );
        if (note.type !== "standard") {
            const endTick = note.tick + note.durationTicks;
            const endRange = chartNoteRangeAtTick(note, endTick);
            const endHandleLane =
                note.type === "glissando"
                    ? endRange.lane + endRange.width
                    : endRange.lane + endRange.width / 2;
            drawDiamond(
                graphics,
                endHandleLane * laneWidth,
                yForTick(endTick),
                handleSize,
                colors.selection
            );
        }
        if (note.type === "glissando") {
            for (const point of getGlissandoSnapRenderPoints(
                note,
                ticksPerQuarter
            )) {
                drawDiamond(
                    graphics,
                    (point.lane + point.width / 2) * laneWidth,
                    yForTick(point.tick),
                    4,
                    colors.selection
                );
            }
        } else if (note.type === "tenuto") {
            for (const point of getChartNoteRenderPoints(note)) {
                if (point.sourceIndex === null) continue;
                drawDiamond(
                    graphics,
                    (point.lane + point.width / 2) * laneWidth,
                    yForTick(point.tick),
                    5,
                    colors.selection
                );
            }
        }
    }
}
