export const rankAssetNames: Record<string, string> = {
    P: "p",
    S: "s",
    A2: "a2",
    "A+": "a2",
    A: "a",
    B2: "b2",
    "B+": "b2",
    B: "b",
    C: "c",
    D: "d",
};

/** 게임 등급 코드 → 화면 표기(A2 → A+, B2 → B+) — DB 는 A2 · B2 로 저장한다 */
export function rankDisplayName(rank: string) {
    const upper = rank.toUpperCase();
    return upper === "A2" ? "A+" : upper === "B2" ? "B+" : upper;
}
