import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    createImageUploadToken: vi.fn(),
    claimUploadTokenQuota: vi.fn(),
    releaseUploadTokenQuota: vi.fn(),
}));

vi.mock("@/lib/session", () => ({
    default: mocks.getSession,
}));

vi.mock("@/lib/blob", () => ({
    createImageUploadToken: mocks.createImageUploadToken,
    deleteBlobIfOwned: vi.fn(),
    isImageContentType: (value: string) => value === "image/png",
    isValidImageBlob: vi.fn(),
}));

vi.mock("@/lib/uploadRateLimit", () => ({
    claimUploadTokenQuota: mocks.claimUploadTokenQuota,
    getUploadLimitMessage: () =>
        "이미지는 한 시간에 최대 10회까지 업로드할 수 있습니다.",
    releaseUploadTokenQuota: mocks.releaseUploadTokenQuota,
}));

vi.mock("@/lib/db", () => ({
    default: { user: { findUnique: vi.fn(), update: vi.fn() } },
}));

vi.mock("next/cache", () => ({ updateTag: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

import { requestProfileAvatarUpload } from "@/app/(nevigation)/profile/settings/actions";

describe("프로필 이미지 업로드 토큰", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.getSession.mockResolvedValue({ id: 2 });
        mocks.claimUploadTokenQuota.mockResolvedValue({
            allowed: true,
            grantId: 10,
        });
        mocks.createImageUploadToken.mockResolvedValue({
            pathname: "avatars/2/profile.png",
            token: "upload-token",
        });
        mocks.releaseUploadTokenQuota.mockResolvedValue(undefined);
    });

    it("프로필 전용 할당량을 소비한 뒤 토큰을 발급한다", async () => {
        await expect(requestProfileAvatarUpload("image/png")).resolves.toEqual({
            success: true,
            pathname: "avatars/2/profile.png",
            token: "upload-token",
        });

        expect(mocks.claimUploadTokenQuota).toHaveBeenCalledWith(
            2,
            "profile-avatar"
        );
    });

    it("한도를 초과하면 Blob 토큰을 발급하지 않는다", async () => {
        mocks.claimUploadTokenQuota.mockResolvedValue({
            allowed: false,
            grantId: null,
        });

        await expect(requestProfileAvatarUpload("image/png")).resolves.toEqual({
            success: false,
            message: "이미지는 한 시간에 최대 10회까지 업로드할 수 있습니다.",
        });
        expect(mocks.createImageUploadToken).not.toHaveBeenCalled();
    });
});
