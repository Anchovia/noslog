import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    queryRaw: vi.fn(),
    userFindMany: vi.fn(),
    syncFindMany: vi.fn(),
    syncCount: vi.fn(),
    submissionCount: vi.fn(),
    feedbackCount: vi.fn(),
    catalogCount: vi.fn(),
    opinionCount: vi.fn(),
    communityEvaluationCount: vi.fn(),
    goalVoteCount: vi.fn(),
    communityEventCount: vi.fn(),
}));

vi.mock("@/lib/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/db", () => ({
    default: {
        $queryRaw: mocks.queryRaw,
        user: { findMany: mocks.userFindMany },
        communityChartEvaluation: { count: mocks.communityEvaluationCount },
        chartGoalVote: { count: mocks.goalVoteCount },
        communityEvent: { count: mocks.communityEventCount },
        dataSync: { findMany: mocks.syncFindMany, count: mocks.syncCount },
        examSubmission: { count: mocks.submissionCount },
        feedbackReport: { count: mocks.feedbackCount },
        musicCatalogCandidate: { count: mocks.catalogCount },
        communityOpinionReport: { count: mocks.opinionCount },
    },
}));

import { currentAdminSection } from "@/components/admin/adminNav";
import {
    getAdminDashboard,
    parseDashboardParams,
} from "@/features/admin/server/adminDashboardService";

const NOW = new Date("2026-09-13T03:00:00Z"); // 서울 9/13 12:00

