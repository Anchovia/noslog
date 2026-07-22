import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    chartFindMany: vi.fn(),
    chartFindUnique: vi.fn(),
    bandFindFirst: vi.fn(),
    bandFindUnique: vi.fn(),
    bandFindMany: vi.fn(),
    bandCount: vi.fn(),
    bandCreate: vi.fn(),
    bandUpdate: vi.fn(),
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
            findUnique: mocks.bandFindUnique,
            findMany: mocks.bandFindMany,
            count: mocks.bandCount,
            create: mocks.bandCreate,
            update: mocks.bandUpdate,
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
    applyTierBoardLayout,
    moveTierEntryToBand,
    searchTierCharts,
} from "@/app/admin/tiers/actions";

describe("관리자 서열표 액션", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.chartFindMany.mockResolvedValue([]);
        mocks.chartFindUnique.mockResolvedValue({ id: 20 });
        mocks.bandFindFirst.mockResolvedValue({ value: 12 });
        mocks.bandFindUnique.mockResolvedValue({
            id: 11,
            tierListId: 5,
            value: 12.4,
        });
        mocks.bandFindMany.mockResolvedValue([]);
        mocks.bandCount.mockResolvedValue(0);
        mocks.bandCreate.mockResolvedValue({ id: 10 });
        mocks.bandUpdate.mockResolvedValue({ id: 10 });
        mocks.entryCount.mockResolvedValue(0);
        mocks.entryFindFirst.mockResolvedValue({ position: 2 });
        mocks.entryFindUnique.mockResolvedValue({
            id: 1,
            tierListId: 5,
            tierBandId: 10,
            chartId: 20,
        });
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
        mocks.bandFindMany.mockResolvedValue([{ id: 10, value: 12.3 }]);
        const formData = new FormData();
        formData.set("tierListId", "5");
        formData.set("value", "12.3");

        await addTierBand(formData);

        expect(mocks.bandCreate).not.toHaveBeenCalled();
        expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("서열 상수 구간을 콜백형 트랜잭션 없이 일괄 추가한다", async () => {
        mocks.bandFindMany.mockResolvedValue([
            { id: 10, value: 12.0 },
            { id: 11, value: 11.3 },
        ]);
        const formData = new FormData();
        formData.set("tierListId", "5");
        formData.set("value", "11.4");

        await addTierBand(formData);

        expect(mocks.bandCreate).toHaveBeenCalledWith({
            data: { tierListId: 5, value: 11.4, position: 2 },
        });
        expect(mocks.bandUpdate).toHaveBeenCalledWith({
            where: { id: 10 },
            data: { position: -10 },
        });
        expect(mocks.bandUpdate).toHaveBeenCalledWith({
            where: { id: 11 },
            data: { position: 3 },
        });
        expect(Array.isArray(mocks.transaction.mock.calls[0]?.[0])).toBe(true);
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

    it("변경한 전체 배치를 한 번에 저장하고 구간 이동 이력을 남긴다", async () => {
        mocks.bandFindMany.mockResolvedValue([
            { id: 10, value: 12.3 },
            { id: 11, value: 12.4 },
        ]);
        mocks.entryFindMany.mockResolvedValue([
            { id: 1, chartId: 20, tierBandId: 10, position: 1 },
            { id: 2, chartId: 21, tierBandId: 10, position: 2 },
            { id: 3, chartId: 22, tierBandId: 11, position: 1 },
        ]);

        await applyTierBoardLayout(5, [
            { id: 2, tierBandId: 10, position: 1 },
            { id: 3, tierBandId: 11, position: 1 },
            { id: 1, tierBandId: 11, position: 2 },
        ]);

        expect(mocks.txEntryUpdate).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { position: -1 },
        });
        expect(mocks.txEntryUpdate).toHaveBeenCalledWith({
            where: { id: 2 },
            data: { position: -2 },
        });
        expect(mocks.txEntryUpdate).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { tierBandId: 11, position: 2 },
        });
        expect(mocks.historyCreate).toHaveBeenCalledWith({
            data: { tierListId: 5, chartId: 20, bandValue: 12.4 },
        });
    });

    it("통합 서열표 채보를 새 상수 구간으로 옮기고 이력을 남긴다", async () => {
        mocks.entryFindMany.mockResolvedValue([{ id: 2 }, { id: 3 }]);
        mocks.entryFindFirst.mockResolvedValue({ position: 4 });
        const formData = new FormData();
        formData.set("entryId", "1");
        formData.set("tierBandId", "11");

        await moveTierEntryToBand(formData);

        expect(mocks.txEntryUpdate).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { tierBandId: 11, position: 5 },
        });
        expect(mocks.historyCreate).toHaveBeenCalledWith({
            data: { tierListId: 5, chartId: 20, bandValue: 12.4 },
        });
        expect(mocks.updateTag).toHaveBeenCalledWith("tier-lists");
    });
});
