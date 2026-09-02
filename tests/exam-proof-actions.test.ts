import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    isValidPrivateImageBlob: vi.fn(),
    deleteBlobIfOwned: vi.fn(),
    createPrivateImageUploadToken: vi.fn(),
    examFindFirst: vi.fn(),
    userFindUnique: vi.fn(),
    submissionFindMany: vi.fn(),
    submissionFindFirst: vi.fn(),
    transaction: vi.fn(),
    submissionDeleteMany: vi.fn(),
    submissionCreate: vi.fn(),
    revalidatePath: vi.fn(),
    claimUploadTokenQuota: vi.fn(),
    releaseUploadTokenQuota: vi.fn(),
    logServerError: vi.fn(),
}));

vi.mock("@/lib/session", () => ({
    default: mocks.getSession,
}));

vi.mock("@/lib/blob", () => ({
    createPrivateImageUploadToken: mocks.createPrivateImageUploadToken,
    deleteBlobIfOwned: mocks.deleteBlobIfOwned,
    isImageContentType: (value: string) => value === "image/jpeg",
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
        $transaction: mocks.transaction,
        exam: { findFirst: mocks.examFindFirst },
        user: { findUnique: mocks.userFindUnique },
        examSubmission: {
            findMany: mocks.submissionFindMany,
            findFirst: mocks.submissionFindFirst,
        },
    },
}));

vi.mock("next/cache", () => ({
    revalidatePath: mocks.revalidatePath,
}));

vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));

import {
    discardExamProofUpload,
    requestExamProofUpload,
    submitExamProof,
} from "@/app/(nevigation)/exams/actions";

const proofUrl =
    "https://store.private.blob.vercel-storage.com/exam-proofs/2/30/proof-new.jpg";
const rejectedProofUrl =
    "https://store.private.blob.vercel-storage.com/exam-proofs/2/30/proof-old.jpg";

function createSubmissionFormData(
    examId: number | string = 30,
    proofImageUrl = proofUrl,
    locale = "ko"
) {
    const formData = new FormData();
    formData.set("examId", String(examId));
    formData.set("proofImageUrl", proofImageUrl);
    formData.set("locale", locale);
    return formData;
}

