import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    isValidImageBlob: vi.fn(),
    deleteBlobIfOwned: vi.fn(),
    createImageUploadToken: vi.fn(),
    examFindFirst: vi.fn(),
    userFindUnique: vi.fn(),
    submissionFindMany: vi.fn(),
    submissionFindFirst: vi.fn(),
    transaction: vi.fn(),
    submissionDeleteMany: vi.fn(),
    submissionCreate: vi.fn(),
    revalidatePath: vi.fn(),
}));

vi.mock("@/lib/session", () => ({
    default: mocks.getSession,
}));

vi.mock("@/lib/blob", () => ({
    createImageUploadToken: mocks.createImageUploadToken,
    deleteBlobIfOwned: mocks.deleteBlobIfOwned,
    isValidImageBlob: mocks.isValidImageBlob,
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
    submitExamProof,
} from "@/app/(nevigation)/exams/actions";

const proofUrl =
    "https://store.public.blob.vercel-storage.com/exam-proofs/2/30/proof-new.jpg";
const rejectedProofUrl =
    "https://store.public.blob.vercel-storage.com/exam-proofs/2/30/proof-old.jpg";

describe("검정 증빙 업로드 액션", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.getSession.mockResolvedValue({ id: 2 });
        mocks.isValidImageBlob.mockResolvedValue(true);
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
        mocks.transaction.mockImplementation(async (callback) =>
            callback({
                examSubmission: {
                    deleteMany: mocks.submissionDeleteMany,
                    create: mocks.submissionCreate,
                },
            })
        );
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
        mocks.isValidImageBlob.mockResolvedValue(true);
        mocks.submissionFindFirst.mockResolvedValue({ id: 50 });

        await discardExamProofUpload(30, proofUrl);
        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
    });
});
