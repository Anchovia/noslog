import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    reportFindMany: vi.fn(),
    reportUpdateMany: vi.fn(),
    revalidatePath: vi.fn(),
    logServerError: vi.fn(),
}));

vi.mock("@/lib/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/db", () => ({
    default: {
        communityOpinionReport: {
            findMany: mocks.reportFindMany,
            updateMany: mocks.reportUpdateMany,
        },
    },
}));
vi.mock("next/cache", () => ({
    revalidatePath: mocks.revalidatePath,
    updateTag: vi.fn(),
}));
vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));

import { updateOpinionReportStatus } from "@/app/admin/feedback/actions";
import { createOpinionReportStatusUpdateFormData } from "@/features/feedback/schemas/opinion-report-admin-schema";
import { listOpinionReports } from "@/features/feedback/server/opinion-report-admin-service";

const chart = {
    difficulty: "HARD",
    musicIdx: "123",
    music: { title: "Grand Finale" },
};

describe("관리자 의견 신고 처리", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.reportFindMany.mockResolvedValue([]);
        mocks.reportUpdateMany.mockResolvedValue({ count: 1 });
    });

    it("의견 · 답글 신고를 채보 링크와 사유 문구로 보여 준다", async () => {
        const createdAt = new Date("2026-10-17T00:00:00.000Z");
        mocks.reportFindMany.mockResolvedValue([
            {
                id: 3,
                replyId: null,
                reason: "abuse",
                explanation: null,
                opinionSnapshot: "의견 본문",
                createdAt,
                user: { id: 2, username: "reporter", nostalgiaName: null },
                author: { id: 4, username: null, nostalgiaName: null },
                evaluation: { chart },
                reply: null,
            },
            {
                id: 5,
                replyId: 9,
                reason: "other",
                explanation: "설명",
                opinionSnapshot: "답글 본문",
                createdAt,
                user: { id: 2, username: "reporter", nostalgiaName: null },
                author: { id: 6, username: "writer", nostalgiaName: null },
                evaluation: null,
                reply: null,
            },
        ]);

        const reports = await listOpinionReports("pending");

        expect(reports[0]).toEqual({
            id: 3,
            target: "opinion",
            reason: "욕설·괴롭힘·혐오",
            explanation: null,
            snapshot: "의견 본문",
            createdAt: createdAt.toISOString(),
            status: "pending",
            reporter: { id: 2, name: "reporter" },
            author: { id: 4, name: "유저 4" },
            chart: {
                title: "Grand Finale",
                difficulty: "HARD",
                href: "/music/123/hard",
            },
        });
        // 답글이 지워져 채보를 찾지 못하면 링크 없이 본문 사본만 보인다
        expect(reports[1]).toMatchObject({
            target: "reply",
            reason: "기타",
            chart: null,
        });
        expect(mocks.reportFindMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { status: "pending" },
                orderBy: { createdAt: "desc" },
            })
        );
    });

    it("상태가 다를 때만 바꾸고 화면을 새로 그린다", async () => {
        await expect(
            updateOpinionReportStatus(
                createOpinionReportStatusUpdateFormData(3, "resolved")
            )
        ).resolves.toMatchObject({ success: true, status: "resolved" });
        expect(mocks.reportUpdateMany).toHaveBeenCalledWith({
            where: { id: 3, status: { not: "resolved" } },
            data: { status: "resolved" },
        });
        expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/feedback");
    });

    it("이미 처리됐거나 없는 신고는 실패로 알린다", async () => {
        mocks.reportUpdateMany.mockResolvedValue({ count: 0 });
        await expect(
            updateOpinionReportStatus(
                createOpinionReportStatusUpdateFormData(3, "resolved")
            )
        ).resolves.toMatchObject({ success: false });
        expect(mocks.revalidatePath).not.toHaveBeenCalled();
    });

    it("잘못된 상태 값은 저장하지 않는다", async () => {
        const formData = new FormData();
        formData.set("reportId", "3");
        formData.set("status", "deleted");
        await expect(
            updateOpinionReportStatus(formData)
        ).resolves.toMatchObject({ success: false });
        expect(mocks.reportUpdateMany).not.toHaveBeenCalled();
    });
});
