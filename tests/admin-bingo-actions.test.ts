import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    musicCount: vi.fn(),
    transaction: vi.fn(),
    bingoCreate: vi.fn(),
    bingoUpdate: vi.fn(),
    cellUpsert: vi.fn(),
    updateTag: vi.fn(),
    revalidatePath: vi.fn(),
    redirect: vi.fn(),
}));

const transactionClient = {
    bingo: {
        create: mocks.bingoCreate,
        update: mocks.bingoUpdate,
    },
    bingoCell: { upsert: mocks.cellUpsert },
};

vi.mock("@/lib/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/db", () => ({
    default: {
        $transaction: mocks.transaction,
        music: { count: mocks.musicCount },
    },
}));
vi.mock("next/cache", () => ({
    updateTag: mocks.updateTag,
    revalidatePath: mocks.revalidatePath,
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import { saveBingo } from "@/app/admin/bingos/actions";

function createBingoFormData() {
    const formData = new FormData();
    formData.set("title", "테스트 빙고");
    formData.set("coverMusicIndex", "cover-music");
    formData.set("rewardNos", "3000");
    formData.set("requiredLines", "5");
    formData.set("status", "published");
    return formData;
}

describe("관리자 빙고 저장 액션", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.musicCount.mockResolvedValue(1);
        mocks.bingoCreate.mockResolvedValue({ id: 40 });
        mocks.bingoUpdate.mockResolvedValue({ id: 40 });
        mocks.cellUpsert.mockResolvedValue({ id: 1 });
        mocks.transaction.mockImplementation((callback) =>
            callback(transactionClient)
        );
    });

    it("관리자가 아니면 빙고를 저장하지 않는다", async () => {
        mocks.requireAdmin.mockRejectedValue(new Error("forbidden"));

        await expect(saveBingo(createBingoFormData())).rejects.toThrow(
            "forbidden"
        );
        expect(mocks.musicCount).not.toHaveBeenCalled();
        expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("제목이나 표지 악곡이 비어 있으면 DB를 조회하지 않는다", async () => {
        const formData = createBingoFormData();
        formData.set("title", "");

        await saveBingo(formData);

        expect(mocks.musicCount).not.toHaveBeenCalled();
        expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("존재하지 않는 표지 악곡을 거부한다", async () => {
        mocks.musicCount.mockResolvedValue(0);

        await saveBingo(createBingoFormData());

        expect(mocks.musicCount).toHaveBeenCalledWith({
            where: { index: "cover-music" },
        });
        expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("새 빙고와 기본 25칸을 같은 트랜잭션으로 생성한다", async () => {
        const formData = createBingoFormData();
        formData.set("cell-1-title", "첫 미션");
        formData.set("cell-1-ruleType", "score");
        formData.set("cell-1-ruleConfig", '{"score":950000}');

        await saveBingo(formData);

        expect(mocks.bingoCreate).toHaveBeenCalledWith({
            data: expect.objectContaining({
                title: "테스트 빙고",
                coverMusicIndex: "cover-music",
                rewardNos: 3000,
                requiredLines: 5,
                status: "published",
            }),
        });
        expect(mocks.cellUpsert).toHaveBeenCalledTimes(25);
        expect(mocks.cellUpsert).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                where: { bingoId_position: { bingoId: 40, position: 1 } },
                create: expect.objectContaining({
                    bingoId: 40,
                    title: "첫 미션",
                    ruleType: "score",
                    ruleConfig: { score: 950000 },
                }),
            })
        );
        expect(mocks.cellUpsert).toHaveBeenNthCalledWith(
            25,
            expect.objectContaining({
                where: { bingoId_position: { bingoId: 40, position: 25 } },
                create: expect.objectContaining({ title: "E5" }),
            })
        );
        expect(mocks.updateTag).toHaveBeenCalledWith("bingos");
        expect(mocks.redirect).toHaveBeenCalledWith("/admin/bingos/40");
    });

    it("보상은 음수가 되지 않고 필요 줄 수는 1~12로 제한한다", async () => {
        const formData = createBingoFormData();
        formData.set("rewardNos", "-100");
        formData.set("requiredLines", "99");

        await saveBingo(formData);

        expect(mocks.bingoCreate).toHaveBeenCalledWith({
            data: expect.objectContaining({ rewardNos: 0, requiredLines: 12 }),
        });
    });

    it("기존 빙고는 수정하고 새 상세 페이지로 이동하지 않는다", async () => {
        const formData = createBingoFormData();
        formData.set("id", "40");

        await saveBingo(formData);

        expect(mocks.bingoUpdate).toHaveBeenCalledWith({
            where: { id: 40 },
            data: expect.objectContaining({ title: "테스트 빙고" }),
        });
        expect(mocks.bingoCreate).not.toHaveBeenCalled();
        expect(mocks.redirect).not.toHaveBeenCalled();
    });
});
