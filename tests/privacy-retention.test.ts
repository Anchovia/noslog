import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    feedbackFindMany: vi.fn(),
    feedbackDeleteMany: vi.fn(),
    submissionFindMany: vi.fn(),
    submissionUpdateMany: vi.fn(),
    submissionDeleteMany: vi.fn(),
    executeRaw: vi.fn(),
    deleteBlobStrict: vi.fn(),
    userFindMany: vi.fn(),
    eventFindMany: vi.fn(),
    translationFindMany: vi.fn(),
    blobList: vi.fn(),
    blobDel: vi.fn(),
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
        user: { findMany: mocks.userFindMany },
        communityEvent: { findMany: mocks.eventFindMany },
        announcementTranslation: { findMany: mocks.translationFindMany },
        $executeRaw: mocks.executeRaw,
    },
}));

vi.mock("@/lib/blob", () => ({
    deleteBlobStrict: mocks.deleteBlobStrict,
}));

vi.mock("@vercel/blob", () => ({
    list: mocks.blobList,
    del: mocks.blobDel,
}));

import { runPrivacyRetention } from "@/lib/privacy-retention";

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
        mocks.blobList.mockResolvedValue({ blobs: [], hasMore: false });
        mocks.blobDel.mockResolvedValue(undefined);
        mocks.userFindMany.mockResolvedValue([]);
        mocks.eventFindMany.mockResolvedValue([]);
        mocks.translationFindMany.mockResolvedValue([]);
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
                data: { proofImageUrl: null, reviewNote: null },
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