describe("관리자 대시보드", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.queryRaw.mockResolvedValue([
            { date: "2026-09-13", kind: "visitors", key: "", count: 5 },
            { date: "2026-09-12", kind: "visitors", key: "", count: 3 },
            { date: "2026-09-05", kind: "visitors", key: "", count: 4 },
            { date: "2026-09-13", kind: "pageviews", key: "", count: 12 },
            { date: "2026-09-13", kind: "page", key: "/music", count: 7 },
            { date: "2026-09-12", kind: "page", key: "/", count: 9 },
            // 앞 기간 — 자주 보는 페이지에는 들어가지 않는다
            { date: "2026-09-05", kind: "page", key: "/tiers", count: 100 },
            {
                date: "2026-09-13",
                kind: "api",
                key: "/api/rankings",
                count: 20,
            },
            { date: "2026-09-13", kind: "external", key: "x-api", count: 4 },
        ]);
        mocks.userFindMany
            .mockResolvedValueOnce([
                { created_at: new Date("2026-09-12T01:00:00Z") },
            ])
            // 전환 흐름 — 기간에 가입한 사람의 연동 · 기록 유무
            .mockResolvedValueOnce([
                { id: 1, dataSyncs: [{ id: 1 }], PlayData: [{ id: 1 }] },
                { id: 2, dataSyncs: [], PlayData: [] },
            ]);
        mocks.syncFindMany.mockResolvedValue([
            {
                started_at: new Date("2026-09-13T02:00:00Z"),
                status: "completed",
            },
            { started_at: new Date("2026-09-10T02:00:00Z"), status: "failed" },
        ]);
        // 실패(24시간) → 지연 순서로 불린다
        mocks.syncCount.mockResolvedValueOnce(0).mockResolvedValueOnce(2);
        mocks.submissionCount.mockResolvedValue(0);
        // 일반 피드백 → 오락실 제보 순서
        mocks.feedbackCount
            .mockResolvedValueOnce(0)
            .mockResolvedValueOnce(1)
            // 기여 활동의 오락실 제보 수
            .mockResolvedValueOnce(3);
        mocks.catalogCount.mockResolvedValue(0);
        mocks.opinionCount.mockResolvedValue(0);
        // 패턴 평가 → 의견 순서로 불린다
        mocks.communityEvaluationCount
            .mockResolvedValueOnce(6)
            .mockResolvedValueOnce(2);
        mocks.goalVoteCount.mockResolvedValue(9);
        mocks.communityEventCount.mockResolvedValue(1);
    });

    it("기간·지표는 모르는 값이면 기본값(7일·방문자)으로", () => {
        expect(parseDashboardParams({})).toEqual({
            range: "7d",
            metric: "visitors",
        });
        expect(parseDashboardParams({ range: "28d", metric: "syncs" })).toEqual(
            { range: "28d", metric: "syncs" }
        );
        expect(
            parseDashboardParams({ range: "1y", metric: "toString" })
        ).toEqual({ range: "7d", metric: "visitors" });
    });

    it("대시보드 탭은 /admin 에서만 현재 구역이다", () => {
        expect(currentAdminSection("/admin")?.label).toBe("대시보드");
        expect(currentAdminSection("/admin/arcades")?.label).toBe("오락실");
        expect(currentAdminSection("/admin/feedback")?.label).toBe("피드백");
    });

    it("기간 합계·앞 기간 비교·하루별 추이·목록·처리할 일을 만든다", async () => {
        const data = await getAdminDashboard(
            { range: "7d", metric: "visitors" },
            NOW
        );

        // 앞 기간(8/31–9/6)부터 읽는다
        expect(mocks.queryRaw.mock.calls[0].slice(1)).toEqual(["2026-08-31"]);
        expect(data.from).toBe("2026-09-07");
        expect(data.to).toBe("2026-09-13");
        expect(data.kpis).toEqual([
            {
                metric: "visitors",
                label: "방문자",
                value: 8,
                previous: 4,
                failed: null,
            },
            {
                metric: "pageviews",
                label: "페이지뷰",
                value: 12,
                previous: 0,
                failed: null,
            },
            {
                metric: "signups",
                label: "가입",
                value: 1,
                previous: 0,
                failed: null,
            },
            {
                metric: "syncs",
                label: "동기화",
                value: 2,
                previous: 0,
                failed: 1,
            },
        ]);
        expect(data.series.map((point) => point.value)).toEqual([
            0, 0, 0, 0, 0, 3, 5,
        ]);
        expect(data.series[0].label).toBe("9/7");
        expect(data.topPages).toEqual([
            { key: "/", label: "홈", detail: "/", count: 9 },
            { key: "/music", label: "악곡", detail: "/music", count: 7 },
        ]);
        expect(data.apiCalls).toEqual([
            {
                key: "/api/rankings",
                label: "랭킹",
                detail: "/api/rankings",
                count: 20,
            },
        ]);
        expect(data.externalCalls).toEqual([
            { key: "x-api", label: "공식 X 소식", detail: "X API", count: 4 },
        ]);
        expect(
            data.todo
                .filter((item) => item.count > 0)
                .map((item) => [item.label, item.count, item.href])
        ).toEqual([
            ["오락실 제보", 1, "/admin/feedback?status=open"],
            ["동기화 지연", 2, "/admin/syncs?status=processing"],
        ]);

        expect(mocks.userFindMany.mock.calls[0][0].where).toMatchObject({
            role: { not: "admin" },
        });
        expect(mocks.userFindMany.mock.calls[1][0].where).toMatchObject({
            role: { not: "admin" },
        });
        expect(mocks.syncFindMany.mock.calls[0][0].where).toMatchObject({
            user: { role: { not: "admin" } },
        });
        expect(
            mocks.communityEvaluationCount.mock.calls[0][0].where
        ).toMatchObject({ user: { role: { not: "admin" } } });
        expect(
            mocks.communityEvaluationCount.mock.calls[1][0].where
        ).toMatchObject({ user: { role: { not: "admin" } } });
        expect(mocks.goalVoteCount.mock.calls[0][0].where).toMatchObject({
            user: { role: { not: "admin" } },
        });
        expect(mocks.communityEventCount.mock.calls[0][0].where).toMatchObject({
            author: { role: { not: "admin" } },
        });
        expect(mocks.feedbackCount.mock.calls[2][0].where).toMatchObject({
            user: { role: { not: "admin" } },
        });
    });

    it("그래프 지표를 바꾸면 같은 날짜 칸에 그 지표를 싣는다", async () => {
        const data = await getAdminDashboard(
            { range: "7d", metric: "syncs" },
            NOW
        );
        expect(data.series.map((point) => point.value)).toEqual([
            0, 0, 0, 1, 0, 0, 1,
        ]);
    });
});
