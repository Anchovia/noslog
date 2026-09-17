import { describe, expect, it } from "vitest";

import { groupPins } from "@/features/music/components/scorePins";
import { scoreDomainMin } from "@/features/music/components/scoreScatter";
import type { ChartScorePlayer } from "@/features/music/schemas/chartRankingSchema";

const player = (score: number, user_id: number): ChartScorePlayer => ({
    position: user_id,
    row_number: user_id,
    user_id,
    rank: "S",
    score,
    fc_type: 0,
    user: { id: user_id, username: `P${user_id}`, avatar: null, country: "KR" },
});

describe("score ruler", () => {
    it("starts the axis at 925k, narrower on phones, lower for low scores", () => {
        expect(scoreDomainMin([990_000], 340)).toBe(925_000);
        expect(scoreDomainMin([990_000], 256)).toBe(935_000);
        expect(scoreDomainMin([], 256)).toBe(935_000);
        const low = [
            ...Array.from({ length: 19 }, () => 990_000),
            812_345,
            812_345,
        ];
        expect(scoreDomainMin(low, 340)).toBe(810_000);
    });
    it("groups photo pins so that neighbours are one pin apart", () => {
        // 폭 310 · 910k~100만 자에 실제 한 채보(11명)를 얹은 자리
        const scores = [
            1_000_000, 998_420, 995_310, 992_870, 988_200, 983_640, 976_654,
            972_150, 961_480, 947_320, 912_050,
        ];
        const players = scores.map((score, index) => player(score, index + 1));
        const x = (score: number) => ((score - 910_000) / 90_000) * 310;
        const groups = groupPins(players, null, x);
        const gaps = groups
            .map((group) => group.x)
            .sort((a, b) => a - b)
            .map((at, index, all) => (index ? at - all[index - 1] : Infinity));
        // 사진끼리 붙지 않게 — 남은 핀 사이는 늘 한 핀 폭 넘게 떨어진다 (2026-09-18 사용자 결정)
        expect(Math.min(...gaps.slice(1))).toBeGreaterThanOrEqual(52);
        // 묶인 사람도 「+N」 안에 그대로 남는다
        expect(
            groups.reduce((sum, group) => sum + group.players.length, 0)
        ).toBe(scores.length);
    });
    it("never lets my photo overlap another, and keeps me as the pin", () => {
        const players = [player(995_000, 1), player(994_900, 2)];
        const x = (score: number) => ((score - 910_000) / 90_000) * 310;
        const [group, ...rest] = groupPins(players, 2, x);
        // 사진이 겹치느니 하나로 묶는다 — 대표는 나, 옆 사람은 「+1」 안에 (2026-09-18)
        expect(rest).toHaveLength(0);
        expect(group.me).toBe(true);
        expect(group.players[0].user_id).toBe(2);
        expect(group.players).toHaveLength(2);
    });
    it("keeps every pin one pin apart, mine included", () => {
        const scores = [
            1_000_000, 998_420, 995_310, 992_870, 988_200, 983_640, 976_654,
            972_150, 961_480, 947_320, 912_050,
        ];
        const players = scores.map((score, index) => player(score, index + 1));
        const x = (score: number) => ((score - 910_000) / 90_000) * 310;
        for (const meId of players.map((entry) => entry.user_id)) {
            const at = groupPins(players, meId, x)
                .map((group) => group.x)
                .sort((a, b) => a - b);
            const gaps = at.slice(1).map((value, index) => value - at[index]);
            expect(Math.min(...gaps)).toBeGreaterThanOrEqual(52);
        }
    });
});
