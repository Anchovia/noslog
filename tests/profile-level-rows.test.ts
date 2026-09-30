import { describe, expect, it } from "vitest";

import { profileLevelRows } from "@/features/profile/components/profileLevels";
import type { ProfileLevelRow } from "@/features/profile/schemas/profileStatsSchema";

const row = (
    difficulty: ProfileLevelRow["difficulty"],
    level: number,
    total: number
): ProfileLevelRow => ({
    difficulty,
    level,
    total,
    tiers: { pianist: 0, fc: 0, S: 1, "A+": 0, A: 0, B: 0 },
});
// 입력 순서가 섞여 있어도 줄 순서는 묶음 → 레벨 오름차순 → REAL
const levels = [
    row("real", 3, 5),
    row("expert", 12, 4),
    row("hard", 9, 3),
    row("expert", 9, 2),
    row("hard", 3, 6),
    row("normal", 3, 7),
    row("normal", 1, 8),
    row("real", 1, 9),
];

describe("profileLevelRows", () => {
    it("groups levels 1–8 into one row until expanded", () => {
        const rows = profileLevelRows(levels, "all");
        expect(rows.map((item) => item.label)).toEqual([
            "1–8",
            "9",
            "12",
            "REAL 1",
            "REAL 3",
        ]);
        expect(rows[0]).toMatchObject({ grouped: true, total: 21 });
        expect(rows[0].tiers.S).toBe(3);
        expect(rows[1]).toMatchObject({ grouped: false, total: 5 });
    });
    it("lists every level on its own row when expanded", () => {
        const rows = profileLevelRows(levels, "all", true);
        expect(rows.map((item) => item.label)).toEqual([
            "1",
            "3",
            "9",
            "12",
            "REAL 1",
            "REAL 3",
        ]);
        expect(rows.every((item) => !item.grouped)).toBe(true);
        expect(rows[1]).toMatchObject({ total: 13 });
    });
    it("keeps one difficulty per level when a difficulty is picked", () => {
        expect(
            profileLevelRows(levels, "hard").map((item) => item.label)
        ).toEqual(["3", "9"]);
        expect(
            profileLevelRows(levels, "real").map((item) => item.label)
        ).toEqual(["1", "3"]);
    });
});
