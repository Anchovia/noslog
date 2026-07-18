import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    chartFindMany: vi.fn(),
    chartFindUnique: vi.fn(),
    bandFindFirst: vi.fn(),
    bandCount: vi.fn(),
    entryCount: vi.fn(),
    entryFindFirst: vi.fn(),
    entryFindUnique: vi.fn(),
    entryFindMany: vi.fn(),
    entryCreate: vi.fn(),
    historyCreate: vi.fn(),
    transaction: vi.fn(),
    txEntryUpdate: vi.fn(),
    txHistoryCreate: vi.fn(),
    updateTag: vi.fn(),
    revalidatePath: vi.fn(),
    redirect: vi.fn(),
}));

const transactionClient = {
    tierEntry: {
        update: mocks.txEntryUpdate,
    },
    tierPlacementHistory: {
        create: mocks.txHistoryCreate,
    },
};

vi.mock("@/lib/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/db", () => ({
    default: {
        $transaction: mocks.transaction,
        musicChart: {
            findMany: mocks.chartFindMany,
            findUnique: mocks.chartFindUnique,
        },
        tierBand: {
            findFirst: mocks.bandFindFirst,
            count: mocks.bandCount,
        },
        tierEntry: {
            count: mocks.entryCount,
            findFirst: mocks.entryFindFirst,
            findUnique: mocks.entryFindUnique,
            findMany: mocks.entryFindMany,
            create: mocks.entryCreate,
            update: mocks.txEntryUpdate,
        },
        tierPlacementHistory: { create: mocks.historyCreate },
    },
}));
vi.mock("next/cache", () => ({
    updateTag: mocks.updateTag,
    revalidatePath: mocks.revalidatePath,
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import {
    addTierBand,
    addTierEntry,
    moveTierEntryByDrop,
    searchTierCharts,
} from "@/app/admin/tiers/actions";

describe("관리자 서열표 액션", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.chartFindMany.mockResolvedValue([]);
        mocks.chartFindUnique.mockResolvedValue({ id: 20 });
        mocks.bandFindFirst.mockResolvedValue({ value: 12 });
        mocks.bandCount.mockResolvedValue(0);
        mocks.entryCount.mockResolvedValue(0);
        mocks.entryFindFirst.mockResolvedValue({ position: 2 });
        mocks.entryCreate.mockResolvedValue({ id: 1 });
        mocks.historyCreate.mockResolvedValue({ id: 1 });
        mocks.txEntryUpdate.mockResolvedValue({ id: 1 });
        mocks.txHistoryCreate.mockResolvedValue({ id: 1 });
        mocks.transaction.mockImplementation((input) => {
            if (typeof input === "function") {
                return input(transactionClient);
            }
            return Promise.all(input);
        });
    });

    it("관리자가 아니면 채보 검색도 실행하지 않는다", async () => {
        mocks.requireAdmin.mockRejectedValue(new Error("forbidden"));

        await expect(searchTierCharts("Altale", 1)).rejects.toThrow(
            "forbidden"
        );
        expect(mocks.chartFindMany).not.toHaveBeenCalled();
    });

    it("제목·아티스트·식별자를 대소문자 없이 검색한다", async () => {
        mocks.chartFindMany.mockResolvedValue([
            {
                id: 20,
                difficulty: "Expert",
                level: 11,
                music: {
                    index: "altale-index",
                    title: "Altale",
                    artist: "削除",
                    background: null,
                },
            },
        ]);

        await expect(searchTierCharts("  ALT  ", 5)).resolves.toEqual([
            expect.objectContaining({
                id: 20,
                title: "Altale",
                jacket: "https://p.eagate.573.jp/game/nostalgia/op3/img/jacket.html?c=altale-index",
            }),
        ]);
        expect(mocks.chartFindMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    tierEntries: { none: { tierListId: 5 } },
                    music: {
                        OR: [
                            {
                                title: {
                                    contains: "ALT",
                                    mode: "insensitive",
                                },
                            },
                            {
                                artist: {
                                    contains: "ALT",
                                    mode: "insensitive",
                                },
                            },
                            {
                                index: {
                                    contains: "ALT",
                                    mode: "insensitive",
                                },
                            },
                        ],
                    },
                }),
            })
        );
    });

    it("같은 서열 상수 구간을 중복 추가하지 않는다", async () => {
        mocks.bandCount.mockResolvedValue(1);
        const formData = new FormData();
        formData.set("tierListId", "5");
        formData.set("value", "12.3");

        await addTierBand(formData);

        expect(mocks.bandCount).toHaveBeenCalledWith({
            where: { tierListId: 5, value: 12.3 },
        });
        expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("이미 서열표에 포함된 채보는 다른 구간에도 추가하지 않는다", async () => {
        mocks.entryCount.mockResolvedValue(1);
        const formData = new FormData();
        formData.set("tierListId", "5");
        formData.set("tierBandId", "10");
        formData.set("chartId", "20");

        await addTierEntry(formData);

        expect(mocks.entryCreate).not.toHaveBeenCalled();
        expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("채보 추가와 배치 이력을 원자적으로 저장한다", async () => {
        const formData = new FormData();
        formData.set("tierListId", "5");
        formData.set("tierBandId", "10");
        formData.set("chartId", "20");

        await addTierEntry(formData);

        expect(mocks.entryCreate).toHaveBeenCalledWith({
            data: {
                tierListId: 5,
                tierBandId: 10,
                chartId: 20,
                position: 3,
            },
        });
        expect(mocks.historyCreate).toHaveBeenCalledWith({
            data: { tierListId: 5, chartId: 20, bandValue: 12 },
        });
        expect(mocks.transaction).toHaveBeenCalledWith([
            expect.any(Promise),
            expect.any(Promise),
        ]);
        expect(mocks.updateTag).toHaveBeenCalledWith("tier-lists");
    });

    it("다른 구간으로 드롭하면 양쪽 순서를 정리하고 이력을 남긴다", async () => {
        mocks.entryFindUnique.mockResolvedValue({
            id: 1,
            tierListId: 5,
            tierBandId: 10,
            chartId: 20,
        });
        mocks.bandFindFirst.mockResolvedValue({ value: 12.4 });
        mocks.entryFindMany.mockResolvedValue([
            { id: 1, tierBandId: 10 },
            { id: 2, tierBandId: 10 },
            { id: 3, tierBandId: 11 },
        ]);

        await moveTierEntryByDrop(1, 11, 1);

        expect(mocks.txEntryUpdate).toHaveBeenCalledWith({
            where: { id: 2 },
            data: { tierBandId: 10, position: 1 },
        });
        expect(mocks.txEntryUpdate).toHaveBeenCalledWith({
            where: { id: 3 },
            data: { tierBandId: 11, position: 1 },
        });
        expect(mocks.txEntryUpdate).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { tierBandId: 11, position: 2 },
        });
        expect(mocks.historyCreate).toHaveBeenCalledWith({
            data: { tierListId: 5, chartId: 20, bandValue: 12.4 },
        });
    });
});
