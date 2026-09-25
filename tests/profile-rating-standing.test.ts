import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    users: vi.fn(),
    records: vi.fn(),
    basis: vi.fn(),
}));
vi.mock("next/cache", () => ({
    unstable_cache: (callback: unknown) => callback,
}));
vi.mock("@/lib/db", () => ({
    default: {
        user: { findMany: mocks.users },
        playData: { findMany: mocks.records },
    },
}));
vi.mock("@/features/tiers/server/tierBrowserData", () => ({
    getModePianistRatingBasis: mocks.basis,
}));
vi.mock("@/features/contributions/server/contributionPointService", () => ({
    getNameLabels: async () => new Map(),
}));

import { getProfileRatingStanding } from "@/features/rankings/server/globalRankingData";

const player = (id: number, country: string, hidden = false) => ({
    id,
    username: `P${id}`,
    avatar: null,
    country,
    grade_basic: 500_000,
    grade_recital: null,
    hide_play_scores: hidden,
    examAchievements: [],
});

describe("profile rating standing (2026-09-26 T1)", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mocks.basis.mockResolvedValue({
            entries: [1, 2, 3].map((chartId) => ({ chartId, value: 14 })),
            theoreticalMax: 3 * 14 ** 2,
        });
        mocks.users.mockResolvedValue([
            player(1, "ko-KR"),
            player(2, "ja-JP"),
            player(3, "ko-KR", true),
            player(4, "ko-KR"),
        ]);
        // 높은 점수일수록 레이팅이 높다: 2 > 3(비공개) > 1 > 4
        const score = { 1: 990000, 2: 1000000, 3: 995000, 4: 980000 } as const;
        mocks.records.mockResolvedValue(
            [1, 2, 3, 4].flatMap((user_id) =>
                [1, 2, 3].map((chart_id) => ({
                    user_id,
                    chart_id,
                    score: score[user_id as 1 | 2 | 3 | 4],
                }))
            )
        );
    });
    it("ranks among other players who show scores, world and same country", async () => {
        const standing = await getProfileRatingStanding(1, "basic", "ko-KR");
        expect(standing?.world).toBe(2);
        expect(standing?.country).toBe(1);
        expect(standing?.value).toBeGreaterThan(0);
    });
    it("returns null when the player has no rating", async () => {
        expect(await getProfileRatingStanding(9, "basic", "ko-KR")).toBeNull();
    });
});
