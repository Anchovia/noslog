/**
 * 공유 카드(이미지) 색 = tokens.css 다크 값(2026-10-01 D9). 카드는 CSS 변수를 못 읽어 값을 옮겨 둔다 —
 * 값이 토큰과 같은지는 tests/profile-card-colors.test.ts 가 tokens.css 를 읽어 확인한다.
 * 값 색(Grd 구간 · 순위)과 검정 명판은 lib/music/scoreTone.ts 의 STAT_TONE_DARK_HEX · EXAM_TIER_DARK_HEX
 */
export const PROFILE_CARD_DARK_HEX = {
    /** 기본 글자 · N 로고 테두리 */
    ink: "#f2f2f2", // content-interactive
    /** 국기 테두리 */
    flagBorder: "#dbdbdb", // content-default
    /** 라벨 · 모드 · 기준일 · 아래 줄 글자 · 지구본 */
    subdued: "#afafaf", // content-subdued
    /** 칸 사이 세로선 */
    divider: "#323232", // border-divider
    /** 사진 없는 아바타 면 */
    emptySurface: "#222222", // surface-raised
    /** 아바타 링 · 장식 */
    gold: "#d6b56d", // exam-tier-top
    /** 아래 줄 「P」(score-goal-pianist) */
    pianist: "#ff8dcc", // judgement-s-just
    /** 아래 줄 「FC」 */
    fullCombo: "#b4ce35", // achievement-full-combo
    /** 아래 줄 「S」(score-goal-s) */
    s: "#ffca16", // judgement-just
} as const;

/** 카드 장식의 반투명 색 — 다크 값 hex 에 투명도만 더한다 */
export function profileCardAlpha(hex: string, alpha: number) {
    const [red, green, blue] = [1, 3, 5].map((index) =>
        parseInt(hex.slice(index, index + 2), 16)
    );
    return `rgba(${red},${green},${blue},${alpha})`;
}
