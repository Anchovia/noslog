import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    transaction: vi.fn(),
    musicUpdate: vi.fn(),
    musicChartUpdateMany: vi.fn(),
    musicChartFindUnique: vi.fn(),
    musicChartUpdate: vi.fn(),
    constantHistoryCreate: vi.fn(),
    evaluationDelete: vi.fn(),
    examFindUnique: vi.fn(),
    examDelete: vi.fn(),
    bingoProgressCount: vi.fn(),
    bingoDelete: vi.fn(),
    userUpdate: vi.fn(),
    examSubmissionFindFirst: vi.fn(),
    examSubmissionFindUnique: vi.fn(),
    examSubmissionDelete: vi.fn(),
    examSubmissionUpdate: vi.fn(),
    examAchievementUpsert: vi.fn(),
    examAchievementDeleteMany: vi.fn(),
    updateTag: vi.fn(),
    revalidatePath: vi.fn(),
    redirect: vi.fn(),
    deleteBlobIfOwned: vi.fn(),
}));

const transactionClient = {
    musicChart: { update: mocks.musicChartUpdate },
    chartLevelConstantHistory: { create: mocks.constantHistoryCreate },
    examSubmission: {
        update: mocks.examSubmissionUpdate,
        delete: mocks.examSubmissionDelete,
    },
    examAchievement: {
        upsert: mocks.examAchievementUpsert,
        deleteMany: mocks.examAchievementDeleteMany,
    },
};

vi.mock("@/lib/admin", () => ({
    requireAdmin: mocks.requireAdmin,
}));

vi.mock("@/lib/db", () => ({
    default: {
        $transaction: mocks.transaction,
        music: { update: mocks.musicUpdate },
        musicChart: {
            updateMany: mocks.musicChartUpdateMany,
            findUnique: mocks.musicChartFindUnique,
        },
        chartEvaluation: { delete: mocks.evaluationDelete },
        exam: {
            findUnique: mocks.examFindUnique,
            delete: mocks.examDelete,
        },
        bingoCellProgress: { count: mocks.bingoProgressCount },
        bingo: { delete: mocks.bingoDelete },
        user: { update: mocks.userUpdate },
        examSubmission: {
            findFirst: mocks.examSubmissionFindFirst,
            findUnique: mocks.examSubmissionFindUnique,
            delete: mocks.examSubmissionDelete,
        },
    },
}));

vi.mock("@/lib/blob", () => ({
    deleteBlobIfOwned: mocks.deleteBlobIfOwned,
}));

vi.mock("next/cache", () => ({
    updateTag: mocks.updateTag,
    revalidatePath: mocks.revalidatePath,
}));

vi.mock("next/navigation", () => ({
    redirect: mocks.redirect,
}));

import { deleteEvaluation } from "@/app/admin/community/actions";
import { deleteExam } from "@/app/admin/exams/actions";
import {
    saveChartMetadata,
    saveMusicMetadata,
} from "@/app/admin/music/actions";
import { deleteBingo } from "@/app/admin/bingos/actions";
import { updateUserRole } from "@/app/admin/users/actions";
import {
    deleteExamSubmission,
    reviewExamSubmission,
} from "@/app/admin/submissions/actions";

