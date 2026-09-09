import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    listFindFirst: vi.fn(),
    listCreate: vi.fn(),
    listUpdate: vi.fn(),
    listDelete: vi.fn(),
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
        tierList: {
            findFirst: mocks.listFindFirst,
            create: mocks.listCreate,
            update: mocks.listUpdate,
            delete: mocks.listDelete,
        },
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
    createTierList,
    moveTierEntryToBand,
    searchTierCharts,
} from "@/app/admin/tiers/actions";

describe("관리자 서열표 액션", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.listFindFirst.mockResolvedValue(null);
        mocks.listCreate.mockResolvedValue({ id: 5 });
        mocks.listUpdate.mockResolvedValue({ id: 5 });
        mocks.listDelete.mockResolvedValue({ id: 5 });
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

    it("서열표 입력 오류를 필드 오류로 반환한다", async () => {
        const formData = new FormData();
        formData.set("slug", "---");
        formData.set("title", " ");
        formData.set("mode", "basic");
        formData.set("goal", "s");
        formData.set("description", "");
        formData.set("status", "draft");

        await expect(createTierList(formData)).resolves.toMatchObject({
            success: false,
            fieldErrors: {
                slug: ["식별자에는 영문 소문자나 숫자가 필요합니다."],
                title: ["서열표 이름을 입력해주세요."],
            },
        });
        expect(mocks.listCreate).not.toHaveBeenCalled();
    });

    it("중복 식별자를 저장하지 않고 명시적인 오류를 반환한다", async () => {
        mocks.listFindFirst.mockResolvedValue({ slug: "basic-s" });
        const formData = new FormData();
        formData.set("slug", "basic-s");
        formData.set("title", "Basic S");
        formData.set("mode", "basic");
        formData.set("goal", "s");
        formData.set("description", "");
        formData.set("status", "draft");

        await expect(createTierList(formData)).resolves.toEqual({
            success: false,
            message: "이미 사용 중인 식별자입니다.",
            fieldErrors: {
                slug: ["이미 사용 중인 식별자입니다."],
            },
        });
        expect(mocks.listCreate).not.toHaveBeenCalled();
    });

    it("검증한 서열표를 생성하고 새 식별자를 반환한다", async () => {
        const formData = new FormData();
        formData.set("slug", " Basic-S ");
        formData.set("title", " Basic S ");
        formData.set("mode", "basic");
        formData.set("goal", "s");
        formData.set("description", " ");
        formData.set("status", "draft");

        await expect(createTierList(formData)).resolves.toEqual({
            success: true,
            message: "서열표를 생성했습니다.",
            id: 5,
        });
        expect(mocks.listCreate).toHaveBeenCalledWith({
            data: {
                slug: "basic-s",
                title: "Basic S",
                mode: "basic",
                goal: "s",
                description: null,
                status: "draft",
            },
        });
    });

    it("같은 서열 상수 구간을 중복 추가하지 않는다", async () => {
        mocks.bandFindMany.mockResolvedValue([{ id: 10, value: 12.3 }]);
        const formData = new FormData();
        formData.set("tierListId", "5");
        formData.set("value", "12.3");

        await expect(addTierBand(formData)).resolves.toEqual({
            success: false,
            message: "같은 서열 상수 구간이 이미 있습니다.",
        });

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

        await expect(addTierBand(formData)).resolves.toEqual({
            success: true,
            message: "서열 상수 구간을 추가했습니다.",
        });

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
        expect(mocks.updateTag).toHaveBeenCalledWith("user-rankings");
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
