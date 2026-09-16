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
