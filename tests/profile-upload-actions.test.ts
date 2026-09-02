import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    createImageUploadToken: vi.fn(),
    claimUploadTokenQuota: vi.fn(),
    releaseUploadTokenQuota: vi.fn(),
    deleteBlobIfOwned: vi.fn(),
    isValidImageBlob: vi.fn(),
    userFindUnique: vi.fn(),
    userUpdate: vi.fn(),
    updateTag: vi.fn(),
    logServerError: vi.fn(),
    redirect: vi.fn(),
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
    deleteBlobIfOwned: mocks.deleteBlobIfOwned,
    isImageContentType: (value: string) => value === "image/png",
    isValidImageBlob: mocks.isValidImageBlob,
}));

vi.mock("@/lib/uploadRateLimit", () => ({
    claimUploadTokenQuota: mocks.claimUploadTokenQuota,
    getUploadLimitMessage: () =>
        "이미지는 한 시간에 최대 10회까지 업로드할 수 있습니다.",
    releaseUploadTokenQuota: mocks.releaseUploadTokenQuota,
}));

vi.mock("@/lib/db", () => ({
    default: {
        user: {
            findUnique: mocks.userFindUnique,
            update: mocks.userUpdate,
        },
    },
}));

vi.mock("next/cache", () => ({ updateTag: mocks.updateTag }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));

import {
    requestProfileAvatarUpload,
    uploadUserSetting,
} from "@/app/(nevigation)/profile/settings/actions";

const oldAvatar =
    "https://store.public.blob.vercel-storage.com/avatars/2/profile-old.png";
const newAvatar =
    "https://store.public.blob.vercel-storage.com/avatars/2/profile-new.png";

function profileForm(
    username = "carol",
    avatar = newAvatar,
    country = "ko-KR"
) {
    const formData = new FormData();
    formData.set("username", username);
    formData.set("avatar", avatar);
    formData.set("country", country);
    formData.set("locale", "ko");
    formData.set("showLocalizedMusicTitle", "true");
    formData.set("discordName", "병훈");
    formData.set("discordUsername", "hoonie71");
    formData.set("preferredArcadeId", "");
    formData.set("hideNostalgiaName", "false");
    formData.set("hideDiscordName", "false");
    formData.set("hidePlayCount", "false");
    return formData;
}

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
        mocks.deleteBlobIfOwned.mockResolvedValue(undefined);
        mocks.isValidImageBlob.mockResolvedValue(true);
        mocks.userFindUnique.mockResolvedValue({
            avatar: oldAvatar,
            discord_id: "discord-id",
        });
        mocks.userUpdate.mockResolvedValue({ id: 2 });
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

    it("비로그인 사용자의 프로필 저장을 거부한다", async () => {
        mocks.getSession.mockResolvedValue({});

        await expect(uploadUserSetting(profileForm())).resolves.toEqual({
            success: false,
            message: "로그인이 필요합니다.",
        });
        expect(mocks.userUpdate).not.toHaveBeenCalled();
    });

    it("허용되지 않은 Blob 주소는 저장하지 않는다", async () => {
        mocks.isValidImageBlob.mockResolvedValue(false);

        await expect(uploadUserSetting(profileForm())).resolves.toEqual({
            success: false,
            message: "허용되지 않은 프로필 이미지 주소입니다.",
        });
        expect(mocks.userUpdate).not.toHaveBeenCalled();
    });

    it("영문 설정 요청은 필드 오류도 영문으로 반환한다", async () => {
        const formData = profileForm("");
        formData.set("locale", "en");

        await expect(uploadUserSetting(formData)).resolves.toEqual({
            success: false,
            message: "Please check the information you entered.",
            fieldErrors: expect.objectContaining({
                username: ["Enter a nickname."],
            }),
        });
        expect(mocks.userUpdate).not.toHaveBeenCalled();
    });

    it("프로필 저장 후 기존 Blob을 삭제하고 캐시를 갱신한다", async () => {
        await uploadUserSetting(profileForm());

        expect(mocks.userUpdate).toHaveBeenCalledWith({
            where: { id: 2 },
            data: {
                username: "CAROL",
                country: "ko-KR",
                locale: "ko",
                show_localized_music_title: true,
                avatar: newAvatar,
                discord_name: "병훈",
                discord_username: "hoonie71",
                preferred_arcade_id: null,
                hide_nostalgia_name: false,
                hide_discord_name: false,
                hide_play_count: false,
            },
        });
        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(oldAvatar);
        expect(mocks.updateTag).toHaveBeenCalledWith("user-rankings");
        expect(mocks.updateTag).toHaveBeenCalledWith("user-profile-2");
        expect(mocks.session.save).toHaveBeenCalledOnce();
        expect(mocks.redirect).toHaveBeenCalledWith("/ko/profile/2");
    });

    it("중복 닉네임이면 새 Blob만 삭제하고 기존 프로필을 유지한다", async () => {
        mocks.userUpdate.mockRejectedValue({ code: "P2002" });

        await expect(uploadUserSetting(profileForm())).resolves.toEqual({
            success: false,
            message: "이미 사용 중인 닉네임입니다.",
        });
        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(newAvatar);
        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalledWith(oldAvatar);
        expect(mocks.redirect).not.toHaveBeenCalled();
    });

    it("DB 저장 실패 시 새 Blob을 정리한다", async () => {
        mocks.userUpdate.mockRejectedValue(new Error("database error"));

        await expect(uploadUserSetting(profileForm())).resolves.toEqual({
            success: false,
            message: "프로필 저장에 실패했습니다.",
        });
        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(newAvatar);
        expect(mocks.logServerError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({ event: "profile.settings.save.failed" })
        );
    });
});
