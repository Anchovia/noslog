import { describe, expect, it } from "vitest";

import { groupPins } from "@/features/music/components/scorePins";
import type { ChartScorePlayer } from "@/features/music/schemas/chartRankingSchema";

const player = (id: number, score: number): ChartScorePlayer => ({
    position: id,
    row_number: id,
    rank: "S",
    score,
    fc_type: 0,
    user_id: id,
    user: { id, username: `p${id}`, avatar: null, country: "ko-KR" },
});

describe("groupPins", () => {
    // 1점 = 1px 로 계산
    const x = (score: number) => score - 900_000;

    it("groups close players under the highest score", () => {
        const groups = groupPins(
            [player(3, 990_010), player(1, 990_030), player(2, 990_020)],
            null,
            x
        );
        expect(groups).toHaveLength(1);
        expect(groups[0].players.map((entry) => entry.user_id)).toEqual([
            1, 2, 3,
        ]);
    });

    it("keeps far players and me apart", () => {
        const groups = groupPins(
            [player(1, 990_030), player(2, 990_020), player(3, 990_100)],
            2,
            x
        );
        expect(groups.map((group) => group.players.length)).toEqual([1, 1, 1]);
        expect(groups.find((group) => group.me)?.key).toBe("2");
    });
});