describe("관리자 액션", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.musicUpdate.mockResolvedValue({ id: 1 });
        mocks.musicChartUpdateMany.mockResolvedValue({ count: 4 });
        mocks.musicChartUpdate.mockResolvedValue({ id: 10 });
        mocks.constantHistoryCreate.mockResolvedValue({ id: 1 });
        mocks.evaluationDelete.mockResolvedValue({ id: 20 });
        mocks.examDelete.mockResolvedValue({ id: 30 });
        mocks.bingoDelete.mockResolvedValue({ id: 40 });
        mocks.userUpdate.mockResolvedValue({ id: 2 });
        mocks.examSubmissionUpdate.mockResolvedValue({ id: 50 });
        mocks.examSubmissionDelete.mockResolvedValue({ id: 50 });
        mocks.examAchievementUpsert.mockResolvedValue({ id: 60 });
        mocks.examAchievementDeleteMany.mockResolvedValue({ count: 0 });
        mocks.transaction.mockImplementation(async (input) => {
            if (typeof input === "function") {
                return input(transactionClient);
            }
            return Promise.all(input);
        });
    });

    it("관리자 인증에 실패하면 DB를 수정하지 않는다", async () => {
        mocks.requireAdmin.mockRejectedValueOnce(new Error("forbidden"));
        const formData = new FormData();
        formData.set("musicIndex", "test-music");

        await expect(saveMusicMetadata(formData)).rejects.toThrow("forbidden");
        expect(mocks.musicUpdate).not.toHaveBeenCalled();
    });

    it("악곡 공통 정보를 저장하고 관련 캐시를 갱신한다", async () => {
        const formData = new FormData();
        formData.set("musicIndex", "test-music");
        formData.set("description", "악곡 설명");
        formData.set("bpmMin", "120.4");
        formData.set("bpmMax", "180.6");
        formData.set("durationSeconds", "125.7");

        await saveMusicMetadata(formData);

        expect(mocks.musicUpdate).toHaveBeenCalledWith({
            where: { index: "test-music" },
            data: { description: "악곡 설명" },
        });
        expect(mocks.musicChartUpdateMany).toHaveBeenCalledWith({
            where: { music_idx: "test-music" },
            data: { bpm_min: 120, bpm_max: 181, duration_seconds: 126 },
        });
        expect(mocks.updateTag).toHaveBeenCalledWith("music-catalog");
        expect(mocks.updateTag).toHaveBeenCalledWith("music-details");
    });

    it("채보 저장 시 레벨 상수 변경 이력을 생성한다", async () => {
        mocks.musicChartFindUnique.mockResolvedValue({
            level_constant: 11,
            difficulty: "Expert",
        });
        const formData = new FormData();
        formData.set("chartId", "10");
        formData.set("musicIndex", "test-music");
        formData.set("levelConstant", "11.2");
        formData.set("noteCount", "1000");
        formData.set("releasedAt", "2026-07-17");

        await saveChartMetadata(formData);

        expect(mocks.musicChartUpdate).toHaveBeenCalledWith({
            where: { id: 10 },
            data: expect.objectContaining({
                level_constant: 11.2,
                note_count: 1000,
                released_at: new Date("2026-07-17T00:00:00.000Z"),
            }),
        });
        expect(mocks.constantHistoryCreate).toHaveBeenCalledWith({
            data: { chart_id: 10, value: 11.2 },
        });
    });

    it("평가 전체 삭제 후 의견 캐시를 갱신한다", async () => {
        const formData = new FormData();
        formData.set("evaluationId", "20");

        await deleteEvaluation(formData);

        expect(mocks.evaluationDelete).toHaveBeenCalledWith({
            where: { id: 20 },
        });
        expect(mocks.updateTag).toHaveBeenCalledWith("chart-evaluations");
    });

    it("인증 이력이 있는 검정은 삭제하지 않는다", async () => {
        mocks.examFindUnique.mockResolvedValue({
            _count: { submissions: 1, achievements: 0 },
        });

        const result = await deleteExam(30);

        expect(result).toEqual({
            success: false,
            message: "인증 이력이 있는 검정은 삭제할 수 없습니다.",
        });
        expect(mocks.examDelete).not.toHaveBeenCalled();
    });

    it("인증 이력이 없는 검정을 삭제하고 캐시를 갱신한다", async () => {
        mocks.examFindUnique.mockResolvedValue({
            _count: { submissions: 0, achievements: 0 },
        });

        await expect(deleteExam(30)).resolves.toEqual({ success: true });
        expect(mocks.examDelete).toHaveBeenCalledWith({ where: { id: 30 } });
        expect(mocks.updateTag).toHaveBeenCalledWith("exams");
    });

    it("진행 기록이 있는 빙고는 삭제하지 않는다", async () => {
        mocks.bingoProgressCount.mockResolvedValue(1);
        const formData = new FormData();
        formData.set("id", "40");

        await deleteBingo(formData);

        expect(mocks.bingoDelete).not.toHaveBeenCalled();
        expect(mocks.redirect).not.toHaveBeenCalled();
    });

    it("진행 기록이 없는 빙고를 삭제하고 캐시를 갱신한다", async () => {
        mocks.bingoProgressCount.mockResolvedValue(0);
        const formData = new FormData();
        formData.set("id", "40");

        await deleteBingo(formData);

        expect(mocks.bingoDelete).toHaveBeenCalledWith({ where: { id: 40 } });
        expect(mocks.updateTag).toHaveBeenCalledWith("bingos");
        expect(mocks.redirect).toHaveBeenCalledWith("/admin/bingos");
    });

    it("관리자는 다른 사용자의 역할을 변경할 수 있다", async () => {
        const formData = new FormData();
        formData.set("userId", "2");
        formData.set("role", "admin");

        await updateUserRole(formData);

        expect(mocks.userUpdate).toHaveBeenCalledWith({
            where: { id: 2 },
            data: { role: "admin" },
        });
    });

    it("관리자는 자신의 관리자 권한을 해제할 수 없다", async () => {
        const formData = new FormData();
        formData.set("userId", "1");
        formData.set("role", "user");

        await updateUserRole(formData);

        expect(mocks.userUpdate).not.toHaveBeenCalled();
    });

    it("대기 상태가 아닌 검정 제출은 다시 심사하지 않는다", async () => {
        mocks.examSubmissionFindFirst.mockResolvedValue(null);
        const formData = new FormData();
        formData.set("submissionId", "50");
        formData.set("status", "approved");

        await reviewExamSubmission(formData);

        expect(mocks.examSubmissionFindFirst).toHaveBeenCalledWith({
            where: { id: 50, status: "pending" },
            select: { id: true, userId: true, examId: true },
        });
        expect(mocks.transaction).not.toHaveBeenCalled();
    });

    it("대기 중인 검정 제출을 승인하고 합격 이력을 생성한다", async () => {
        mocks.examSubmissionFindFirst.mockResolvedValue({
            id: 50,
            userId: 2,
            examId: 30,
        });
        const formData = new FormData();
        formData.set("submissionId", "50");
        formData.set("status", "approved");

        await reviewExamSubmission(formData);

        expect(mocks.examSubmissionUpdate).toHaveBeenCalledWith({
            where: { id: 50 },
            data: expect.objectContaining({ status: "approved" }),
        });
        expect(mocks.examAchievementUpsert).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { userId_examId: { userId: 2, examId: 30 } },
            })
        );
    });

    it("검정 제출과 연결된 합격 이력을 함께 삭제한 뒤 Blob을 정리한다", async () => {
        mocks.examSubmissionFindUnique.mockResolvedValue({
            id: 50,
            proofImageUrl:
                "https://store.public.blob.vercel-storage.com/proof.jpg",
        });
        const formData = new FormData();
        formData.set("submissionId", "50");

        await deleteExamSubmission(formData);

        expect(mocks.examAchievementDeleteMany).toHaveBeenCalledWith({
            where: { submissionId: 50 },
        });
        expect(mocks.examSubmissionDelete).toHaveBeenCalledWith({
            where: { id: 50 },
        });
        expect(mocks.deleteBlobIfOwned).toHaveBeenCalledWith(
            "https://store.public.blob.vercel-storage.com/proof.jpg"
        );
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/submissions");
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/exams");
    });
});
