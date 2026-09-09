import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    session: {
        id: 2 as number | undefined,
        destroy: vi.fn(),
    },
    getSessionUser: vi.fn(),
    cellFindUnique: vi.fn(),
    progressUpsert: vi.fn(),
    bingoFindFirst: vi.fn(),
    progressDeleteMany: vi.fn(),
    revalidatePath: vi.fn(),
    log: vi.fn(),
}));

vi.mock("@/lib/observability/server", () => ({ logServerError: mocks.log }));

vi.mock("@/lib/user", () => ({
    getSessionUser: mocks.getSessionUser,
}));

vi.mock("@/lib/db", () => ({
    default: {
        bingo: { findFirst: mocks.bingoFindFirst },
        bingoCell: { findUnique: mocks.cellFindUnique },
        bingoCellProgress: {
            upsert: mocks.progressUpsert,
            deleteMany: mocks.progressDeleteMany,
        },
    },
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import {
    setBingoCellCompletion,
    resetBingoProgress,
} from "@/app/(nevigation)/bingo/[id]/actions";

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
        mocks.bingoFindFirst.mockResolvedValue({ id: 5 });
        mocks.progressDeleteMany.mockResolvedValue({ count: 8 });
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

    it("비공개 빙고는 변경하지 않는다", async () => {
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
            message: "",
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
            message: "",
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

    it.each([NaN, Infinity, -1, 1.5, "3", null])(
        "잘못된 ID %s는 DB에 전달하지 않는다",
        async (id) => {
            expect(
                (await setBingoCellCompletion(id as number, true)).success
            ).toBe(false);
            expect(mocks.cellFindUnique).not.toHaveBeenCalled();
        }
    );

    it.each([
        {
            ...availableCell,
            bingo: { ...availableCell.bingo, startsAt: new Date("2999-01-01") },
        },
        {
            ...availableCell,
            bingo: { ...availableCell.bingo, endsAt: new Date("2000-01-01") },
        },
    ])("공개된 빙고는 기존 날짜와 관계없이 저장한다", async (cell) => {
        mocks.cellFindUnique.mockResolvedValue(cell);
        expect((await setBingoCellCompletion(3, true)).success).toBe(true);
        expect(mocks.progressUpsert).toHaveBeenCalledOnce();
    });

    it("없는 칸에는 저장하지 않는다", async () => {
        mocks.cellFindUnique.mockResolvedValue(null);
        expect((await setBingoCellCompletion(3, true)).success).toBe(false);
        expect(mocks.progressUpsert).not.toHaveBeenCalled();
    });

    it("초기화는 로그인 사용자의 선택한 공개 빙고 행만 삭제한다", async () => {
        expect((await resetBingoProgress(5)).success).toBe(true);
        expect(mocks.progressDeleteMany).toHaveBeenCalledWith({
            where: {
                userId: 2,
                cell: { bingoId: 5, bingo: { status: "published" } },
            },
        });
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/bingo/5");
    });
    it("비로그인·잘못된 빙고·비공개 빙고는 초기화하지 않는다", async () => {
        expect((await resetBingoProgress(-1)).success).toBe(false);
        mocks.bingoFindFirst.mockResolvedValue(null);
        expect((await resetBingoProgress(5)).success).toBe(false);
        mocks.getSessionUser.mockResolvedValue({
            session: mocks.session,
            user: null,
        });
        expect((await resetBingoProgress(5)).success).toBe(false);
        expect(mocks.progressDeleteMany).not.toHaveBeenCalled();
    });
    it("초기화 DB 실패는 성공으로 표시하지 않는다", async () => {
        mocks.progressDeleteMany.mockRejectedValueOnce(
            new Error("database unavailable")
        );
        expect((await resetBingoProgress(5)).success).toBe(false);
        expect(mocks.revalidatePath).not.toHaveBeenCalled();
    });

    it.each(["lookup", "save"])(
        "%s DB 실패는 실패 응답으로 반환한다",
        async (stage) => {
            (stage === "lookup"
                ? mocks.cellFindUnique
                : mocks.progressUpsert
            ).mockRejectedValueOnce(new Error("database unavailable"));
            expect(await setBingoCellCompletion(3, true)).toEqual({
                success: false,
                message: "완료 상태를 저장하지 못했습니다.",
            });
            expect(mocks.revalidatePath).not.toHaveBeenCalled();
            expect(mocks.log).toHaveBeenCalledOnce();
        }
    );
});
