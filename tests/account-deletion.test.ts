import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    destroy: vi.fn(),
    userFindUnique: vi.fn(),
    userDelete: vi.fn(),
    deleteBlobStrict: vi.fn(),
    revalidateTag: vi.fn(),
}));
vi.mock("next/cache", () => ({ revalidateTag: mocks.revalidateTag }));

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
            deletionVerification: {
                userId: 7,
                discordId: "discord-7",
                verifiedAt: Date.now(),
            },
            destroy: mocks.destroy,
        });
        mocks.userFindUnique.mockResolvedValue({
            discord_id: "discord-7",
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

    it.each(["탈퇴", " 회원 탈퇴", "회원 탈퇴 "])(
        "확인 문구 %s가 정확히 일치하지 않으면 삭제하지 않는다",
        async (phrase) => {
            await expect(deleteAccount(phrase)).resolves.toEqual({
                success: false,
                message: "확인을 위해 '회원 탈퇴'를 정확히 입력해주세요.",
            });

            expect(mocks.userFindUnique).not.toHaveBeenCalled();
            expect(mocks.userDelete).not.toHaveBeenCalled();
        }
    );

    it.each([
        undefined,
        { userId: 8, discordId: "discord-7", verifiedAt: Date.now() },
        { userId: 7, discordId: "other", verifiedAt: Date.now() },
        { userId: 7, discordId: "discord-7", verifiedAt: Date.now() - 600_000 },
        { userId: 7, discordId: "discord-7", verifiedAt: Date.now() + 60_000 },
    ])(
        "탈퇴 재인증이 없거나 만료·불일치하면 파일과 계정을 유지한다",
        async (verification) => {
            mocks.getSession.mockResolvedValue({
                id: 7,
                destroy: mocks.destroy,
                deletionVerification: verification,
            });
            expect(await deleteAccount("회원 탈퇴")).toMatchObject({
                success: false,
                reauthenticationRequired: true,
            });
            expect(mocks.deleteBlobStrict).not.toHaveBeenCalled();
            expect(mocks.userDelete).not.toHaveBeenCalled();
            expect(mocks.destroy).not.toHaveBeenCalled();
        }
    );

    it("업로드 파일을 먼저 지운 뒤 계정과 세션을 삭제한다", async () => {
        await expect(deleteAccount("회원 탈퇴")).resolves.toEqual({
            success: true,
        });

        expect(mocks.deleteBlobStrict).toHaveBeenCalledTimes(3);
        expect(mocks.userDelete).toHaveBeenCalledWith({ where: { id: 7 } });
        expect(mocks.destroy).toHaveBeenCalledOnce();
        expect(mocks.revalidateTag).toHaveBeenCalledWith("user-profile-7", {
            expire: 0,
        });
        expect(mocks.revalidateTag).toHaveBeenCalledWith("user-rankings", {
            expire: 0,
        });
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
