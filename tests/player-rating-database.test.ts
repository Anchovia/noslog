import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";
vi.mock("@/lib/db", async () => {
    const value = process.env.TEST_DATABASE_URL;
    if (!value) return { default: {} };
    const url = new URL(value);
    if (!["localhost", "127.0.0.1"].includes(url.hostname))
        throw new Error(
            "Player rating integration tests require a local database."
        );
    const { PrismaClient } = await import("@prisma/client");
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const { PRISMA_PG_SESSION_OPTIONS } = await import("@/lib/prisma-pg");
    return {
        default: new PrismaClient({
            adapter: new PrismaPg({
                connectionString: value,
                options: PRISMA_PG_SESSION_OPTIONS,
            }),
        }),
    };
});
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
const basis = vi.hoisted(() => ({ value: 14, chartIds: [] as number[] }));
vi.mock("@/features/tiers/server/tier-browser-data", () => ({
    getModePianistRatingBasis: async () => ({
        entries: basis.chartIds.map((chartId: number) => ({
            chartId,
            value: basis.value,
        })),
        theoreticalMax: basis.chartIds.length * basis.value ** 2,
    }),
}));

import db from "@/lib/db";
import {
    calculateUserRating,
    rebuildPlayerRatings,
    getRatingBasis,
    rebuildStalePlayerRatings,
    refreshUserPlayerRatings,
} from "@/features/rankings/server/player-rating-service";
import {
    BASIC_RATING_ACTIVE_CURVE,
    BASIC_RATING_TOP_COUNT,
    calculateBasicRating,
} from "@/lib/tiers/basic-rating";
import type { TierMode } from "@/lib/tiers";
import { TIER_DIFFICULTIES } from "@/lib/tiers";

