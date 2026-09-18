import { describe, expect, it } from "vitest";

import { entryDifficulty } from "@/features/music/lib/entryDifficulty";

describe("악곡에 들어가는 난이도", () => {
    it("그 곡의 가장 높은 난이도로 들어간다", () => {
        const has = (list: string[]) => (difficulty: string) =>
            list.includes(difficulty);
        expect(entryDifficulty(has(["normal", "hard", "expert", "real"]))).toBe(
            "real"
        );
        expect(entryDifficulty(has(["normal", "hard", "expert"]))).toBe(
            "expert"
        );
        expect(entryDifficulty(has(["normal"]))).toBe("normal");
    });
});
