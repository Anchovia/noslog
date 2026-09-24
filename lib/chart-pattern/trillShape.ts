/**
 * 공개 뷰어의 트릴 모양(2026-09-24 B′, 사용자) — 게임처럼 두 자리를 합친 범위 전체에 육각형을 촘촘히 쌓고,
 * 육각형마다 그때 치는 자리 쪽만 진하게, 반대편은 범위 끝까지 옅어지게 그린다(좌우가 번갈아 흔들려 보임).
 * 육각형 길이는 표시용 — 번갈아 치는 간격(trillSnapDivisor)과 따로, 사분음표의 1/12(90 BPM 약 56ms, Altale 영상 실측 약 50ms).
 */
import type { ChartNote } from "./schema";

export const TRILL_HEX_PER_QUARTER = 12;

export interface TrillRange {
    lane: number;
    width: number;
}

export interface TrillHex extends TrillRange {
    startTick: number;
    endTick: number;
}

/** 두 자리를 합친 범위(머리 · 끝 막대 · 육각형 폭) */
export function trillUnion(note: ChartNote): TrillRange {
    const pairLane = note.pairLane ?? note.lane;
    const pairWidth = note.pairWidth ?? note.width;
    const lane = Math.min(note.lane, pairLane);
    const right = Math.max(note.lane + note.width, pairLane + pairWidth);
    return { lane, width: right - lane };
}

/** 육각형 목록 — 첫째는 첫 자리, 다음부터 번갈아. lane · width 는 그 육각형에서 진하게 칠할 자리 */
export function trillHexes(note: ChartNote, ticksPerQuarter: number) {
    const step = Math.max(
        1,
        Math.round(ticksPerQuarter / TRILL_HEX_PER_QUARTER)
    );
    const endTick = note.tick + note.durationTicks;
    const count = Math.max(1, Math.ceil(note.durationTicks / step));
    const pair = {
        lane: note.pairLane ?? note.lane,
        width: note.pairWidth ?? note.width,
    };
    return Array.from({ length: count }, (_, index): TrillHex => {
        const active =
            index % 2 === 0 ? { lane: note.lane, width: note.width } : pair;
        return {
            ...active,
            startTick: note.tick + index * step,
            endTick: Math.min(endTick, note.tick + (index + 1) * step),
        };
    });
}

/**
 * 범위 안에서 진한 구간(0~1). 그 밖은 범위 끝으로 갈수록 옅어진다.
 * fadeLeft · fadeRight = 그쪽에 옅어지는 구간이 있는지
 */
export function trillSolidSpan(active: TrillRange, union: TrillRange) {
    const from = (active.lane - union.lane) / union.width;
    const to = (active.lane + active.width - union.lane) / union.width;
    return { from, to, fadeLeft: from > 0, fadeRight: to < 1 };
}