describe("저장하지 않은 공개 업로드 정리", () => {
    const now = new Date("2026-07-27T03:00:00+09:00");
    const host = "https://abc.public.blob.vercel-storage.com";
    const blob = (pathname: string, uploadedAt: string) => ({
        url: `${host}/${pathname}`,
        pathname,
        uploadedAt: new Date(uploadedAt),
    });
    const old = "2026-07-26T02:59:59+09:00";
    const recent = "2026-07-26T03:00:01+09:00";

    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv("VERCEL_ENV", "production");
        mocks.feedbackFindMany.mockResolvedValue([]);
        mocks.submissionFindMany.mockResolvedValue([]);
        mocks.executeRaw.mockResolvedValue(0);
        mocks.blobDel.mockResolvedValue(undefined);
        mocks.userFindMany.mockResolvedValue([]);
        mocks.eventFindMany.mockResolvedValue([]);
        mocks.translationFindMany.mockResolvedValue([]);
    });
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("24시간이 지났고 어디에도 주소가 없는 파일만 지운다", async () => {
        mocks.blobList.mockImplementation(
            async ({ prefix }: { prefix: string }) => ({
                hasMore: false,
                blobs:
                    prefix === "avatars/"
                        ? [
                              blob("avatars/1/profile-used.webp", old),
                              blob("avatars/2/profile-orphan.webp", old),
                              blob("avatars/3/profile-new.webp", recent),
                          ]
                        : [
                              blob("events/4/banner-draft.webp", old),
                              blob("events/4/banner-public.webp", old),
                              blob("events/4/image-draft.webp", old),
                              blob("events/4/image-public.webp", old),
                              blob("events/5/image-notice.webp", old),
                              blob("events/6/image-orphan.webp", old),
                          ],
            })
        );
        mocks.userFindMany.mockResolvedValue([
            { avatar: `${host}/avatars/1/profile-used.webp` },
        ]);
        mocks.eventFindMany.mockResolvedValue([
            {
                bannerUrl: `${host}/events/4/banner-draft.webp`,
                publishedBannerUrl: `${host}/events/4/banner-public.webp`,
                content: `본문\n\n![](${host}/events/4/image-draft.webp)`,
                publishedContent: `![사진](${host}/events/4/image-public.webp)`,
            },
        ]);
        mocks.translationFindMany.mockResolvedValue([
            { content: `![](${host}/events/5/image-notice.webp)` },
        ]);

        const result = await runPrivacyRetention(now);

        expect(mocks.blobList).toHaveBeenCalledWith({
            prefix: "avatars/",
            cursor: undefined,
        });
        expect(mocks.blobList).toHaveBeenCalledWith({
            prefix: "events/",
            cursor: undefined,
        });
        expect(mocks.blobDel).toHaveBeenCalledOnce();
        expect(mocks.blobDel).toHaveBeenCalledWith([
            `${host}/avatars/2/profile-orphan.webp`,
            `${host}/events/6/image-orphan.webp`,
        ]);
        expect(result).toMatchObject({ orphanUploadsDeleted: 2, failed: 0 });
    });

    it("목록은 cursor 로 끝까지 받는다", async () => {
        mocks.blobList.mockImplementation(
            async ({ prefix, cursor }: { prefix: string; cursor?: string }) =>
                prefix === "avatars/" && !cursor
                    ? {
                          hasMore: true,
                          cursor: "next",
                          blobs: [blob("avatars/1/profile-a.webp", old)],
                      }
                    : {
                          hasMore: false,
                          blobs:
                              prefix === "avatars/"
                                  ? [blob("avatars/1/profile-b.webp", old)]
                                  : [],
                      }
        );

        const result = await runPrivacyRetention(now);

        expect(mocks.blobList).toHaveBeenCalledWith({
            prefix: "avatars/",
            cursor: "next",
        });
        expect(mocks.blobDel).toHaveBeenCalledWith([
            `${host}/avatars/1/profile-a.webp`,
            `${host}/avatars/1/profile-b.webp`,
        ]);
        expect(result.orphanUploadsDeleted).toBe(2);
    });

    it("한 번에 500개까지만 지운다", async () => {
        mocks.blobList.mockImplementation(
            async ({ prefix }: { prefix: string }) => ({
                hasMore: false,
                blobs:
                    prefix === "events/"
                        ? Array.from({ length: 650 }, (_, index) =>
                              blob(`events/1/image-${index}.webp`, old)
                          )
                        : [],
            })
        );

        const result = await runPrivacyRetention(now);

        const deleted = mocks.blobDel.mock.calls.flatMap(
            ([urls]) => urls as string[]
        );
        expect(deleted).toHaveLength(500);
        expect(new Set(deleted).size).toBe(500);
        expect(result.orphanUploadsDeleted).toBe(500);
    });

    it("삭제가 실패한 묶음은 지운 수에 넣지 않고 실패로 센다", async () => {
        mocks.blobList.mockImplementation(
            async ({ prefix }: { prefix: string }) => ({
                hasMore: false,
                blobs:
                    prefix === "events/"
                        ? Array.from({ length: 150 }, (_, index) =>
                              blob(`events/1/image-${index}.webp`, old)
                          )
                        : [],
            })
        );
        mocks.blobDel.mockRejectedValueOnce(new Error("blob error"));

        const result = await runPrivacyRetention(now);

        expect(mocks.blobDel).toHaveBeenCalledTimes(2);
        expect(result).toMatchObject({ orphanUploadsDeleted: 50, failed: 1 });
    });

    it("참조를 읽지 못하면 아무것도 지우지 않는다", async () => {
        mocks.blobList.mockResolvedValue({
            hasMore: false,
            blobs: [blob("avatars/1/profile-a.webp", old)],
        });
        mocks.userFindMany.mockRejectedValueOnce(new Error("db error"));

        const result = await runPrivacyRetention(now);

        expect(mocks.blobDel).not.toHaveBeenCalled();
        expect(result).toMatchObject({ orphanUploadsDeleted: 0, failed: 1 });
    });

    it("운영 배포가 아니면 저장소를 보지 않는다", async () => {
        vi.stubEnv("VERCEL_ENV", "preview");

        const result = await runPrivacyRetention(now);

        expect(mocks.blobList).not.toHaveBeenCalled();
        expect(mocks.blobDel).not.toHaveBeenCalled();
        expect(result.orphanUploadsDeleted).toBe(0);
    });
});
