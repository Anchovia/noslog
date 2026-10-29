import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    createImageUploadToken: vi.fn(),
    claimUploadTokenQuota: vi.fn(),
    releaseUploadTokenQuota: vi.fn(),
    logServerError: vi.fn(),
    session: {
        id: 2,
        profileCompleted: true,
        locale: "ko" as "ko" | "ja" | "en",
        save: vi.fn(),
    },
}));

vi.mock("@/lib/session", () => ({
    default: mocks.getSession,
}));

vi.mock("@/lib/blob", () => ({
    createImageUploadToken: mocks.createImageUploadToken,
    isImageContentType: (value: string) => value === "image/png",
}));

vi.mock("@/lib/upload-rate-limit", () => ({
    claimUploadTokenQuota: mocks.claimUploadTokenQuota,
    getUploadLimitMessage: () =>
        "이미지는 한 시간에 최대 10회까지 업로드할 수 있습니다.",
    releaseUploadTokenQuota: mocks.releaseUploadTokenQuota,
}));

vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));

import { requestProfileAvatarUpload } from "@/app/(site)/profile/settings/actions";

describe("프로필 이미지 업로드 토큰", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.session.id = 2;
        mocks.session.profileCompleted = true;
        mocks.session.locale = "ko";
        mocks.getSession.mockResolvedValue(mocks.session);
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
            message: "",
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
