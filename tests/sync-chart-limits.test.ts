import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ default: {} }));

import { isWithinChartLimits } from "@/features/sync/server/chart-limits";

const values = (score: number, rank: string) => ({
    difficulty: "Expert" as const,
    score,
    rank,
    judge: [0, 0, 0, 0, 0] as [number, number, number, number, number],
    maxCombo: 0,
    gradeBasic: 0,
});

// 등급은 점수로 정해진다 — 어긋난 줄은 채보 값을 몰라도 저장하지 않는다
describe("동기화 기록의 점수 · 등급 일관성", () => {
    it.each([
        [1_000_000, "P", true],
        [1_000_000, "S", false],
        [999_999, "P", false],
        [999_999, "s", true],
        [950_000, "S", true],
        [949_999, "S", false],
        [949_999, "A2", true],
        [0, "-", true],
    ])("점수 %i · 등급 %s → %s", (score, rank, expected) => {
        expect(isWithinChartLimits(undefined, values(score, rank))).toBe(
            expected
        );
    });
});
