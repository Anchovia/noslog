// 악곡 목록 · 빙고 악곡 칸에서 들어가는 난이도 = 그 곡의 가장 높은 난이도(2026-09-19 사용자).
// Real 이 있으면 Real, 없으면 Expert … 서버 · 브라우저 어디서나 쓰는 순수 모듈
const ENTRY_ORDER = ["real", "expert", "hard", "normal"] as const;
export type EntryDifficulty = (typeof ENTRY_ORDER)[number];

export function entryDifficulty(
    has: (difficulty: EntryDifficulty) => boolean
): EntryDifficulty {
    return ENTRY_ORDER.find(has) ?? "expert";
}