describe("검정 증빙 업로드 액션", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.getSession.mockResolvedValue({ id: 2 });
        mocks.isValidPrivateImageBlob.mockResolvedValue(true);
        mocks.examFindFirst.mockResolvedValue({
            id: 30,
            mode: "basic",
            requiredGrade: 0,
            achievements: [],
            submissions: [],
        });
        mocks.submissionFindMany.mockResolvedValue([]);
        mocks.submissionFindFirst.mockResolvedValue(null);
        mocks.submissionDeleteMany.mockResolvedValue({ count: 0 });
        mocks.submissionCreate.mockResolvedValue({ id: 50 });
        mocks.claimUploadTokenQuota.mockResolvedValue({
            allowed: true,
            grantId: 70,
        });
        mocks.createPrivateImageUploadToken.mockResolvedValue({
            pathname: "exam-proofs/2/30/proof.jpg",
            token: "upload-token",
        });
        mocks.releaseUploadTokenQuota.mockResolvedValue(undefined);
        mocks.transaction.mockImplementation(async (callback) =>
            callback({
                examSubmission: {
                    deleteMany: mocks.submissionDeleteMany,
                    create: mocks.submissionCreate,
                },
            })
        );
    });

    it("발급 한도를 초과하면 Blob 업로드 토큰을 만들지 않는다", async () => {
        mocks.claimUploadTokenQuota.mockResolvedValue({
            allowed: false,
            grantId: null,
        });

        await expect(requestExamProofUpload(30, "image/jpeg")).resolves.toEqual(
            {
                success: false,
                message:
                    "이미지는 한 시간에 최대 10회까지 업로드할 수 있습니다.",
            }
        );

        expect(mocks.createPrivateImageUploadToken).not.toHaveBeenCalled();
    });

    it("허용된 검정에는 비공개 Blob 업로드 정보를 반환한다", async () => {
        await expect(
            requestExamProofUpload(30, "image/jpeg", "ja")
        ).resolves.toEqual({
            success: true,
            message: "",
            pathname: "exam-proofs/2/30/proof.jpg",
            token: "upload-token",
        });

        expect(mocks.createPrivateImageUploadToken).toHaveBeenCalledWith(
            "exam-proofs/2/30/proof",
            "image/jpeg"
        );
    });

    it("잘못된 검정과 이미지 형식을 서버 스키마에서 거부한다", async () => {
        await expect(
            requestExamProofUpload(0, "image/gif", "en")
        ).resolves.toEqual({
            success: false,
            message: "This exam is invalid.",
            fieldErrors: {
                examId: ["This exam is invalid."],
                contentType: [
                    "Only JPG, PNG, and WebP images can be uploaded.",
                ],
            },
        });

        expect(mocks.examFindFirst).not.toHaveBeenCalled();
        expect(mocks.createPrivateImageUploadToken).not.toHaveBeenCalled();
    });

    it("Blob 토큰 생성에 실패하면 소비한 발급 횟수를 되돌린다", async () => {
        mocks.createPrivateImageUploadToken.mockRejectedValueOnce(
            new Error("blob error")
        );

        await expect(requestExamProofUpload(30, "image/jpeg")).resolves.toEqual(
            {
                success: false,
                message: "이미지 업로드 요청을 처리하지 못했습니다.",
            }
        );

        expect(mocks.releaseUploadTokenQuota).toHaveBeenCalledWith(2, 70);
    });

    it("검정 조회 실패를 기록하고 업로드 토큰을 발급하지 않는다", async () => {
        mocks.examFindFirst.mockRejectedValueOnce(new Error("database error"));

        await expect(requestExamProofUpload(30, "image/jpeg")).resolves.toEqual(
            {
                success: false,
                message: "이미지 업로드 요청을 처리하지 못했습니다.",
            }
        );

        expect(mocks.createPrivateImageUploadToken).not.toHaveBeenCalled();
        expect(mocks.logServerError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                event: "exam.proof-upload.request.failed",
            })
        );
    });

    it("재제출이 성공하면 이전 반려 기록과 Blob을 정리한다", async () => {
        mocks.submissionFindMany.mockResolvedValue([
            { id: 40, proofImageUrl: rejectedProofUrl },
        ]);

        await expect(
            submitExamProof(createSubmissionFormData())
        ).resolves.toEqual({
            success: true,
            message: "합격 인증을 제출했습니다.",
        });

        expect(mocks.submissionDeleteMany).toHaveBeenCalledWith({
            where: { id: { in: [40] }, status: "rejected" },
        });
        expect(mocks.submissionCreate).toHaveBeenCalledWith({
            data: { userId: 2, examId: 30, proofImageUrl: proofUrl },
        });
        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(rejectedProofUrl);
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/exams");
    });

    it("DB 저장에 실패하면 새로 업로드한 Blob을 정리한다", async () => {
        mocks.transaction.mockRejectedValueOnce(new Error("database error"));

        await expect(
            submitExamProof(createSubmissionFormData())
        ).resolves.toEqual({
            success: false,
            message: "합격 인증 제출에 실패했습니다.",
        });

        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(proofUrl);
        expect(mocks.logServerError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                event: "exam.proof-submit.persist.failed",
            })
        );
    });

    it("잘못된 제출 데이터는 Blob 조회 전에 필드 오류로 반환한다", async () => {
        await expect(
            submitExamProof(
                createSubmissionFormData("invalid", "not-a-url", "ja")
            )
        ).resolves.toEqual({
            success: false,
            message: "無効な検定です。",
            fieldErrors: {
                examId: ["無効な検定です。"],
                proofImageUrl: ["許可されていない画像URLです。"],
            },
        });

        expect(mocks.isValidPrivateImageBlob).not.toHaveBeenCalled();
        expect(mocks.examFindFirst).not.toHaveBeenCalled();
    });

    it("현재 사용자의 검정 증빙 Blob이 아니면 제출하지 않는다", async () => {
        mocks.isValidPrivateImageBlob.mockResolvedValueOnce(false);

        await expect(
            submitExamProof(createSubmissionFormData())
        ).resolves.toEqual({
            success: false,
            message: "허용되지 않은 이미지 주소입니다.",
            fieldErrors: {
                proofImageUrl: ["허용되지 않은 이미지 주소입니다."],
            },
        });

        expect(mocks.examFindFirst).not.toHaveBeenCalled();
        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
    });

    it("현재 심사 중인 검정에는 새 제출을 만들지 않고 업로드를 정리한다", async () => {
        mocks.examFindFirst.mockResolvedValue({
            id: 30,
            mode: "basic",
            requiredGrade: 0,
            achievements: [],
            submissions: [{ id: 51 }],
        });

        await expect(
            submitExamProof(createSubmissionFormData())
        ).resolves.toEqual({
            success: false,
            message: "현재 심사 중입니다.",
        });

        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(proofUrl);
        expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("검정 조회에 실패하면 오류를 기록하고 업로드를 정리한다", async () => {
        mocks.examFindFirst.mockRejectedValueOnce(new Error("database error"));

        await expect(
            submitExamProof(createSubmissionFormData())
        ).resolves.toEqual({
            success: false,
            message: "합격 인증 제출에 실패했습니다.",
        });

        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(proofUrl);
        expect(mocks.logServerError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                event: "exam.proof-submit.availability.failed",
            })
        );
    });

    it("DB에서 사용하지 않는 중단된 업로드만 삭제한다", async () => {
        await discardExamProofUpload(30, proofUrl);
        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(proofUrl);

        vi.clearAllMocks();
        mocks.getSession.mockResolvedValue({ id: 2 });
        mocks.isValidPrivateImageBlob.mockResolvedValue(true);
        mocks.submissionFindFirst.mockResolvedValue({ id: 50 });

        await discardExamProofUpload(30, proofUrl);
        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
    });

    it("중단 업로드의 DB 조회 실패 시 삭제하지 않고 오류를 기록한다", async () => {
        mocks.submissionFindFirst.mockRejectedValueOnce(
            new Error("database error")
        );

        await discardExamProofUpload(30, proofUrl);

        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
        expect(mocks.logServerError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                event: "exam.proof-upload.discard.failed",
            })
        );
    });
});
