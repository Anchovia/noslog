import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    users: vi.fn(),
    records: vi.fn(),
    basis: vi.fn(),
    // 레이팅 저장 표(2026-10-15 L2-A2) — 랭킹이 비어 있으면 기록에서 다시 세어 채운다
    ratings: [] as { userId: number; mode: string }[],
}));
vi.mock("next/cache", () => ({
    unstable_cache: (callback: unknown) => callback,
}));
vi.mock("@/lib/db", () => {
    const db = {
        user: { findMany: mocks.users },
        playData: { findMany: mocks.records },
        playerRating: {
            findMany: async ({ where }: { where: { mode: string } }) => {
                const users: { id: number }[] = (await mocks.users()) ?? [];
                return mocks.ratings
                    .filter((row) => row.mode === where.mode)
                    .flatMap((row) => {
                        const user = users.find((u) => u.id === row.userId);
                        return user ? [{ ...row, user }] : [];
                    });
            },
            deleteMany: async ({ where }: { where: { mode: string } }) => {
                mocks.ratings = mocks.ratings.filter(
                    (row) => row.mode !== where.mode
                );
            },
            createMany: async ({
                data,
            }: {
                data: { userId: number; mode: string }[];
            }) => {
                mocks.ratings.push(...data);
            },
        },
        $executeRaw: async () => 0,
        $transaction: async (callback: (tx: unknown) => unknown) =>
            callback(db),
    };
    return { default: db };
});
vi.mock("@/features/tiers/server/tier-browser-data", () => ({
    getModePianistRatingBasis: mocks.basis,
}));
vi.mock("@/features/contributions/server/contribution-point-service", () => ({
    getNameLabels: async () => new Map(),
}));

import { getProfileRatingStanding } from "@/features/rankings/server/global-ranking-data";

const player = (id: number, country: string, hidden = false) => ({
    id,
    username: `P${id}`,
    avatar: null,
    country,
    gradeBasic: 500_000,
    gradeRecital: null,
    hidePlayScores: hidden,
    examAchievements: [],
});

describe("profile rating standing (2026-09-26 T1)", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mocks.ratings = [];
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
            [1, 2, 3, 4].flatMap((userId) =>
                [1, 2, 3].map((chartId) => ({
                    userId,
                    chartId,
                    score: score[userId as 1 | 2 | 3 | 4],
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
