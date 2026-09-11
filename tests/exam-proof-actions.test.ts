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
    transactionQuery: vi.fn(),
    pendingFindFirst: vi.fn(),
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
            grade: 8,
            requiredGrade: 0,
            achievements: [],
            submissions: [],
        });
        mocks.userFindUnique.mockResolvedValue({
            nostalgia_name: "PLAYER",
            grade_basic: 235000,
            grade_recital: 100000,
            examAchievements: [],
        });
        mocks.submissionFindMany.mockResolvedValue([]);
        mocks.submissionFindFirst.mockResolvedValue(null);
        mocks.submissionDeleteMany.mockResolvedValue({ count: 0 });
        mocks.submissionCreate.mockResolvedValue({ id: 50 });
        mocks.transactionQuery.mockResolvedValue([{ id: 2 }]);
        mocks.pendingFindFirst.mockResolvedValue(null);
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
                $queryRaw: mocks.transactionQuery,
                examSubmission: {
                    findFirst: mocks.pendingFindFirst,
                    deleteMany: mocks.submissionDeleteMany,
                    create: mocks.submissionCreate,
                },
            })
        );
    });

    it.each([
        ["ko", "로그인이 필요합니다."],
        ["ja", "ログインが必要です。"],
        ["en", "You need to log in."],
    ] as const)(
        "%s 인증 만료 시 새 업로드 권한을 발급하지 않는다",
        async (locale, message) => {
            mocks.getSession.mockResolvedValue({});

            await expect(
                requestExamProofUpload(30, "image/jpeg", locale)
            ).resolves.toEqual({
                success: false,
                message,
                requiresLogin: true,
            });
            expect(mocks.examFindFirst).not.toHaveBeenCalled();
            expect(mocks.claimUploadTokenQuota).not.toHaveBeenCalled();
            expect(mocks.createPrivateImageUploadToken).not.toHaveBeenCalled();
        }
    );

    it.each([
        ["ko", "로그인이 필요합니다."],
        ["ja", "ログインが必要です。"],
        ["en", "You need to log in."],
    ] as const)(
        "%s 업로드 권한 발급 후 인증이 만료되면 저장과 삭제를 하지 않는다",
        async (locale, message) => {
            expect(
                (await requestExamProofUpload(30, "image/jpeg", locale)).success
            ).toBe(true);
            vi.clearAllMocks();
            mocks.getSession.mockResolvedValue({});

            await expect(
                submitExamProof(createSubmissionFormData(30, proofUrl, locale))
            ).resolves.toEqual({
                success: false,
                message,
                requiresLogin: true,
            });
            expect(mocks.isValidPrivateImageBlob).not.toHaveBeenCalled();
            expect(mocks.examFindFirst).not.toHaveBeenCalled();
            expect(mocks.transaction).not.toHaveBeenCalled();
            expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
            expect(mocks.revalidatePath).not.toHaveBeenCalled();
        }
    );

    it("인증이 만료된 중단 요청은 Blob을 조회하거나 삭제하지 않는다", async () => {
        mocks.getSession.mockResolvedValue({});
        await discardExamProofUpload(30, proofUrl);
        expect(mocks.isValidPrivateImageBlob).not.toHaveBeenCalled();
        expect(mocks.submissionFindFirst).not.toHaveBeenCalled();
        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
    });

    it("다른 계정으로 로그인한 뒤 이전 계정의 증빙을 제출하거나 삭제하지 않는다", async () => {
        mocks.getSession.mockResolvedValue({ id: 3 });
        mocks.isValidPrivateImageBlob.mockResolvedValue(false);
        expect(
            (await submitExamProof(createSubmissionFormData())).success
        ).toBe(false);
        await discardExamProofUpload(30, proofUrl);
        expect(mocks.isValidPrivateImageBlob).toHaveBeenCalledWith(
            proofUrl,
            "exam-proofs/3/30/proof"
        );
        expect(mocks.transaction).not.toHaveBeenCalled();
        expect(mocks.submissionFindFirst).not.toHaveBeenCalled();
        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
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

    it("DB 저장 결과가 불확실하면 재시도할 증빙을 삭제하지 않는다", async () => {
        mocks.transaction.mockRejectedValueOnce(new Error("database error"));

        await expect(
            submitExamProof(createSubmissionFormData())
        ).resolves.toEqual({
            success: false,
            message: "합격 인증 제출에 실패했습니다.",
        });

        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
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

    it("현재 심사 중인 검정에는 새 제출을 만들거나 증빙을 삭제하지 않는다", async () => {
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

        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
        expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("검정 조회에 실패하면 증빙을 보존하고 오류를 기록한다", async () => {
        mocks.examFindFirst.mockRejectedValueOnce(new Error("database error"));

        await expect(
            submitExamProof(createSubmissionFormData())
        ).resolves.toEqual({
            success: false,
            message: "합격 인증 제출에 실패했습니다.",
        });

        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
        expect(mocks.logServerError).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                event: "exam.proof-submit.availability.failed",
            })
        );
    });

    it("Event에는 업로드 토큰과 새 제출을 허용하지 않는다", async () => {
        mocks.examFindFirst.mockResolvedValue({
            id: 30,
            mode: "event",
            grade: null,
            requiredGrade: 0,
            achievements: [],
            submissions: [],
        });
        expect((await requestExamProofUpload(30, "image/jpeg")).success).toBe(
            false
        );
        expect(
            (await submitExamProof(createSubmissionFormData())).success
        ).toBe(false);
        expect(mocks.createPrivateImageUploadToken).not.toHaveBeenCalled();
        expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("동기화된 이름이 없으면 요구 Grd.가 0이어도 업로드를 허용하지 않는다", async () => {
        mocks.userFindUnique.mockResolvedValue({
            nostalgia_name: null,
            grade_basic: 0,
            grade_recital: null,
            examAchievements: [],
        });
        expect((await requestExamProofUpload(30, "image/jpeg")).success).toBe(
            false
        );
        expect(mocks.createPrivateImageUploadToken).not.toHaveBeenCalled();
    });

    it("응답을 잃은 동일 증빙의 재제출은 성공하며 기존 자료를 보존한다", async () => {
        mocks.submissionFindFirst.mockResolvedValue({ status: "pending" });
        expect(
            (await submitExamProof(createSubmissionFormData())).success
        ).toBe(true);
        expect(mocks.transaction).not.toHaveBeenCalled();
        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
    });

    it("동시 요청이 잠금 대기 중 생성한 동일 증빙을 중복 저장하지 않는다", async () => {
        mocks.pendingFindFirst.mockResolvedValue({ proofImageUrl: proofUrl });
        expect(
            (await submitExamProof(createSubmissionFormData())).success
        ).toBe(true);
        expect(mocks.submissionCreate).not.toHaveBeenCalled();
        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
    });

    it("동시 요청의 다른 증빙은 대기 중 제출을 덮어쓰지 않는다", async () => {
        mocks.pendingFindFirst.mockResolvedValue({
            proofImageUrl: rejectedProofUrl,
        });
        expect(
            (await submitExamProof(createSubmissionFormData())).success
        ).toBe(false);
        expect(mocks.submissionCreate).not.toHaveBeenCalled();
        expect(mocks.submissionDeleteMany).not.toHaveBeenCalled();
        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
    });

    it("반려된 증빙 URL을 새 제출에 재사용하거나 삭제하지 않는다", async () => {
        mocks.submissionFindFirst.mockResolvedValue({ status: "rejected" });
        expect(
            (await submitExamProof(createSubmissionFormData())).success
        ).toBe(false);
        expect(mocks.transaction).not.toHaveBeenCalled();
        expect(mocks.deleteBlobIfOwned).not.toHaveBeenCalled();
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
