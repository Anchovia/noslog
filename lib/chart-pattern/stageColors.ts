/**
 * 채보 무대 색(2026-09-26) — `tokens.css` 의 `--nl-stage-canvas` · `--nl-hand-left` · `--nl-hand-right` 와 같은 값.
 * 캔버스(Pixi · 2D)는 CSS 변수를 바로 못 읽어 여기 같이 두고, 테스트가 두 곳 값이 같은지 본다.
 */
export const STAGE_CANVAS = "#070910";

export const HAND_COLORS = {
    left: "#4fc8dc",
    right: "#e85f5d",
} as const;

/** 눌린 건반 = 손 색을 흰색과 섞어 밝게(지금 값과 거의 같은 비율) */
const PRESSED_WHITE_RATIO = 0.45;

export function hexToNumber(hex: string) {
    return Number.parseInt(hex.slice(1), 16);
}

export function mixWithWhite(hex: string, ratio: number) {
    const value = hexToNumber(hex);
    const channel = (shift: number) => {
        const base = (value >> shift) & 0xff;
        return Math.round(base + (0xff - base) * ratio);
    };
    return (channel(16) << 16) | (channel(8) << 8) | channel(0);
}

export const PRESSED_HAND_COLORS = {
    left: mixWithWhite(HAND_COLORS.left, PRESSED_WHITE_RATIO),
    right: mixWithWhite(HAND_COLORS.right, PRESSED_WHITE_RATIO),
} as const;
