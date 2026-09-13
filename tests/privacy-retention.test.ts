import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    feedbackFindMany: vi.fn(),
    feedbackDeleteMany: vi.fn(),
    submissionFindMany: vi.fn(),
    submissionUpdateMany: vi.fn(),
    submissionDeleteMany: vi.fn(),
    executeRaw: vi.fn(),
    deleteBlobStrict: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
    default: {
        feedbackReport: {
            findMany: mocks.feedbackFindMany,
            deleteMany: mocks.feedbackDeleteMany,
        },
        examSubmission: {
            findMany: mocks.submissionFindMany,
            updateMany: mocks.submissionUpdateMany,
            deleteMany: mocks.submissionDeleteMany,
        },
        $executeRaw: mocks.executeRaw,
    },
}));

vi.mock("@/lib/blob", () => ({
    deleteBlobStrict: mocks.deleteBlobStrict,
}));

import { runPrivacyRetention } from "@/lib/privacyRetention";

describe("개인정보 6개월 보관 정리", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.feedbackFindMany.mockResolvedValue([
            { id: 1, imageUrl: "feedback-image" },
        ]);
        mocks.submissionFindMany
            .mockResolvedValueOnce([{ id: 2, proofImageUrl: "approved-proof" }])
            .mockResolvedValueOnce([
                { id: 3, proofImageUrl: "rejected-proof" },
            ]);
        mocks.deleteBlobStrict.mockResolvedValue(undefined);
        mocks.feedbackDeleteMany.mockResolvedValue({ count: 1 });
        mocks.submissionUpdateMany.mockResolvedValue({ count: 1 });
        mocks.submissionDeleteMany.mockResolvedValue({ count: 1 });
        mocks.executeRaw
            .mockResolvedValueOnce(12)
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(40);
    });

    it("처리 완료 자료를 유형별 보관 정책에 맞게 정리한다", async () => {
        const result = await runPrivacyRetention(
            new Date("2026-07-27T03:00:00+09:00")
        );

        expect(result).toMatchObject({
            cutoff: "2026-01-26T18:00:00.000Z",
            feedbackDeleted: 1,
            approvedExamRedacted: 1,
            rejectedExamDeleted: 1,
            failed: 0,
        });
        expect(mocks.submissionUpdateMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    id: 2,
                    status: "approved",
                }),
                data: { proofImageUrl: null, reviewerNote: null },
            })
        );
        expect(mocks.submissionDeleteMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    id: 3,
                    status: "rejected",
                }),
            })
        );
    });

    it("방문자 해시·그날의 무작위 값은 오늘(서울) 이전 것을, 날짜별 합계는 90일 지난 것을 지운다", async () => {
        const result = await runPrivacyRetention(
            new Date("2026-07-27T03:00:00+09:00")
        );

        expect(result).toMatchObject({
            analyticsVisitorsDeleted: 12,
            analyticsSaltsDeleted: 1,
            analyticsCountsDeleted: 40,
        });
        // 태그 템플릿 호출의 값 부분 — [SQL 조각, 날짜]
        const dates = mocks.executeRaw.mock.calls.map((call) => call.slice(1));
        expect(dates).toEqual([["2026-07-27"], ["2026-07-27"], ["2026-04-28"]]);
        const statements = mocks.executeRaw.mock.calls.map((call) =>
            (call[0] as string[]).join("?")
        );
        expect(statements[0]).toContain('"analytics_visitors"');
        expect(statements[1]).toContain('"analytics_salts"');
        expect(statements[2]).toContain('"analytics_daily_counts"');
    });

    it("Blob 삭제가 실패한 자료는 DB에서 삭제하지 않는다", async () => {
        mocks.deleteBlobStrict.mockRejectedValueOnce(new Error("blob error"));

        const result = await runPrivacyRetention(
            new Date("2026-07-27T03:00:00+09:00")
        );

        expect(result.failed).toBe(1);
        expect(mocks.feedbackDeleteMany).not.toHaveBeenCalled();
        expect(mocks.submissionUpdateMany).toHaveBeenCalledOnce();
        expect(mocks.submissionDeleteMany).toHaveBeenCalledOnce();
    });
});
