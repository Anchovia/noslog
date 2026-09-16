import { describe, expect, it } from "vitest";

import { gradeTone, rankTone, scoreTone } from "@/lib/music/scoreTone";

describe("score tones", () => {
    it("colours scores by goal band", () => {
        expect(scoreTone(949_999)).toBeUndefined();
        expect(scoreTone(950_000)).toBe("s");
        expect(scoreTone(989_999)).toBe("s");
        expect(scoreTone(990_000)).toBe("990k");
        expect(scoreTone(1_000_000)).toBe("pianist");
    });
    it("colours only S and P grades", () => {
        expect(gradeTone("S")).toBe("s");
        expect(gradeTone("P")).toBe("pianist");
        expect(gradeTone("AAA")).toBeUndefined();
    });
    it("matches leaderboard rank colours", () => {
        expect([1, 2, 3, 4, null].map(rankTone)).toEqual([
            "rank-1",
            "rank-2",
            "rank-3",
            "rank",
            undefined,
        ]);
    });
});
