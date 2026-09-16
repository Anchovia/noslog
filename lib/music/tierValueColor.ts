/**
 * 서열 값(1.0–14.5) → 글자 색. 구간 기준 색을 oklch 로 이어 칠한다(2026-09-17 G1, osu! 난이도 색 참고).
 * 1.0 밝은 Normal → 3.5 Normal → 6.0 JUST 노랑 → 8.0 Hard → 11.25 Expert → 13.05 Real → 14.5 분홍.
 * 구간: Normal 1–5.9 · Hard 6–9.9 · Expert 10–12.5 · Real 12.6–13.5 · Real+ 13.6–14.5
 */
const ANCHORS: [number, string][] = [
    [1, "var(--nl-tier-value-start)"],
    [3.5, "var(--nl-difficulty-text-normal)"],
    [6, "var(--nl-judgement-just)"],
    [8, "var(--nl-difficulty-text-hard)"],
    [11.25, "var(--nl-difficulty-text-expert)"],
    [13.05, "var(--nl-difficulty-text-real)"],
    [14.5, "var(--nl-tier-value-end)"],
];

export function tierValueColor(value: number) {
    const clamped = Math.min(
        ANCHORS.at(-1)![0],
        Math.max(ANCHORS[0][0], value)
    );
    for (let index = 0; index < ANCHORS.length - 1; index++) {
        const [from, fromColor] = ANCHORS[index];
        const [to, toColor] = ANCHORS[index + 1];
        if (clamped > to) continue;
        const share = Math.round(((to - clamped) / (to - from)) * 100);
        if (share >= 100) return fromColor;
        if (share <= 0) return toColor;
        return `color-mix(in oklch, ${fromColor} ${share}%, ${toColor})`;
    }
    return ANCHORS.at(-1)![1];
}
