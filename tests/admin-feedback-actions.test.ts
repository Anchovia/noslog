import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    feedbackFindMany: vi.fn(),
    feedbackFindUnique: vi.fn(),
    feedbackUpdate: vi.fn(),
    revalidatePath: vi.fn(),
    logServerError: vi.fn(),
}));

vi.mock("@/lib/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/db", () => ({
    default: {
        feedbackReport: {
            findMany: mocks.feedbackFindMany,
            findUnique: mocks.feedbackFindUnique,
            update: mocks.feedbackUpdate,
        },
    },
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));

import { updateFeedbackStatus } from "@/app/admin/feedback/actions";
import { listFeedbackReports } from "@/features/feedback/server/feedbackAdminService";

function statusForm(status: "open" | "resolved") {
    const formData = new FormData();
    formData.set("feedbackId", "7");
    formData.set("status", status);
    return formData;
}

describe("관리자 피드백 처리", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.feedbackFindMany.mockResolvedValue([]);
        mocks.feedbackFindUnique.mockResolvedValue({ id: 7, status: "open" });
        mocks.feedbackUpdate.mockResolvedValue({ id: 7 });
    });

    it("목록 데이터를 관리자 화면용 타입으로 정규화한다", async () => {
        const createdAt = new Date("2026-09-04T00:00:00.000Z");
        mocks.feedbackFindMany.mockResolvedValue([
            {
                id: 7,
                content: "충분한 길이의 피드백입니다.",
                imageUrl: "https://private.example/feedback/7.png",
                createdAt,
                user: {
                    id: 2,
                    username: "noslog-user",
                    nostalgia_name: "NOSTALGIA USER",
                },
            },
        ]);

        await expect(listFeedbackReports("open")).resolves.toEqual([
            {
                id: 7,
                content: "충분한 길이의 피드백입니다.",
                createdAt: createdAt.toISOString(),
                hasImage: true,
                status: "open",
                user: { id: 2, name: "noslog-user" },
            },
        ]);
        expect(mocks.feedbackFindMany).toHaveBeenCalledWith({
            where: { status: "open" },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        nostalgia_name: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });
    });

    it("접수된 피드백을 처리 완료로 변경한다", async () => {
        await expect(
            updateFeedbackStatus(statusForm("resolved"))
        ).resolves.toEqual({
            success: true,
            message: "피드백을 처리 완료했습니다.",
            status: "resolved",
        });

        expect(mocks.feedbackUpdate).toHaveBeenCalledWith({
            where: { id: 7 },
            data: {
                status: "resolved",
                resolvedAt: expect.any(Date),
            },
        });
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin");
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/feedback");
    });

    it("처리 완료된 피드백을 다시 열고 완료 시각을 제거한다", async () => {
        mocks.feedbackFindUnique.mockResolvedValue({
            id: 7,
            status: "resolved",
        });

        await expect(updateFeedbackStatus(statusForm("open"))).resolves.toEqual(
            {
                success: true,
                message: "피드백을 다시 열었습니다.",
                status: "open",
            }
        );
        expect(mocks.feedbackUpdate).toHaveBeenCalledWith({
            where: { id: 7 },
            data: { status: "open", resolvedAt: null },
        });
    });

    it("잘못된 요청은 피드백을 조회하지 않는다", async () => {
        const formData = new FormData();
        formData.set("feedbackId", "0");
        formData.set("status", "resolved");

        await expect(updateFeedbackStatus(formData)).resolves.toMatchObject({
            success: false,
            message: "잘못된 피드백입니다.",
        });
        expect(mocks.feedbackFindUnique).not.toHaveBeenCalled();
    });

    it("존재하지 않는 피드백을 변경하지 않는다", async () => {
        mocks.feedbackFindUnique.mockResolvedValue(null);

        await expect(
            updateFeedbackStatus(statusForm("resolved"))
        ).resolves.toEqual({
            success: false,
            message: "피드백을 찾을 수 없습니다.",
        });
        expect(mocks.feedbackUpdate).not.toHaveBeenCalled();
    });

    it("같은 상태로 중복 처리하지 않는다", async () => {
        await expect(updateFeedbackStatus(statusForm("open"))).resolves.toEqual(
            {
                success: false,
                message: "이미 접수 상태인 피드백입니다.",
            }
        );
        expect(mocks.feedbackUpdate).not.toHaveBeenCalled();
    });

    it("저장 실패를 기록하고 사용자 오류로 반환한다", async () => {
        const error = new Error("database unavailable");
        mocks.feedbackUpdate.mockRejectedValue(error);

        await expect(
            updateFeedbackStatus(statusForm("resolved"))
        ).resolves.toEqual({
            success: false,
            message: "피드백 상태를 변경하지 못했습니다.",
        });
        expect(mocks.logServerError).toHaveBeenCalledWith(error, {
            event: "admin.feedback.status-update.failed",
            routePath: "/admin/feedback",
            routeType: "action",
        });
    });
});
