import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    photoCount: vi.fn(),
    photoCreate: vi.fn(),
    photoFindUnique: vi.fn(),
    photoFindMany: vi.fn(),
    photoDelete: vi.fn(),
    photoUpdate: vi.fn(),
    detailsFindUnique: vi.fn(),
    createImageUploadToken: vi.fn(),
    isValidImageBlob: vi.fn(),
    deleteBlobIfOwned: vi.fn(),
    claimUploadTokenQuota: vi.fn(),
    releaseUploadTokenQuota: vi.fn(),
    updateTag: vi.fn(),
    revalidatePath: vi.fn(),
    logServerError: vi.fn(),
}));

vi.mock("@/lib/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/db", () => {
    const client = {
        arcadePublicPhoto: {
            count: mocks.photoCount,
            create: mocks.photoCreate,
            findUnique: mocks.photoFindUnique,
            findMany: mocks.photoFindMany,
            delete: mocks.photoDelete,
            update: mocks.photoUpdate,
        },
        arcadePublicDetails: { findUnique: mocks.detailsFindUnique },
    };
    return {
        default: {
            ...client,
            $transaction: (run: (tx: typeof client) => unknown) => run(client),
        },
    };
});
vi.mock("@/lib/blob", () => ({
    createImageUploadToken: mocks.createImageUploadToken,
    isValidImageBlob: mocks.isValidImageBlob,
    deleteBlobIfOwned: mocks.deleteBlobIfOwned,
    isImageContentType: (value: string) =>
        ["image/jpeg", "image/png", "image/webp"].includes(value),
}));
vi.mock("@/lib/uploadRateLimit", () => ({
    claimUploadTokenQuota: mocks.claimUploadTokenQuota,
    releaseUploadTokenQuota: mocks.releaseUploadTokenQuota,
    getUploadLimitMessage: () =>
        "이미지는 한 시간에 최대 10회까지 업로드할 수 있습니다.",
}));
vi.mock("next/cache", () => ({
    updateTag: mocks.updateTag,
    revalidatePath: mocks.revalidatePath,
}));
vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));

import {
    deleteArcadePhoto,
    requestArcadePhotoUpload,
    saveArcadePhoto,
    setArcadeMainPhoto,
} from "@/app/admin/arcades/actions";

const PHOTO_URL =
    "https://store.public.blob.vercel-storage.com/arcades/10/photo-abc.png";

function saveForm(overrides: Record<string, string> = {}) {
    const formData = new FormData();
    const values = {
        arcadeId: "10",
        url: PHOTO_URL,
        alt: "  짱구게임장 매장 사진  ",
        capturedAt: "2026-09-12",
        consent: "true",
        ...overrides,
    };
    for (const [key, value] of Object.entries(values)) formData.set(key, value);
    return formData;
}

function photoForm(photoId: number) {
    const formData = new FormData();
    formData.set("photoId", String(photoId));
    return formData;
}

