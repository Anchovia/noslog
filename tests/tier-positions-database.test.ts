import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// 서열표 순번을 문장 두 개로 다시 매기는 원시 SQL(2026-10-16 DB 재설계 P4)이 실제 Postgres 의
// 유일 키(목록 · 순번, 구간 · 순번)와 부딪히지 않고 1부터 빈틈없이 맞는지 본다
vi.mock("@/lib/db", async () => {
    const value = process.env.TEST_DATABASE_URL;
    if (!value) return { default: {} };
    if (!["localhost", "127.0.0.1"].includes(new URL(value).hostname))
        throw new Error("Tier position tests require a local database.");
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
vi.mock("@/lib/admin", () => ({ requireAdmin: async () => ({ id: 1 }) }));
vi.mock("next/cache", () => ({ updateTag: vi.fn(), revalidatePath: vi.fn() }));
vi.mock("next/server", () => ({ after: vi.fn() }));
vi.mock("@/features/rankings/server/player-rating-service", () => ({
    rebuildStalePlayerRatings: vi.fn(),
}));

import db from "@/lib/db";
import {
    addTierBand,
    applyTierBoardLayout,
    deleteTierBand,
    deleteTierEntry,
    moveTierEntryToBand,
} from "@/features/tiers/server/tier-admin-service";

const form = (values: Record<string, string | number>) => {
    const data = new FormData();
    for (const [key, value] of Object.entries(values))
        data.set(key, String(value));
    return data;
};

describe.skipIf(!process.env.TEST_DATABASE_URL)(
    "서열표 순번 다시 매기기",
    () => {
        const musicIndex = `tier-positions-${Date.now()}`;
        let tierListId = 0;
        let high = 0;
        let low = 0;
        const entries: number[] = [];

        const bandPositions = async () =>
            (
                await db.tierBand.findMany({
                    where: { tierListId },
                    orderBy: { position: "asc" },
                    select: { value: true, position: true },
                })
            ).map((band) => [band.value, band.position]);
        const entryPositions = async (tierBandId: number) =>
            (
                await db.tierEntry.findMany({
                    where: { tierBandId },
                    orderBy: { position: "asc" },
                    select: { id: true, position: true },
                })
            ).map((entry) => [entry.id, entry.position]);

        beforeAll(async () => {
            await db.music.create({
                data: {
                    index: musicIndex,
                    title: "T",
                    titleKana: "T",
                    category: "C",
                    categoryShort: "C",
                    charts: {
                        create: (
                            ["Normal", "Hard", "Expert", "Real"] as const
                        ).map((difficulty, index) => ({
                            difficulty,
                            level: index + 1,
                        })),
                    },
                },
            });
            const charts = await db.musicChart.findMany({
                where: { musicIdx: musicIndex },
                orderBy: { level: "asc" },
            });
            const list = await db.tierList.create({
                // 지금 쓰는 서열표(Basic S, 초안) — 보관 서열표는 고칠 수 없다(2026-10-16)
                data: {
                    slug: musicIndex,
                    title: "T",
                    mode: "basic",
                    goal: "s",
                },
            });
            tierListId = list.id;
            high = (
                await db.tierBand.create({
                    data: { tierListId, value: 12.5, position: 1 },
                })
            ).id;
            low = (
                await db.tierBand.create({
                    data: { tierListId, value: 12.0, position: 2 },
                })
            ).id;
            for (const [index, chart] of charts.entries())
                entries.push(
                    (
                        await db.tierEntry.create({
                            data: {
                                tierListId,
                                tierBandId: high,
                                chartId: chart.id,
                                position: index + 1,
                            },
                        })
                    ).id
                );
        });

        afterAll(async () => {
            await db.tierPlacementHistory.deleteMany({ where: { tierListId } });
            await db.tierEntry.deleteMany({ where: { tierListId } });
            await db.tierList.delete({ where: { id: tierListId } });
            await db.music.delete({ where: { index: musicIndex } });
            await db.$disconnect();
        });

        it("inserts a band between others and shifts the rest", async () => {
            expect(
                (await addTierBand(form({ tierListId, value: 12.3 }))).success
            ).toBe(true);
            expect(await bandPositions()).toEqual([
                [12.5, 1],
                [12.3, 2],
                [12.0, 3],
            ]);
        });

        it("moves an entry to another band and closes the gap", async () => {
            expect(
                (
                    await moveTierEntryToBand(
                        form({ entryId: entries[1], tierBandId: low })
                    )
                ).success
            ).toBe(true);
            expect(await entryPositions(high)).toEqual([
                [entries[0], 1],
                [entries[2], 2],
                [entries[3], 3],
            ]);
            expect(await entryPositions(low)).toEqual([[entries[1], 1]]);
        });

        it("applies a reordered board in one go", async () => {
            expect(
                (
                    await applyTierBoardLayout(tierListId, [
                        { id: entries[3], tierBandId: high, position: 1 },
                        { id: entries[0], tierBandId: high, position: 2 },
                        { id: entries[2], tierBandId: low, position: 1 },
                        { id: entries[1], tierBandId: low, position: 2 },
                    ])
                ).success
            ).toBe(true);
            expect(await entryPositions(high)).toEqual([
                [entries[3], 1],
                [entries[0], 2],
            ]);
            expect(await entryPositions(low)).toEqual([
                [entries[2], 1],
                [entries[1], 2],
            ]);
        });

        it("removes an entry and a band, renumbering what is left", async () => {
            expect(
                (await deleteTierEntry(form({ id: entries[3] }))).success
            ).toBe(true);
            expect(await entryPositions(high)).toEqual([[entries[0], 1]]);
            const middle = await db.tierBand.findFirstOrThrow({
                where: { tierListId, value: 12.3 },
            });
            expect(
                (await deleteTierBand(form({ id: middle.id }))).success
            ).toBe(true);
            expect(await bandPositions()).toEqual([
                [12.5, 1],
                [12.0, 2],
            ]);
        });
    }
);
