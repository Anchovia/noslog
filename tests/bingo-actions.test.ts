import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    session: {
        id: 2 as number | undefined,
        destroy: vi.fn(),
    },
    getSessionUser: vi.fn(),
    cellFindUnique: vi.fn(),
    progressUpsert: vi.fn(),
    revalidatePath: vi.fn(),
}));

vi.mock("@/lib/user", () => ({
    getSessionUser: mocks.getSessionUser,
}));

vi.mock("@/lib/db", () => ({
    default: {
        bingoCell: { findUnique: mocks.cellFindUnique },
        bingoCellProgress: {
            upsert: mocks.progressUpsert,
        },
    },
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import { setBingoCellCompletion } from "@/app/(nevigation)/bingo/[id]/actions";

const availableCell = {
    bingoId: 5,
    bingo: { status: "published", startsAt: null, endsAt: null },
};

describe("빙고 진행 상태 액션", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.session.id = 2;
        mocks.getSessionUser.mockResolvedValue({
            session: mocks.session,
            user: { id: 2 },
        });
        mocks.cellFindUnique.mockResolvedValue(availableCell);
        mocks.progressUpsert.mockResolvedValue({ id: 10 });
    });

    it("비로그인 사용자는 진행 상태를 변경할 수 없다", async () => {
        mocks.getSessionUser.mockResolvedValue({
            session: { destroy: mocks.session.destroy },
            user: null,
        });

        await expect(setBingoCellCompletion(3, true)).resolves.toEqual({
            success: false,
            message: "로그인 후 빙고 진행 상태를 저장할 수 있습니다.",
        });
        expect(mocks.cellFindUnique).not.toHaveBeenCalled();
    });

    it("현재 DB에 없는 오래된 세션은 제거하고 저장하지 않는다", async () => {
        mocks.session.id = 99;
        mocks.getSessionUser.mockResolvedValue({
            session: mocks.session,
            user: null,
        });

        await expect(setBingoCellCompletion(3, true)).resolves.toEqual({
            success: false,
            message: "로그인 후 빙고 진행 상태를 저장할 수 있습니다.",
        });
        expect(mocks.session.destroy).toHaveBeenCalledOnce();
        expect(mocks.cellFindUnique).not.toHaveBeenCalled();
        expect(mocks.progressUpsert).not.toHaveBeenCalled();
    });

    it("잘못된 칸 ID와 완료 상태를 거부한다", async () => {
        await expect(setBingoCellCompletion(0, true)).resolves.toEqual({
            success: false,
            message: "잘못된 빙고 칸입니다.",
        });
        await expect(
            setBingoCellCompletion(3, "true" as unknown as boolean)
        ).resolves.toEqual({
            success: false,
            message: "잘못된 빙고 칸입니다.",
        });
    });

    it("비공개이거나 기간이 지난 빙고는 변경하지 않는다", async () => {
        mocks.cellFindUnique.mockResolvedValue({
            ...availableCell,
            bingo: { ...availableCell.bingo, status: "draft" },
        });

        await expect(setBingoCellCompletion(3, true)).resolves.toEqual({
            success: false,
            message: "현재 진행할 수 없는 빙고입니다.",
        });
        expect(mocks.progressUpsert).not.toHaveBeenCalled();
    });

    it("완료 요청은 사용자와 칸 조합으로 멱등 저장한다", async () => {
        await expect(setBingoCellCompletion(3, true)).resolves.toEqual({
            success: true,
            isCompleted: true,
        });

        expect(mocks.progressUpsert).toHaveBeenCalledWith({
            where: {
                userId_bingoCellId: { userId: 2, bingoCellId: 3 },
            },
            create: expect.objectContaining({
                userId: 2,
                bingoCellId: 3,
                isCompleted: true,
            }),
            update: expect.objectContaining({ isCompleted: true }),
        });
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/bingo/5");
    });

    it("완료 해제도 최근 변경 시각을 남기도록 상태를 저장한다", async () => {
        await expect(setBingoCellCompletion(3, false)).resolves.toEqual({
            success: true,
            isCompleted: false,
        });

        expect(mocks.progressUpsert).toHaveBeenCalledWith({
            where: {
                userId_bingoCellId: { userId: 2, bingoCellId: 3 },
            },
            create: expect.objectContaining({
                userId: 2,
                bingoCellId: 3,
                isCompleted: false,
                completedAt: null,
            }),
            update: expect.objectContaining({
                isCompleted: false,
                completedAt: null,
            }),
        });
    });
});
