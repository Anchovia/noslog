import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    createImageUploadToken: vi.fn(),
    createPrivateImageUploadToken: vi.fn(),
    claimUploadTokenQuota: vi.fn(),
    releaseUploadTokenQuota: vi.fn(),
}));

vi.mock("@/lib/blob", () => ({
    createImageUploadToken: mocks.createImageUploadToken,
    createPrivateImageUploadToken: mocks.createPrivateImageUploadToken,
}));

vi.mock("@/lib/upload-rate-limit", () => ({
    claimUploadTokenQuota: mocks.claimUploadTokenQuota,
    releaseUploadTokenQuota: mocks.releaseUploadTokenQuota,
}));

import { requestImageUploadToken } from "@/lib/uploads/image-upload-token";

const logError = vi.fn();

function request(
    overrides: Partial<Parameters<typeof requestImageUploadToken>[0]> = {}
) {
    return requestImageUploadToken({
        userId: 2,
        purpose: "arcade-photo",
        access: "public",
        pathnameWithoutExtension: "arcades/5/photo",
        contentType: "image/png",
        limitMessage: "한도",
        refusedTypeMessage: "형식",
        errorMessage: "오류",
        logError,
        ...overrides,
    });
}

describe("이미지 업로드 토큰 요청", () => {
    beforeEach(() => {
        mocks.claimUploadTokenQuota.mockResolvedValue({
            allowed: true,
            grantId: 10,
        });
        mocks.createImageUploadToken.mockResolvedValue({
            pathname: "arcades/5/photo-a.png",
            token: "public-token",
        });
        mocks.createPrivateImageUploadToken.mockResolvedValue({
            pathname: "feedback/2/report-a.png",
            token: "private-token",
        });
        mocks.releaseUploadTokenQuota.mockResolvedValue(undefined);
    });

    it("한도 안이면 차지하고 공개 토큰을 돌려준다", async () => {
        await expect(request()).resolves.toEqual({
            success: true,
            message: "",
            pathname: "arcades/5/photo-a.png",
            token: "public-token",
        });

        expect(mocks.claimUploadTokenQuota).toHaveBeenCalledWith(
            2,
            "arcade-photo"
        );
        expect(mocks.createImageUploadToken).toHaveBeenCalledWith(
            "arcades/5/photo",
            "image/png"
        );
        expect(mocks.createPrivateImageUploadToken).not.toHaveBeenCalled();
        expect(mocks.releaseUploadTokenQuota).not.toHaveBeenCalled();
        expect(logError).not.toHaveBeenCalled();
    });

    it("비공개 요청은 비공개 저장소 토큰을 발급한다", async () => {
        await expect(
            request({
                access: "private",
                purpose: "feedback-image",
                pathnameWithoutExtension: "feedback/2/report",
            })
        ).resolves.toMatchObject({ success: true, token: "private-token" });

        expect(mocks.createPrivateImageUploadToken).toHaveBeenCalledWith(
            "feedback/2/report",
            "image/png"
        );
        expect(mocks.createImageUploadToken).not.toHaveBeenCalled();
    });

    it("한도를 넘으면 발급하지 않고 한도 문구로 답한다", async () => {
        mocks.claimUploadTokenQuota.mockResolvedValue({
            allowed: false,
            grantId: null,
        });

        await expect(request()).resolves.toEqual({
            success: false,
            message: "한도",
        });

        expect(mocks.createImageUploadToken).not.toHaveBeenCalled();
        expect(mocks.releaseUploadTokenQuota).not.toHaveBeenCalled();
        expect(logError).not.toHaveBeenCalled();
    });

    it("발급이 실패하면 기록한 뒤 차지한 한도를 반납한다", async () => {
        const failure = new Error("blob down");
        mocks.createImageUploadToken.mockRejectedValue(failure);

        await expect(request()).resolves.toEqual({
            success: false,
            message: "오류",
        });

        expect(logError).toHaveBeenCalledWith(failure);
        expect(mocks.releaseUploadTokenQuota).toHaveBeenCalledWith(2, 10);
        expect(logError.mock.invocationCallOrder[0]).toBeLessThan(
            mocks.releaseUploadTokenQuota.mock.invocationCallOrder[0]
        );
    });

    it("반납이 실패해도 오류 문구로 답한다", async () => {
        mocks.createImageUploadToken.mockRejectedValue(new Error("blob down"));
        mocks.releaseUploadTokenQuota.mockRejectedValue(
            new Error("release down")
        );

        await expect(request()).resolves.toEqual({
            success: false,
            message: "오류",
        });
    });

    it("반납 실패를 받는 함수가 있으면 반납 오류를 넘기고 답은 그대로다", async () => {
        const releaseFailure = new Error("release down");
        const onReleaseError = vi.fn();
        mocks.releaseUploadTokenQuota.mockRejectedValue(releaseFailure);

        mocks.createImageUploadToken.mockRejectedValueOnce(
            new Error("blob down")
        );
        await expect(request({ onReleaseError })).resolves.toEqual({
            success: false,
            message: "오류",
        });
        mocks.createImageUploadToken.mockResolvedValueOnce(null);
        await expect(request({ onReleaseError })).resolves.toEqual({
            success: false,
            message: "형식",
        });

        expect(onReleaseError.mock.calls).toEqual([
            [releaseFailure],
            [releaseFailure],
        ]);
        expect(logError).toHaveBeenCalledTimes(1);
    });

    it("반납이 성공하면 반납 실패를 받는 함수를 부르지 않는다", async () => {
        const onReleaseError = vi.fn();
        mocks.createImageUploadToken.mockRejectedValue(new Error("blob down"));

        await request({ onReleaseError });

        expect(mocks.releaseUploadTokenQuota).toHaveBeenCalledWith(2, 10);
        expect(onReleaseError).not.toHaveBeenCalled();
    });

    it("한도 차지가 실패하면 기록만 하고 반납하지 않는다", async () => {
        mocks.claimUploadTokenQuota.mockRejectedValue(new Error("quota down"));

        await expect(request()).resolves.toEqual({
            success: false,
            message: "오류",
        });

        expect(logError).toHaveBeenCalledTimes(1);
        expect(mocks.createImageUploadToken).not.toHaveBeenCalled();
        expect(mocks.releaseUploadTokenQuota).not.toHaveBeenCalled();
    });

    it("형식 문구가 있으면 토큰이 나오지 않을 때 기록 없이 반납하고 그 문구로 답한다", async () => {
        mocks.createImageUploadToken.mockResolvedValue(null);

        await expect(request()).resolves.toEqual({
            success: false,
            message: "형식",
        });

        expect(mocks.releaseUploadTokenQuota).toHaveBeenCalledWith(2, 10);
        expect(logError).not.toHaveBeenCalled();
    });

    it("형식 문구가 null 이면 토큰이 나오지 않을 때 오류로 기록하고 반납한다", async () => {
        mocks.createImageUploadToken.mockResolvedValue(null);

        await expect(request({ refusedTypeMessage: null })).resolves.toEqual({
            success: false,
            message: "오류",
        });

        expect(logError).toHaveBeenCalledTimes(1);
        expect(logError.mock.calls[0][0]).toEqual(
            new Error("invalid image type")
        );
        expect(mocks.releaseUploadTokenQuota).toHaveBeenCalledWith(2, 10);
    });

    it("차지 전 조건이 거부하면 차지하지 않고 그 결과로 답한다", async () => {
        await expect(
            request({
                beforeClaim: async () => ({ success: false, message: "거부" }),
            })
        ).resolves.toEqual({ success: false, message: "거부" });

        expect(mocks.claimUploadTokenQuota).not.toHaveBeenCalled();
        expect(mocks.createImageUploadToken).not.toHaveBeenCalled();
        expect(logError).not.toHaveBeenCalled();
    });

    it("차지 전 조건이 통과하면 차지하고 발급한다", async () => {
        await expect(
            request({ beforeClaim: async () => null })
        ).resolves.toMatchObject({ success: true });

        expect(mocks.claimUploadTokenQuota).toHaveBeenCalledTimes(1);
    });

    it("차지 전 조건이 던지면 기록하고 차지하지 않는다", async () => {
        const failure = new Error("db down");

        await expect(
            request({
                beforeClaim: async () => {
                    throw failure;
                },
            })
        ).resolves.toEqual({ success: false, message: "오류" });

        expect(logError).toHaveBeenCalledWith(failure);
        expect(mocks.claimUploadTokenQuota).not.toHaveBeenCalled();
        expect(mocks.releaseUploadTokenQuota).not.toHaveBeenCalled();
    });
});
