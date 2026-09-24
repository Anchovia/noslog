import type { Graphics } from "pixi.js";

import type { ChartNote } from "@/lib/chart-pattern/schema";

/** 격자 밖 노트 표시 색 = --nl-feedback-warning-marker(다크) — 선택(노랑) · 충돌(빨강) 과 구분되는 점선 */
const OFF_GRID_COLOR = 0xfbc828;
const DASH = 4;
const GAP = 3;

/** 점선 다각형(닫힘) — Pixi 에는 점선 획이 없어 변마다 잘라 그린다 */
function dashedPolygon(graphics: Graphics, points: number[]) {
    for (let index = 0; index < points.length; index += 2) {
        const x1 = points[index];
        const y1 = points[index + 1];
        const x2 = points[(index + 2) % points.length];
        const y2 = points[(index + 3) % points.length];
        const length = Math.hypot(x2 - x1, y2 - y1);
        for (let start = 0; start < length; start += DASH + GAP) {
            const end = Math.min(start + DASH, length);
            graphics
                .moveTo(
                    x1 + ((x2 - x1) * start) / length,
                    y1 + ((y2 - y1) * start) / length
                )
                .lineTo(
                    x1 + ((x2 - x1) * end) / length,
                    y1 + ((y2 - y1) * end) / length
                );
        }
    }
    graphics.stroke({ color: OFF_GRID_COLOR, width: 2, alpha: 0.95 });
}

/** 스냅 확인에 걸린 노트 머리 바깥 2px 점선(에디터 노트 머리와 같은 육각형) */
export function drawOffGridMarker(
    graphics: Graphics,
    note: ChartNote,
    laneWidth: number,
    yForTick: (tick: number) => number
) {
    const centerY = yForTick(note.tick);
    const x = note.lane * laneWidth - 2;
    const width = note.width * laneWidth + 4;
    const height = 19;
    const y = centerY - height / 2;
    const bevel = Math.min(7, Math.max(2, height * 0.42, width * 0.05));
    dashedPolygon(graphics, [
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
    ]);
}
