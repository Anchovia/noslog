import type { StatTone } from "@/components/ui/statStrip";

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
 * 6,000 파랑 · 6,500 하늘 · 7,000 S 노랑 · 7,500 990k 살구 · 8,000 Pianist 분홍
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
 * 이미지(공유 카드)용 다크 값 — 카드는 CSS 변수를 못 읽어 tokens.css 다크 값을 그대로 옮겨 둔다.
 * 값이 토큰과 같은지는 tests/grade-band-tone.test.ts 가 tokens.css 를 읽어 확인한다
 */
export const STAT_TONE_DARK_HEX: Partial<Record<StatTone, string>> = {
    "rank-1": "#d6b56d", // exam-tier-top
    "rank-2": "#c4c8ce", // exam-tier-high
    "rank-3": "#b98b67", // exam-tier-mid
    rank: "#afafaf", // content-subdued
    "grade-1": "#70b8ff", // judgement-near
    "grade-2": "#4ccce6", // judgement-good
    "grade-3": "#ffca16", // judgement-just(S)
    "grade-4": "#ffac71", // judgement-just 50% + judgement-s-just(990k)
    "grade-5": "#ff8dcc", // judgement-s-just(Pianist)
};