// 레이팅 저장 표(2026-10-15 L2-A2) — 저장 값이 예전 집계(그 자리에서 모든 기록으로 계산)와 같은지 실제 Postgres 로 본다
describe.skipIf(!process.env.TEST_DATABASE_URL)(
    "player ratings on isolated PostgreSQL",
    () => {
        const musicIndex = `rating-test-${Date.now()}`;
        const userIds: number[] = [];
        const chartIds: number[] = [];
        // 사람마다 점수: 0 = 높음, 1 = 중간(Recital 기록 없음), 2 = 바닥 아래(레이팅 0)
        const scores = [1_000_000, 980_000, 940_000];

        const record = (
            userId: number,
            chartId: number,
            score: number,
            recital: number | null
        ) => ({
            userId: userId,
            chartId: chartId,
            level: 12,
            score,
            rank: "S",
            fcType: 0,
            playCount: 1,
            fullcomboCount: 0,
            pianisticCount: 0,
            maxCombo: 1000,
            gradeBasic: 10000,
            gradeRecital: recital,
            bestAt: new Date("2026-10-15T01:00:00Z"),
        });
        // 비교 기준 — 예전 global-ranking-data 가 하던 계산을 그대로
        const expected = (score: number) =>
            calculateBasicRating(
                chartIds.map((chartId) => ({
                    chartId,
                    score,
                    tierConstant: basis.value,
                })),
                chartIds.length * basis.value ** 2,
                BASIC_RATING_ACTIVE_CURVE
            );
        const stored = (mode: TierMode) =>
            db.playerRating.findMany({
                where: { mode, userId: { in: userIds } },
                orderBy: { userId: "asc" },
            });

        beforeAll(async () => {
            // 난이도는 enum(곡마다 4개) — 기준표 채보 수만큼 곡을 나눠 만든다(2026-10-16 D4-C 2차)
            const groups = Math.ceil(
                BASIC_RATING_TOP_COUNT / TIER_DIFFICULTIES.length
            );
            await db.music.createMany({
                data: Array.from({ length: groups }, (_, group) => ({
                    index: `${musicIndex}-${group}`,
                    title: "Test",
                    titleKana: "Test",
                    category: "Test",
                    categoryShort: "T",
                })),
            });
            for (let index = 0; index < BASIC_RATING_TOP_COUNT; index += 1) {
                chartIds.push(
                    (
                        await db.musicChart.create({
                            data: {
                                musicIdx: `${musicIndex}-${Math.floor(index / TIER_DIFFICULTIES.length)}`,
                                difficulty:
                                    TIER_DIFFICULTIES[
                                        index % TIER_DIFFICULTIES.length
                                    ],
                                level: 12,
                                noteCount: 1000,
                            },
                        })
                    ).id
                );
            }
            basis.chartIds = chartIds;
            for (const [index, score] of scores.entries()) {
                const userId = (
                    await db.user.create({
                        data: {
                            username: `${musicIndex}-${index}`,
                            hidePlayScores: false,
                        },
                    })
                ).id;
                userIds.push(userId);
                await db.playData.createMany({
                    data: chartIds.map((chartId) =>
                        record(
                            userId,
                            chartId,
                            score,
                            index === 1 ? null : 5000
                        )
                    ),
                });
            }
        });
        beforeEach(async () => {
            basis.value = 14;
            await db.playerRating.deleteMany({
                where: { userId: { in: userIds } },
            });
        });
        afterAll(async () => {
            if (userIds.length)
                await db.user.deleteMany({ where: { id: { in: userIds } } });
            await db.musicChart.deleteMany({
                where: { musicIdx: { startsWith: musicIndex } },
            });
            await db.music.deleteMany({
                where: { index: { startsWith: musicIndex } },
            });
            await db.$disconnect();
        });

        it("다시 센 값이 예전 집계와 같고, 레이팅 0 · Recital 기록 없음은 빠진다", async () => {
            for (const mode of ["basic", "recital"] as const) {
                const current = await getRatingBasis(mode);
                await rebuildPlayerRatings(mode, current!);
            }
            const basic = await stored("basic");
            expect(basic.map((row) => row.userId)).toEqual(userIds.slice(0, 2));
            for (const [index, row] of basic.entries()) {
                const result = expected(scores[index]);
                expect(row.rating).toBeCloseTo(result.rating, 9);
                expect(row.filledSlots).toBe(result.filledSlots);
            }
            const recital = await stored("recital");
            expect(recital.map((row) => row.userId)).toEqual([userIds[0]]);
            // 프로필도 같은 계산 한 벌 — 저장 값과 같고, 레이팅 0 은 「없음」(2026-10-16 K3)
            const profile = await calculateUserRating(userIds[0], "basic");
            expect(profile?.rating).toBeCloseTo(basic[0].rating, 9);
            expect(await calculateUserRating(userIds[2], "basic")).toBeNull();
            expect(await calculateUserRating(userIds[1], "recital")).toBeNull();
        });

        it("동기화 때는 그 사람 값만 바뀌고, 바닥 아래로 떨어지면 줄을 지운다", async () => {
            const current = await getRatingBasis("basic");
            await rebuildPlayerRatings("basic", current!);
            const before = await stored("basic");
            await db.playData.updateMany({
                where: { userId: userIds[1] },
                data: { score: 940_000 },
            });
            await refreshUserPlayerRatings(userIds[1]);
            const after = await stored("basic");
            expect(after).toHaveLength(1);
            expect(after[0]).toMatchObject({
                userId: userIds[0],
                rating: before[0].rating,
            });
            await db.playData.updateMany({
                where: { userId: userIds[1] },
                data: { score: scores[1] },
            });
            await refreshUserPlayerRatings(userIds[1]);
            expect(await stored("basic")).toHaveLength(2);
        });

        it("서열 상수가 바뀐 모드만 다시 센다", async () => {
            for (const mode of ["basic", "recital"] as const)
                await rebuildPlayerRatings(mode, (await getRatingBasis(mode))!);
            const before = await stored("basic");
            // 기준 그대로면 다시 쓰지 않는다
            await rebuildStalePlayerRatings();
            expect((await stored("basic"))[0].computedAt).toEqual(
                before[0].computedAt
            );
            basis.value = 13;
            await rebuildStalePlayerRatings();
            const changed = await stored("basic");
            expect(changed[0].basisVersion).not.toBe(before[0].basisVersion);
            expect(changed[0].rating).toBeCloseTo(
                expected(scores[0]).rating,
                9
            );
        });
    }
);
