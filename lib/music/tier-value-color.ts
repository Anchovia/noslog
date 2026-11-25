/**
 * 서열 값(1.0–14.5) → 글자 색. 아홉 칸 계단, 칸 안은 단색이다.
 * 칸마다 아래 끝은 포함하고 위 끝은 포함하지 않는다. 1 아래는 Normal.
 * Normal 1–4.5 · N–H 4.5–8 · Hard 8–9.625 · H–E 9.625–11.25 · Expert 11.25–12.15 ·
 * E–R 12.15–13.05 · Real 13.05–13.775 · R–끝 13.775–14.5 · 끝 14.5 이상
 */
const STEPS: [number, string][] = [
    [4.5, "var(--nl-difficulty-normal)"],
    [8, "var(--nl-tier-value-normal-hard)"],
    [9.625, "var(--nl-difficulty-hard)"],
    [11.25, "var(--nl-tier-value-hard-expert)"],
    [12.15, "var(--nl-difficulty-expert)"],
    [13.05, "var(--nl-tier-value-expert-real)"],
    [13.775, "var(--nl-difficulty-real)"],
    [14.5, "var(--nl-tier-value-real-end)"],
];

export function tierValueColor(value: number) {
    return (
        STEPS.find(([limit]) => value < limit)?.[1] ??
        "var(--nl-tier-value-end)"
    );
}
