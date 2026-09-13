import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    musicFindUnique: vi.fn(),
    musicUpdate: vi.fn(),
    musicUpdateMany: vi.fn(),
    createImageUploadToken: vi.fn(),
    deleteBlobIfOwned: vi.fn(),
    isValidImageBlob: vi.fn(),
    claimUploadTokenQuota: vi.fn(),
    releaseUploadTokenQuota: vi.fn(),
    updateTag: vi.fn(),
    revalidatePath: vi.fn(),
    logServerError: vi.fn(),
}));

vi.mock("@/lib/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/db", () => ({
    default: {
        music: {
            findUnique: mocks.musicFindUnique,
            update: mocks.musicUpdate,
            updateMany: mocks.musicUpdateMany,
        },
    },
}));
vi.mock("@/lib/blob", () => ({
    createImageUploadToken: mocks.createImageUploadToken,
    deleteBlobIfOwned: mocks.deleteBlobIfOwned,
    isValidImageBlob: mocks.isValidImageBlob,
    isImageContentType: (value: string) =>
        ["image/jpeg", "image/png", "image/webp"].includes(value),
}));
vi.mock("@vercel/blob", () => ({ put: vi.fn() }));
vi.mock("@/lib/uploadRateLimit", () => ({
    claimUploadTokenQuota: mocks.claimUploadTokenQuota,
    releaseUploadTokenQuota: mocks.releaseUploadTokenQuota,
    getUploadLimitMessage: () => "limit",
}));
vi.mock("next/cache", () => ({
    updateTag: mocks.updateTag,
    revalidatePath: mocks.revalidatePath,
    revalidateTag: vi.fn(),
}));
vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));

import {
    requestMusicJacketUpload,
    resetMusicJacket,
    saveMusicJacket,
} from "@/features/music/server/musicJacketAdminService";

const manual =
    "https://store.public.blob.vercel-storage.com/jackets/manual/abc/jacket-new.png";
const collected =
    "https://store.public.blob.vercel-storage.com/jackets/abc-old.png";

function form(values: Record<string, string>) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) formData.set(key, value);
    return formData;
}

describe("관리자 악곡 자켓 교체", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1 });
        mocks.musicFindUnique.mockResolvedValue({
            index: "abc",
            background: collected,
        });
        mocks.claimUploadTokenQuota.mockResolvedValue({
            allowed: true,
            grantId: 5,
        });
        mocks.createImageUploadToken.mockResolvedValue({
            pathname: "jackets/manual/abc/jacket.png",
            token: "t",
        });
        mocks.isValidImageBlob.mockResolvedValue(true);
        mocks.musicUpdate.mockResolvedValue({});
        mocks.musicUpdateMany.mockResolvedValue({ count: 1 });
    });

    it("곡 폴더 경로로 한 장 전용 업로드 토큰을 만든다", async () => {
        const result = await requestMusicJacketUpload("abc", "image/png");

        expect(result).toMatchObject({ success: true, token: "t" });
        expect(mocks.claimUploadTokenQuota).toHaveBeenCalledWith(
            1,
            "music-jacket"
        );
        expect(mocks.createImageUploadToken).toHaveBeenCalledWith(
            "jackets/manual/abc/jacket",
            "image/png"
        );
    });

    it("이미지가 아니거나 없는 곡이면 토큰을 만들지 않는다", async () => {
        await expect(
            requestMusicJacketUpload("abc", "image/gif")
        ).resolves.toMatchObject({ success: false });
        mocks.musicFindUnique.mockResolvedValue(null);
        await expect(
            requestMusicJacketUpload("abc", "image/png")
        ).resolves.toMatchObject({ success: false });
        await expect(
            requestMusicJacketUpload("../etc", "image/png")
        ).resolves.toMatchObject({ success: false });
        expect(mocks.claimUploadTokenQuota).not.toHaveBeenCalled();
        expect(mocks.createImageUploadToken).not.toHaveBeenCalled();
    });

    it("올린 자켓을 기록하고 이전 Blob 자켓을 지운 뒤 캐시를 비운다", async () => {
        const result = await saveMusicJacket(
            form({ musicIndex: "abc", url: manual })
        );

        expect(result).toMatchObject({ success: true });
        expect(mocks.isValidImageBlob).toHaveBeenCalledWith(
            manual,
            "jackets/manual/abc/"
        );
        expect(mocks.musicUpdate).toHaveBeenCalledWith({
            where: { index: "abc" },
            data: { background: manual },
        });
        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(collected);
        for (const tag of [
            "music-catalog",
            "music-details",
            "tier-lists",
            "bingos",
        ])
            expect(mocks.updateTag).toHaveBeenCalledWith(tag);
    });

    it("이 곡 폴더로 올린 파일이 아니면 아무것도 바꾸지 않는다", async () => {
        mocks.isValidImageBlob.mockResolvedValue(false);

        const result = await saveMusicJacket(
            form({ musicIndex: "abc", url: manual })
        );

        expect(result).toMatchObject({ success: false });
        expect(mocks.musicUpdate).not.toHaveBeenCalled();
        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
    });

    it("저장에 실패하면 올린 파일을 지운다", async () => {
        mocks.musicUpdate.mockRejectedValue(new Error("db down"));

        const result = await saveMusicJacket(
            form({ musicIndex: "abc", url: manual })
        );

        expect(result).toMatchObject({ success: false });
        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(manual);
        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalledWith(collected);
    });

    it("직접 올린 자켓을 지우고 기본 자켓으로 되돌린다", async () => {
        mocks.musicFindUnique.mockResolvedValue({ background: manual });

        const result = await resetMusicJacket(form({ musicIndex: "abc" }));

        expect(result).toMatchObject({ success: true });
        expect(mocks.musicUpdateMany).toHaveBeenCalledWith({
            where: { index: "abc", background: manual },
            data: { background: null },
        });
        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(manual);
    });

    it("직접 올린 자켓이 아니면 되돌리지 않는다", async () => {
        const result = await resetMusicJacket(form({ musicIndex: "abc" }));

        expect(result).toMatchObject({ success: true });
        expect(mocks.musicUpdateMany).not.toHaveBeenCalled();
        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
    });
});
