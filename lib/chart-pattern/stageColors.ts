/**
 * 채보 무대 색(2026-09-26) — `tokens.css` 의 `--nl-stage-canvas` · `--nl-hand-left` · `--nl-hand-right` 와 같은 값.
 * 캔버스(Pixi · 2D)는 CSS 변수를 바로 못 읽어 여기 같이 두고, 테스트가 두 곳 값이 같은지 본다.
 */
export const STAGE_CANVAS = "#070910";

/** 전체 악보 그림 색 — 무대와 따로 정한 값(가이드 「채보 뷰어」 캔버스 색 표) */
export const SHEET_COLORS = {
    columnBackground: "#111117",
    laneLine: "#20202a",
    laneGroupLine: "#343441",
    beatLine: "#2a2a34",
    beatAccentLine: "#656574",
    measureNumber: "#c2c2cc",
    measureDetail: "#8e8e9a",
    trillDiamond: "#f2c75c",
    noteOutline: "#f7f7f2",
    noteFace: "rgba(247,247,242,.96)",
    noteHighlight: "#fff8df",
} as const;

export const HAND_COLORS = {
    left: "#4fc8dc",
    right: "#e85f5d",
} as const;

/** 건반 색 — 낙하형 뷰어 · 에디터가 같이 쓴다 */
export const PIANO_COLORS = {
    white: "#e7e6e1",
    whiteAlt: "#d2d4d4",
    black: "#161820",
    body: "#bfc2c4",
    keyLine: "#565a63",
} as const;

/** 낙하형 무대 그림 색 — 노트 면 · 판정선 · 박자 안내선 */
export const FALLING_COLORS = {
    noteFace: "#f8f7f1",
    judgment: "#f2f0e9",
    judgmentEdge: "#8f929d",
    judgmentFace: "#1c2029",
    guideStrong: "#727786",
} as const;

/** 알림 표시색 — `tokens.css` 의 `--nl-feedback-warning-marker` · `--nl-feedback-destructive` 와 같은 값 */
export const FEEDBACK_COLORS = {
    warning: "#fbc828",
    destructive: "#fc432e",
} as const;

/**
 * 채보 에디터 캔버스 색(노트 캔버스 · 타이밍 눈금자 · 파형) — 에디터에만 있는 그림 값.
 * 뷰어와 같은 자리는 위 상수를 빌리고, 충돌 · 격자 밖 · 댓글 시각은 알림 표시색 토큰 값이다.
 */
export const EDITOR_COLORS = {
    laneStrong: "#30333c",
    laneWeak: "#1b1f27",
    snapWhite: "#e7e9ee",
    snapRed: "#a75a62",
    snapPurpleStrong: "#806b9a",
    snapBlue: "#52769b",
    snapPurpleWeak: "#685a78",
    snapYellow: "#75673f",
    snapGrayStrong: "#555a63",
    snapGray: "#464b54",
    snapGrayWeak: "#383d45",
    noteFace: SHEET_COLORS.noteOutline,
    noteShadow: "#121820",
    judgment: "#79df62",
    preview: "#facc15",
    selection: SHEET_COLORS.trillDiamond,
    conflict: FEEDBACK_COLORS.destructive,
    warning: FEEDBACK_COLORS.warning,
    pianoRail: "#252a34",
    pianoEdge: "#969aa5",
    pianoKeyLine: "#565a63",
    rulerLaneGroupLine: "#2a2a35",
    rulerLine: SHEET_COLORS.laneLine,
    rulerBeatAccentLine: "#666674",
    timingPoint: "#38bdf8",
    playhead: "#f2f2f5",
    timeLabel: "#121218",
    waveformBackground: "#1a1a22",
} as const;

/** 눌린 건반 = 손 색을 흰색과 섞어 밝게(지금 값과 거의 같은 비율) */
const PRESSED_WHITE_RATIO = 0.45;

export function hexToNumber(hex: string) {
    return Number.parseInt(hex.slice(1), 16);
}

/** Pixi 숫자 색을 2D 캔버스의 CSS 색 글자로 */
export function numberToHex(value: number) {
    return `#${value.toString(16).padStart(6, "0")}`;
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
