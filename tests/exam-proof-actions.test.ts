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

import {
    discardExamProofUpload,
    requestExamProofUpload,
    submitExamProof,
} from "@/app/(nevigation)/exams/actions";

const proofUrl =
    "https://store.private.blob.vercel-storage.com/exam-proofs/2/30/proof-new.jpg";
const rejectedProofUrl =
    "https://store.private.blob.vercel-storage.com/exam-proofs/2/30/proof-old.jpg";

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

    it("재제출이 성공하면 이전 반려 기록과 Blob을 정리한다", async () => {
        mocks.submissionFindMany.mockResolvedValue([
            { id: 40, proofImageUrl: rejectedProofUrl },
        ]);

        await expect(submitExamProof(30, proofUrl)).resolves.toEqual({
            success: true,
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

        await expect(submitExamProof(30, proofUrl)).resolves.toEqual({
            success: false,
            message: "합격 인증 제출에 실패했습니다.",
        });

        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(proofUrl);
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
});
