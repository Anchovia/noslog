import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    destroy: vi.fn(),
    userFindUnique: vi.fn(),
    userDelete: vi.fn(),
    deleteBlobStrict: vi.fn(),
}));

vi.mock("@/lib/session", () => ({
    default: mocks.getSession,
}));

vi.mock("@/lib/db", () => ({
    default: {
        user: {
            findUnique: mocks.userFindUnique,
            delete: mocks.userDelete,
        },
    },
}));

vi.mock("@/lib/blob", () => ({
    deleteBlobStrict: mocks.deleteBlobStrict,
}));

import { deleteAccount } from "@/app/(nevigation)/profile/settings/securityActions";

describe("회원 탈퇴", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.getSession.mockResolvedValue({
            id: 7,
            destroy: mocks.destroy,
        });
        mocks.userFindUnique.mockResolvedValue({
            avatar: "https://avatar.public.blob.vercel-storage.com/users/7.jpg",
            feedbackReports: [
                {
                    imageUrl:
                        "https://private.private.blob.vercel-storage.com/feedback/7.jpg",
                },
            ],
            examSubmissions: [
                {
                    proofImageUrl:
                        "https://private.private.blob.vercel-storage.com/exam/7.jpg",
                },
            ],
        });
        mocks.deleteBlobStrict.mockResolvedValue(undefined);
        mocks.userDelete.mockResolvedValue({ id: 7 });
        mocks.destroy.mockResolvedValue(undefined);
    });

    it("확인 문구가 다르면 아무 정보도 삭제하지 않는다", async () => {
        await expect(deleteAccount("탈퇴")).resolves.toEqual({
            success: false,
            message: "확인을 위해 '회원 탈퇴'를 정확히 입력해주세요.",
        });

        expect(mocks.userFindUnique).not.toHaveBeenCalled();
        expect(mocks.userDelete).not.toHaveBeenCalled();
    });

    it("업로드 파일을 먼저 지운 뒤 계정과 세션을 삭제한다", async () => {
        await expect(deleteAccount("회원 탈퇴")).resolves.toEqual({
            success: true,
        });

        expect(mocks.deleteBlobStrict).toHaveBeenCalledTimes(3);
        expect(mocks.userDelete).toHaveBeenCalledWith({ where: { id: 7 } });
        expect(mocks.destroy).toHaveBeenCalledOnce();
        expect(mocks.deleteBlobStrict.mock.invocationCallOrder[2]).toBeLessThan(
            mocks.userDelete.mock.invocationCallOrder[0]
        );
    });

    it("파일 삭제에 실패하면 계정 삭제를 중단한다", async () => {
        mocks.deleteBlobStrict.mockRejectedValueOnce(new Error("blob error"));

        const result = await deleteAccount("회원 탈퇴");

        expect(result.success).toBe(false);
        expect(mocks.userDelete).not.toHaveBeenCalled();
        expect(mocks.destroy).not.toHaveBeenCalled();
    });
});
