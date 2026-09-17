import type { Difficulty } from "@/components/music/musicDetailTypes";

// Basic 그레이드 난이도 계수 — Real 은 Expert 와 같음
const difficultyCoefficient: Record<Difficulty, number> = {
    Normal: 1,
    Hard: 1.25,
    Expert: 1.5,
    Real: 1.5,
};

/**
 * 채보의 최대 Basic Grd(×100 정수, 게임 원본 grade_basic 과 같은 단위) — 전부 ◆JUST · 풀콤보 · P 랭크.
 * 단곡 Grd = 공식 레벨 × 난이도 계수 × 랭크 계수(P 9.9) × (85500 × 판정 달성도 + (10000 + 노트 수 1의 자리 버림) × 최대 콤보) ÷ (노트 수 × 120000),
 * 소수 둘째 자리 아래 버림. 운영 기록 풀콤보 221건 · Pianist 6건과 일치 (2026-09-18)
 */
export function getMaxBasicGrade(
    constant: number | null | undefined,
    noteCount: number | null | undefined,
    difficulty: Difficulty
): number | null {
    if (constant == null || noteCount == null || noteCount <= 0) return null;
    const flooredNotes = Math.floor(noteCount / 10) * 10;
    // 부동소수 오차 없이 버리도록 정수로 계산(상수 0.1 단위 · 계수 0.25 단위)
    const numerator =
        Math.round(constant * 10) *
        Math.round(difficultyCoefficient[difficulty] * 4) *
        99 *
        (95_500 + flooredNotes);
    return Math.floor(numerator / 480_000);
}

/** 그레이드 진행 막대 채움(0–1) — 최대값을 모르거나 기록이 없으면 0 */
export function getGradeProgress(
    grade: number | null | undefined,
    maxGrade: number | null
): number {
    if (grade == null || maxGrade == null || maxGrade <= 0) return 0;
    return Math.min(1, Math.max(0, grade / maxGrade));
}
