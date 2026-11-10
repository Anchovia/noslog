export const DIFFICULTIES = ["Normal", "Hard", "Expert", "Real"] as const;
export const DIFFICULTY_KEYS = ["normal", "hard", "expert", "real"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];
export type DifficultyKey = (typeof DIFFICULTY_KEYS)[number];

export const DIFFICULTY_ORDER: Record<Difficulty, number> = {
    Normal: 0,
    Hard: 1,
    Expert: 2,
    Real: 3,
};

export function difficultyKey(difficulty: Difficulty): DifficultyKey {
    return difficulty.toLowerCase() as DifficultyKey;
}

// 주소의 난이도(소문자 등)를 채보 난이도 값으로 — 난이도는 enum 이라 대소문자 무시 조회를 못 한다(2026-10-16 D4-C 2차)
export function parseChartDifficulty(value: string): Difficulty | undefined {
    const lower = value.toLowerCase();
    return DIFFICULTIES.find(
        (difficulty) => difficulty.toLowerCase() === lower
    );
}
