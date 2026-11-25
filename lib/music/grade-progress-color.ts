/**
 * 그레이드 진행 막대 색 — 막대 위치(0–1, 최대 Grd 대비) → 색. 막대 그라데이션과 그레이드 숫자가 같은 값을 쓴다 (2026-09-18 Q3).
 * 경계 = 운영 기록 「내 Grd ÷ 최대」 등급별 하위 5%(B+ 40.3 · A 49.5 · A+ 59.6 · S 73.7 · 990k 81.9),
 * Pianist 시작 87.9% = S 계수 8.7 ÷ P 9.9, Pianist 세 색은 87.9% · 93.95% · 100%. 색 = 등급 색(B · A) · 점수 목표 색(S · 990k · Pianist).
 */
const STOPS: [number, string][] = [
    [0, "var(--nl-score-grade-b)"],
    [0.403, "var(--nl-score-grade-b)"],
    [0.495, "var(--nl-score-grade-a)"],
    [0.596, "var(--nl-score-grade-a)"],
    [0.737, "var(--nl-score-goal-s)"],
    [0.819, "var(--nl-score-goal-990k)"],
    [0.879, "var(--nl-score-goal-pianist-1)"],
    [0.9395, "var(--nl-score-goal-pianist-2)"],
    [1, "var(--nl-score-goal-pianist-3)"],
];

/** 막대 그라데이션의 색 지점 목록(CSS `linear-gradient` 인자) */
export const GRADE_PROGRESS_STOPS = STOPS.map(
    ([position, color]) => `${color} ${+(position * 100).toFixed(2)}%`
).join(", ");

/** 막대 위치의 색 — 막대와 같은 oklch 섞기 */
export function gradeProgressColor(progress: number) {
    const clamped = Math.min(1, Math.max(0, progress));
    for (let index = 0; index < STOPS.length - 1; index++) {
        const [from, fromColor] = STOPS[index];
        const [to, toColor] = STOPS[index + 1];
        if (clamped > to) continue;
        if (fromColor === toColor) return fromColor;
        const share = Math.round(((to - clamped) / (to - from)) * 100);
        if (share >= 100) return fromColor;
        if (share <= 0) return toColor;
        return `color-mix(in oklch, ${fromColor} ${share}%, ${toColor})`;
    }
    return STOPS.at(-1)![1];
}
