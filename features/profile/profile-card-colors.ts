/**
 * 공유 카드(이미지) 색 = tokens/colors.css 다크 값(2026-10-01 D9). 카드는 CSS 변수를 못 읽어 값을 옮겨 둔다 —
 * 값이 토큰과 같은지는 tests/profile-card-colors.test.ts 가 tokens/colors.css 를 읽어 확인한다.
 * 값 색(Grd 구간 · 순위)과 검정 명판은 lib/music/score-tone.ts 의 STAT_TONE_DARK_HEX · EXAM_TIER_DARK_HEX
 */
export const PROFILE_CARD_DARK_HEX = {
    /** 기본 글자 */
    ink: "#dcdee3", // content-default
    /** 국기 테두리 */
    flagBorder: "#dcdee3", // content-default
    /** 라벨 · 모드 · 기준일 · 아래 줄 글자 · 지구본 */
    subdued: "#b0b3ba", // content-subdued
    /** 칸 사이 세로선 */
    divider: "#ffffff0d", // border-divider
    /** 사진 없는 아바타 면 */
    emptySurface: "#16171b", // surface-surface
    /** 아바타 링 · 장식 — 금색 테두리는 토큰 값이 아니라 지금 hex 그대로 */
    gold: "#d6b56d",
    /** 아래 줄 「FC」 */
    fullCombo: "#d4f6ef", // achievement-full-combo
    /** 아래 줄 「S」(score-goal-s) */
    s: "#e3cb53", // score-goal-s
} as const;

/** 아래 줄 「P」 · Pianist 구간 숫자 — score-goal-pianist-1/2/3 세 색 그라데이션 글자 */
export const PROFILE_CARD_PIANIST_STOPS = [
    "#e9bcf2",
    "#eab7d4",
    "#f7c6ad",
] as const;
export const PROFILE_CARD_PIANIST_TEXT = {
    backgroundImage: `linear-gradient(90deg, ${PROFILE_CARD_PIANIST_STOPS.join(", ")})`,
    backgroundClip: "text",
    color: "transparent",
} as const;

/** 카드 장식의 반투명 색 — 다크 값 hex 에 투명도만 더한다 */
export function profileCardAlpha(hex: string, alpha: number) {
    const [red, green, blue] = [1, 3, 5].map((index) =>
        parseInt(hex.slice(index, index + 2), 16)
    );
    return `rgba(${red},${green},${blue},${alpha})`;
}
