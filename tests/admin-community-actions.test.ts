import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    evaluationFindMany: vi.fn(),
    evaluationFindUnique: vi.fn(),
    evaluationDelete: vi.fn(),
    updateTag: vi.fn(),
    revalidatePath: vi.fn(),
    logServerError: vi.fn(),
}));

vi.mock("@/lib/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/db", () => ({
    default: {
        chartEvaluation: {
            findMany: mocks.evaluationFindMany,
            findUnique: mocks.evaluationFindUnique,
            delete: mocks.evaluationDelete,
        },
    },
}));
vi.mock("next/cache", () => ({
    updateTag: mocks.updateTag,
    revalidatePath: mocks.revalidatePath,
}));
vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));

import { deleteEvaluation } from "@/app/admin/community/actions";
import { listAdminChartEvaluations } from "@/features/music/server/chartEvaluationAdminService";

function deleteForm(evaluationId = "20") {
    const formData = new FormData();
    formData.set("evaluationId", evaluationId);
    return formData;
}

describe("관리자 커뮤니티 평가 관리", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.evaluationFindMany.mockResolvedValue([]);
        mocks.evaluationFindUnique.mockResolvedValue({ id: 20 });
        mocks.evaluationDelete.mockResolvedValue({ id: 20 });
    });

    it("평가와 추천 집계를 관리자 화면용 타입으로 정규화한다", async () => {
        mocks.evaluationFindMany.mockResolvedValue([
            {
                id: 20,
                perceived_constant: 12.4,
                stairs: 4,
                repetition: 3,
                chord: 2,
                trill: 1,
                glissando: 0,
                comment: "계단 구간이 어렵습니다.",
                user: {
                    id: 2,
                    username: "noslog-user",
                    nostalgia_name: "NOSTALGIA USER",
                },
                chart: {
                    difficulty: "Expert",
                    music: { title: "Altale" },
                },
                reactions: [{ value: 1 }, { value: 1 }, { value: -1 }],
            },
        ]);

        await expect(listAdminChartEvaluations()).resolves.toEqual([
            {
                id: 20,
                chart: { difficulty: "Expert", musicTitle: "Altale" },
                comment: "계단 구간이 어렵습니다.",
                patterns: {
                    stairs: 4,
                    repetition: 3,
                    chord: 2,
                    trill: 1,
                    glissando: 0,
                },
                perceivedConstant: 12.4,
                reactions: { up: 2, down: 1 },
                userName: "NOSTALGIA USER",
            },
        ]);
    });

    it("평가 전체를 삭제하고 의견 캐시를 갱신한다", async () => {
        await expect(deleteEvaluation(deleteForm())).resolves.toEqual({
            success: true,
            message: "평가를 삭제했습니다.",
        });

        expect(mocks.evaluationDelete).toHaveBeenCalledWith({
            where: { id: 20 },
        });
        expect(mocks.updateTag).toHaveBeenCalledWith("chart-evaluations");
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/community");
    });

    it("잘못된 요청은 평가를 조회하지 않는다", async () => {
        await expect(deleteEvaluation(deleteForm("0"))).resolves.toEqual({
            success: false,
            message: "잘못된 평가입니다.",
        });
        expect(mocks.evaluationFindUnique).not.toHaveBeenCalled();
    });

    it("존재하지 않는 평가는 삭제하지 않는다", async () => {
        mocks.evaluationFindUnique.mockResolvedValue(null);

        await expect(deleteEvaluation(deleteForm())).resolves.toEqual({
            success: false,
            message: "평가를 찾을 수 없습니다.",
        });
        expect(mocks.evaluationDelete).not.toHaveBeenCalled();
    });

    it("삭제 실패를 기록하고 사용자 오류로 반환한다", async () => {
        const error = new Error("database unavailable");
        mocks.evaluationDelete.mockRejectedValue(error);

        await expect(deleteEvaluation(deleteForm())).resolves.toEqual({
            success: false,
            message: "평가를 삭제하지 못했습니다.",
        });
        expect(mocks.logServerError).toHaveBeenCalledWith(error, {
            event: "admin.chart-evaluation.delete.failed",
            routePath: "/admin/community",
            routeType: "action",
        });
    });
});
