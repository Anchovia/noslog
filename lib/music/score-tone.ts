export type StatTone =
    | "rank-1"
    | "rank-2"
    | "rank-3"
    | "rank"
    | "s"
    | "990k"
    | "pianist"
    | "fc"
    | "grade-1"
    | "grade-2"
    | "grade-3"
    | "grade-4"
    | "grade-5";

/** 점수 → 목표 색 구간(S 950k · 990k · Pianist). FC 여부는 보지 않는다 (2026-09-17) */
export function scoreTone(score: number): StatTone | undefined {
    if (score >= 1_000_000) return "pianist";
    if (score >= 990_000) return "990k";
    if (score >= 950_000) return "s";
    return undefined;
}

/** 스코어 등급 → 색. 등급 글자에는 990k 가 없어 S · P 만 칠한다 */
export function gradeTone(
    grade: string | null | undefined
): StatTone | undefined {
    if (grade === "P") return "pianist";
    if (grade === "S") return "s";
    return undefined;
}

/** 순위 → 순위표와 같은 색(1 · 2 · 3 시상 색, 그 밖 subdued) */
export function rankTone(
    rank: number | null | undefined
): StatTone | undefined {
    if (!rank) return undefined;
    return rank === 1
        ? "rank-1"
        : rank === 2
          ? "rank-2"
          : rank === 3
            ? "rank-3"
            : "rank";
}

/**
 * Grd · 레이팅 구간 색(2026-09-19 B2 · R1) — 두 모드 · 두 값 같은 기준. 6,000 아래는 기본 글자색.
 * 6,000 등급 B · 6,500 등급 A · 7,000 S · 7,500 990k · 8,000 Pianist
 */
const GRADE_BAND_CUTS = [6000, 6500, 7000, 7500, 8000] as const;
export function gradeBandTone(
    value: number | null | undefined
): StatTone | undefined {
    if (value === null || value === undefined) return undefined;
    const band = GRADE_BAND_CUTS.filter((cut) => value >= cut).length;
    return band ? (`grade-${band}` as StatTone) : undefined;
}

/**
 * 이미지(공유 카드)용 검정 명판 다크 값(2026-09-26 E4) — 카드는 CSS 변수를 못 읽어 tokens/colors.css 다크 값을 옮겨 둔다.
 * 값이 토큰과 같은지는 tests/grade-band-tone.test.ts 가 확인한다
 */
export const EXAM_TIER_DARK_HEX = {
    low: "#b6720d", // exam-tier-low
    mid: "#b0b3ba", // exam-tier-mid
    high: "#dab156", // exam-tier-high
    top: "#36cfb0", // exam-tier-top
    peak: "#b9f2ff", // exam-tier-peak
    ground: "#000000", // exam-badge-ground = surface-canvas
} as const;

/**
 * 이미지(공유 카드)용 다크 값 — 카드는 CSS 변수를 못 읽어 tokens/colors.css 다크 값을 그대로 옮겨 둔다.
 * 값이 토큰과 같은지는 tests/grade-band-tone.test.ts 가 tokens/colors.css 를 읽어 확인한다
 */
export const STAT_TONE_DARK_HEX: Partial<Record<StatTone, string>> = {
    "rank-1": "#b0b3ba", // content-subdued(1–3위도 같은 글자 단계)
    "rank-2": "#b0b3ba", // content-subdued
    "rank-3": "#b0b3ba", // content-subdued
    rank: "#b0b3ba", // content-subdued
    "grade-1": "#459fbe", // score-grade-b
    "grade-2": "#f56757", // score-grade-a
    "grade-3": "#e3cb53", // score-goal-s
    "grade-4": "#f7c481", // score-goal-990k
};
