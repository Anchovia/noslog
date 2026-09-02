import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    createPrivateImageUploadToken: vi.fn(),
    deleteBlobIfOwned: vi.fn(),
    isValidPrivateImageBlob: vi.fn(),
    claimUploadTokenQuota: vi.fn(),
    releaseUploadTokenQuota: vi.fn(),
    feedbackCreate: vi.fn(),
    revalidatePath: vi.fn(),
    logServerError: vi.fn(),
    session: { id: 2 as number | undefined },
}));

vi.mock("@/lib/session", () => ({ default: mocks.getSession }));
vi.mock("@/lib/blob", () => ({
    createPrivateImageUploadToken: mocks.createPrivateImageUploadToken,
    deleteBlobIfOwned: mocks.deleteBlobIfOwned,
    isImageContentType: (value: string) => value === "image/png",
    isValidPrivateImageBlob: mocks.isValidPrivateImageBlob,
}));
vi.mock("@/lib/uploadRateLimit", () => ({
    claimUploadTokenQuota: mocks.claimUploadTokenQuota,
    getUploadLimitMessage: () =>
        "이미지는 한 시간에 최대 10회까지 업로드할 수 있습니다.",
    releaseUploadTokenQuota: mocks.releaseUploadTokenQuota,
}));
vi.mock("@/lib/db", () => ({
    default: {
        feedbackReport: { create: mocks.feedbackCreate },
    },
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));

import {
    discardFeedbackImage,
    requestFeedbackImageUpload,
    submitFeedbackReport,
} from "@/app/(nevigation)/(home)/feedbackActions";

const feedbackImage =
    "https://store.private.blob.vercel-storage.com/feedback/2/report.png";

function feedbackForm(
    content = "충분한 길이의 제보 내용입니다.",
    imageUrl = "",
    locale = "ko"
) {
    const formData = new FormData();
    formData.set("content", content);
    formData.set("imageUrl", imageUrl);
    formData.set("locale", locale);
    return formData;
}

describe("피드백 제보 액션", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.session.id = 2;
        mocks.getSession.mockResolvedValue(mocks.session);
        mocks.createPrivateImageUploadToken.mockResolvedValue({
            pathname: "feedback/2/report.png",
            token: "upload-token",
        });
        mocks.deleteBlobIfOwned.mockResolvedValue(undefined);
        mocks.isValidPrivateImageBlob.mockResolvedValue(true);
        mocks.claimUploadTokenQuota.mockResolvedValue({
            allowed: true,
            grantId: 10,
        });
        mocks.releaseUploadTokenQuota.mockResolvedValue(undefined);
        mocks.feedbackCreate.mockResolvedValue({ id: 1 });
    });

    it("피드백 전용 할당량을 소비한 뒤 비공개 업로드 토큰을 발급한다", async () => {
        await expect(
            requestFeedbackImageUpload("image/png", "ko")
        ).resolves.toEqual({
            success: true,
            message: "",
            pathname: "feedback/2/report.png",
            token: "upload-token",
        });
        expect(mocks.claimUploadTokenQuota).toHaveBeenCalledWith(
            2,
            "feedback-image"
        );
    });

    it("업로드 한도를 초과하면 토큰을 발급하지 않는다", async () => {
        mocks.claimUploadTokenQuota.mockResolvedValue({
            allowed: false,
            grantId: null,
        });

        await expect(
            requestFeedbackImageUpload("image/png", "ko")
        ).resolves.toEqual({
            success: false,
            message: "이미지는 한 시간에 최대 10회까지 업로드할 수 있습니다.",
        });
        expect(mocks.createPrivateImageUploadToken).not.toHaveBeenCalled();
    });

    it("토큰 생성 실패 시 할당량을 반환하고 오류를 기록한다", async () => {
        const error = new Error("blob unavailable");
        mocks.createPrivateImageUploadToken.mockRejectedValue(error);

        await expect(
            requestFeedbackImageUpload("image/png", "ko")
        ).resolves.toEqual({
            success: false,
            message: "이미지 업로드 요청을 처리하지 못했습니다.",
        });
        expect(mocks.releaseUploadTokenQuota).toHaveBeenCalledWith(2, 10);
        expect(mocks.logServerError).toHaveBeenCalledWith(error, {
            event: "feedback.image-upload.request.failed",
            routePath: "/",
            routeType: "action",
        });
    });

    it("비로그인 사용자의 제보를 거부한다", async () => {
        mocks.getSession.mockResolvedValue({});

        await expect(submitFeedbackReport(feedbackForm())).resolves.toEqual({
            success: false,
            message: "로그인이 필요합니다.",
        });
        expect(mocks.feedbackCreate).not.toHaveBeenCalled();
    });

    it("서버 검증 오류를 현재 언어의 필드 오류로 반환한다", async () => {
        await expect(
            submitFeedbackReport(feedbackForm("short", "", "en"))
        ).resolves.toEqual({
            success: false,
            message: "Enter between 10 and 1,000 characters.",
            fieldErrors: {
                content: ["Enter between 10 and 1,000 characters."],
            },
        });
        expect(mocks.feedbackCreate).not.toHaveBeenCalled();
    });

    it("검증 실패한 제보가 소유한 첨부 이미지를 정리한다", async () => {
        await submitFeedbackReport(feedbackForm("short", feedbackImage));

        expect(mocks.isValidPrivateImageBlob).toHaveBeenCalledWith(
            feedbackImage,
            "feedback/2/report"
        );
        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(feedbackImage);
    });

    it("잘못된 첨부 주소를 첨부 필드 오류로 반환한다", async () => {
        mocks.isValidPrivateImageBlob.mockResolvedValue(false);

        await expect(
            submitFeedbackReport(feedbackForm(undefined, "not-a-url", "en"))
        ).resolves.toEqual({
            success: false,
            message: "This attachment is not allowed.",
            fieldErrors: {
                imageUrl: ["This attachment is not allowed."],
            },
        });
        expect(mocks.feedbackCreate).not.toHaveBeenCalled();
        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
    });

    it("허용되지 않은 첨부 주소는 저장하지 않는다", async () => {
        mocks.isValidPrivateImageBlob.mockResolvedValue(false);

        await expect(
            submitFeedbackReport(feedbackForm(undefined, feedbackImage))
        ).resolves.toEqual({
            success: false,
            message: "허용되지 않은 첨부 이미지입니다.",
        });
        expect(mocks.feedbackCreate).not.toHaveBeenCalled();
    });

    it("정규화한 제보를 저장하고 관리자 경로를 갱신한다", async () => {
        await expect(
            submitFeedbackReport(
                feedbackForm(
                    "  충분한 길이의 제보 내용입니다.  ",
                    feedbackImage
                )
            )
        ).resolves.toEqual({
            success: true,
            message: "제보를 접수했습니다.",
        });
        expect(mocks.feedbackCreate).toHaveBeenCalledWith({
            data: {
                content: "충분한 길이의 제보 내용입니다.",
                imageUrl: feedbackImage,
                userId: 2,
            },
        });
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin");
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/feedback");
    });

    it("DB 저장 실패 시 첨부 이미지를 정리하고 오류를 기록한다", async () => {
        const error = new Error("database unavailable");
        mocks.feedbackCreate.mockRejectedValue(error);

        await expect(
            submitFeedbackReport(feedbackForm(undefined, feedbackImage))
        ).resolves.toEqual({
            success: false,
            message: "제보를 접수하지 못했습니다.",
        });
        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(feedbackImage);
        expect(mocks.logServerError).toHaveBeenCalledWith(error, {
            event: "feedback.report.submit.failed",
            routePath: "/",
            routeType: "action",
        });
    });

    it("현재 사용자가 소유한 임시 이미지만 폐기한다", async () => {
        await discardFeedbackImage(feedbackImage);

        expect(mocks.isValidPrivateImageBlob).toHaveBeenCalledWith(
            feedbackImage,
            "feedback/2/report"
        );
        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(feedbackImage);
    });
});