describe("관리자 오락실 사진", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.photoCount.mockResolvedValue(0);
        mocks.claimUploadTokenQuota.mockResolvedValue({
            allowed: true,
            grantId: 5,
        });
        mocks.createImageUploadToken.mockResolvedValue({
            pathname: "arcades/10/photo.png",
            token: "upload-token",
        });
        mocks.isValidImageBlob.mockResolvedValue(true);
        mocks.detailsFindUnique.mockResolvedValue({ slug: "jjanggu" });
    });

    it("오락실 경로 전용 업로드 토큰을 발급한다", async () => {
        await expect(
            requestArcadePhotoUpload(10, "image/png")
        ).resolves.toEqual({
            success: true,
            message: "",
            pathname: "arcades/10/photo.png",
            token: "upload-token",
        });
        expect(mocks.claimUploadTokenQuota).toHaveBeenCalledWith(
            1,
            "arcade-photo"
        );
        expect(mocks.createImageUploadToken).toHaveBeenCalledWith(
            "arcades/10/photo",
            "image/png"
        );
    });

    it("3장이 차 있으면 토큰을 발급하지 않는다", async () => {
        mocks.photoCount.mockResolvedValue(3);

        await expect(
            requestArcadePhotoUpload(10, "image/png")
        ).resolves.toEqual({
            success: false,
            message: "사진은 3장까지 올릴 수 있습니다.",
        });
        expect(mocks.claimUploadTokenQuota).not.toHaveBeenCalled();
    });

    it("게시 권리·공개 동의가 없으면 저장하지 않는다", async () => {
        await expect(
            saveArcadePhoto(saveForm({ consent: "false" }))
        ).resolves.toEqual({
            success: false,
            message: "촬영자의 게시 권리와 공개 동의를 확인해주세요.",
        });
        expect(mocks.photoCreate).not.toHaveBeenCalled();
    });

    it("이 오락실 경로로 올린 공개 이미지가 아니면 저장하지도 지우지도 않는다", async () => {
        mocks.isValidImageBlob.mockResolvedValue(false);

        await expect(saveArcadePhoto(saveForm())).resolves.toMatchObject({
            success: false,
        });
        expect(mocks.isValidImageBlob).toHaveBeenCalledWith(
            PHOTO_URL,
            "arcades/10/photo"
        );
        expect(mocks.photoCreate).not.toHaveBeenCalled();
        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
    });

    it("맨 뒤 자리에 권리·동의 시각과 함께 저장하고 공개 상세를 새로 고친다", async () => {
        mocks.photoCount.mockResolvedValue(1);

        await expect(saveArcadePhoto(saveForm())).resolves.toEqual({
            success: true,
            message: "사진을 올렸습니다.",
        });
        expect(mocks.photoCreate).toHaveBeenCalledWith({
            data: {
                arcadeId: 10,
                slot: 1,
                url: PHOTO_URL,
                alt: "짱구게임장 매장 사진",
                capturedAt: new Date("2026-09-12T00:00:00+09:00"),
                rightsConfirmedAt: expect.any(Date),
                publicConsentAt: expect.any(Date),
            },
        });
        expect(mocks.updateTag).toHaveBeenCalledWith("arcades");
        expect(mocks.revalidatePath).toHaveBeenCalledWith(
            "/gamecenter/jjanggu"
        );
    });

    it("그사이 3장이 차면 올린 파일을 지우고 실패한다", async () => {
        mocks.photoCount.mockResolvedValue(3);

        await expect(saveArcadePhoto(saveForm())).resolves.toEqual({
            success: false,
            message: "사진은 3장까지 올릴 수 있습니다.",
        });
        expect(mocks.photoCreate).not.toHaveBeenCalled();
        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(PHOTO_URL);
    });

    it("사진을 지우면 뒤 사진을 한 칸씩 당기고 파일도 지운다", async () => {
        mocks.photoFindUnique.mockResolvedValue({
            arcadeId: 10,
            url: PHOTO_URL,
        });
        // 0번(대표)을 지운 뒤 남은 1·2번
        mocks.photoFindMany.mockResolvedValue([
            { id: 12, slot: 1 },
            { id: 13, slot: 2 },
        ]);

        await expect(deleteArcadePhoto(photoForm(11))).resolves.toEqual({
            success: true,
            message: "사진을 지웠습니다.",
        });
        expect(mocks.photoDelete).toHaveBeenCalledWith({ where: { id: 11 } });
        expect(mocks.photoUpdate.mock.calls).toEqual([
            [{ where: { id: 12 }, data: { slot: 0 } }],
            [{ where: { id: 13 }, data: { slot: 1 } }],
        ]);
        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(PHOTO_URL);
    });

    it("대표로 고른 사진을 맨 앞에 두고 나머지 순서는 유지한다", async () => {
        mocks.photoFindUnique.mockResolvedValue({ arcadeId: 10, slot: 2 });
        mocks.photoFindMany.mockResolvedValue([
            { id: 12, slot: 1 },
            { id: 11, slot: 0 },
        ]);

        await expect(setArcadeMainPhoto(photoForm(13))).resolves.toEqual({
            success: true,
            message: "대표 사진을 바꿨습니다.",
        });
        expect(mocks.photoUpdate.mock.calls).toEqual([
            [{ where: { id: 13 }, data: { slot: -1 } }],
            [{ where: { id: 12 }, data: { slot: 2 } }],
            [{ where: { id: 11 }, data: { slot: 1 } }],
            [{ where: { id: 13 }, data: { slot: 0 } }],
        ]);
    });
});
