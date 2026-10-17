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
    proposalCount: vi.fn(),
    draftCount: vi.fn(),
    communityEvaluationCount: vi.fn(),
    goalVoteCount: vi.fn(),
    communityEventCount: vi.fn(),
    syncGroupBy: vi.fn(),
    evaluationGroupBy: vi.fn(),
    goalVoteGroupBy: vi.fn(),
    eventGroupBy: vi.fn(),
    feedbackGroupBy: vi.fn(),
}));

vi.mock("@/lib/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/db", () => ({
    default: {
        $queryRaw: mocks.queryRaw,
        user: { findMany: mocks.userFindMany },
        communityChartEvaluation: {
            count: mocks.communityEvaluationCount,
            groupBy: mocks.evaluationGroupBy,
        },
        chartGoalVote: {
            count: mocks.goalVoteCount,
            groupBy: mocks.goalVoteGroupBy,
        },
        communityEvent: {
            count: mocks.communityEventCount,
            groupBy: mocks.eventGroupBy,
        },
        dataSync: {
            findMany: mocks.syncFindMany,
            count: mocks.syncCount,
            groupBy: mocks.syncGroupBy,
        },
        examSubmission: { count: mocks.submissionCount },
        feedbackReport: {
            count: mocks.feedbackCount,
            groupBy: mocks.feedbackGroupBy,
        },
        musicCatalogCandidate: { count: mocks.catalogCount },
        communityOpinionReport: { count: mocks.opinionCount },
        chartFieldProposal: { count: mocks.proposalCount },
        chartDraft: { count: mocks.draftCount },
    },
}));

import { currentAdminSection } from "@/components/admin/admin-nav";
import { getAdminDashboard } from "@/features/admin/server/admin-dashboard-service";
import { parseDashboardParams } from "@/features/admin/dashboard-params";

const NOW = new Date("2026-10-13T03:00:00Z"); // 서울 10/13 12:00

describe("관리자 대시보드", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.queryRaw.mockResolvedValue([
            { date: "2026-10-13", kind: "visitors", key: "", count: 5 },
            { date: "2026-10-12", kind: "visitors", key: "", count: 3 },
            { date: "2026-10-05", kind: "visitors", key: "", count: 4 },
            { date: "2026-10-13", kind: "pageviews", key: "", count: 12 },
            { date: "2026-10-13", kind: "page", key: "/music", count: 7 },
            { date: "2026-10-12", kind: "page", key: "/", count: 9 },
            // 앞 기간 — 자주 보는 페이지에는 들어가지 않는다
            { date: "2026-10-05", kind: "page", key: "/tiers", count: 100 },
            {
                date: "2026-10-13",
                kind: "api",
                key: "/api/rankings",
                count: 20,
            },
            { date: "2026-10-13", kind: "external", key: "x-api", count: 4 },
        ]);
        mocks.userFindMany
            .mockResolvedValueOnce([
                { createdAt: new Date("2026-10-12T01:00:00Z") },
            ])
            // 전환 흐름 — 기간에 가입한 사람의 연동 · 기록 유무
            .mockResolvedValueOnce([
                {
                    id: 1,
                    profileCompletedAt: new Date("2026-10-12T01:10:00Z"),
                    dataSyncs: [{ id: 1 }],
                    playData: [{ id: 1 }],
                },
                {
                    id: 2,
                    profileCompletedAt: null,
                    dataSyncs: [],
                    playData: [],
                },
            ]);
        mocks.syncFindMany.mockResolvedValue([
            {
                userId: 7,
                startedAt: new Date("2026-10-13T02:00:00Z"),
                status: "completed",
                errorMessage: null,
            },
            {
                userId: 7,
                startedAt: new Date("2026-10-10T02:00:00Z"),
                status: "failed",
                errorMessage: "Unexpected token\n at line 3",
            },
        ]);
        for (const groupBy of [
            mocks.syncGroupBy,
            mocks.evaluationGroupBy,
            mocks.goalVoteGroupBy,
            mocks.eventGroupBy,
            mocks.feedbackGroupBy,
        ])
            groupBy.mockResolvedValue([]);
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
        mocks.proposalCount.mockResolvedValue(3);
        mocks.draftCount.mockResolvedValue(1);
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

        // 앞 기간(9/30–10/6)부터 읽는다
        expect(mocks.queryRaw.mock.calls[0].slice(1)).toEqual(["2026-09-30"]);
        expect(data.from).toBe("2026-10-07");
        expect(data.to).toBe("2026-10-13");
        expect(data.kpis).toEqual([
            {
                metric: "visitors",
                label: "방문자",
                value: 8,
                previous: 4,
                attempts: null,
                failed: null,
            },
            {
                metric: "pageviews",
                label: "페이지뷰",
                value: 12,
                previous: 0,
                attempts: null,
                failed: null,
            },
            {
                metric: "signups",
                label: "가입",
                value: 1,
                previous: 0,
                attempts: null,
                failed: null,
            },
            // 동기화를 끝낸 사람 1명 — 실패한 시도는 사람 수에 들지 않고 시도 · 실패로만 센다(Y2)
            {
                metric: "syncs",
                label: "동기화한 사람",
                value: 1,
                previous: 0,
                attempts: 2,
                failed: 1,
            },
        ]);
        expect(data.comparison).toEqual({
            untilHour: null,
            visitsComparable: true,
        });
        expect(data.funnel).toEqual([
            { label: "가입", count: 2 },
            { label: "온보딩 완료", count: 1 },
            { label: "기록 연동", count: 1 },
            { label: "기록 등록", count: 1 },
        ]);
        expect(data.syncHealth).toEqual({
            rows: [
                { key: "completed", label: "완료", detail: "", count: 1 },
                { key: "failed", label: "실패", detail: "", count: 1 },
            ],
            reasons: [
                {
                    key: "Unexpected token",
                    label: "Unexpected token",
                    detail: "",
                    count: 1,
                },
            ],
        });
        expect(data.series.map((point) => point.values.visitors)).toEqual([
            0, 0, 0, 0, 0, 3, 5,
        ]);
        expect(data.series[0].label).toBe("10/7");
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
            ["동기화 지연(관리자 포함)", 2, "/admin/syncs?status=processing"],
            ["기여 제안", 3, "/admin/contributions"],
            ["채보 검토", 1, "/admin/contributions?kind=chart"],
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
        // 기여는 새로 쓴 것만 — 고치기 · 번역 저장으로 바뀌는 updated_at 은 보지 않는다(E1)
        const periodStart = new Date("2026-10-07T00:00:00+09:00");
        expect(
            mocks.communityEvaluationCount.mock.calls[0][0].where
        ).toMatchObject({
            user: { role: { not: "admin" } },
            createdAt: { gte: periodStart },
        });
        expect(
            mocks.communityEvaluationCount.mock.calls[1][0].where
        ).toMatchObject({
            user: { role: { not: "admin" } },
            opinionCreatedAt: { gte: periodStart },
        });
        expect(mocks.goalVoteCount.mock.calls[0][0].where).toMatchObject({
            user: { role: { not: "admin" } },
            createdAt: { gte: periodStart },
        });
        expect(mocks.communityEventCount.mock.calls[0][0].where).toMatchObject({
            author: { role: { not: "admin" } },
        });
        expect(mocks.feedbackCount.mock.calls[2][0].where).toMatchObject({
            user: { role: { not: "admin" } },
        });
    });

    it("같은 조회에 네 지표를 모두 실어 브라우저에서 전환할 수 있다", async () => {
        const data = await getAdminDashboard(
            { range: "7d", metric: "syncs" },
            NOW
        );
        // 그날 동기화를 끝낸 사람 수 — 10/10 실패 시도는 그래프에 들지 않는다
        expect(data.series.map((point) => point.values.syncs)).toEqual([
            0, 0, 0, 0, 0, 0, 1,
        ]);
        expect(data.series.at(-1)?.values).toEqual({
            visitors: 5,
            pageviews: 12,
            signups: 0,
            syncs: 1,
        });
        expect(mocks.queryRaw).toHaveBeenCalledTimes(1);
        expect(mocks.requireAdmin).toHaveBeenCalledOnce();
    });

    it("오늘은 페이지뷰 · 가입 · 동기화를 시각별로 나눈다", async () => {
        mocks.queryRaw.mockResolvedValue([
            { date: "2026-10-13", kind: "hour", key: "09", count: 4 },
            { date: "2026-10-12", kind: "hour", key: "09", count: 50 },
        ]);
        mocks.userFindMany.mockReset();
        mocks.userFindMany
            .mockResolvedValueOnce([
                // 서울 10/13 10:30 · 어제 10:00 은 시각별에서 빠진다
                { createdAt: new Date("2026-10-13T01:30:00Z") },
                { createdAt: new Date("2026-10-12T01:00:00Z") },
            ])
            .mockResolvedValueOnce([]);
        const data = await getAdminDashboard(
            { range: "today", metric: "signups" },
            NOW
        );
        const hour = (key: string) =>
            data.hourly?.find((point) => point.hour === key);
        expect(hour("09")?.values).toEqual({
            pageviews: 4,
            signups: 0,
            syncs: 0,
        });
        expect(hour("10")?.values.signups).toBe(1);
        // 서울 10/13 11:00 동기화 — 10/10 것은 빠진다
        expect(hour("11")?.values.syncs).toBe(1);
        expect(
            data.hourly?.reduce((total, point) => total + point.values.syncs, 0)
        ).toBe(1);
        expect(hour("13")?.future).toBe(true);
    });

    it("오늘 증감은 어제 같은 시각대까지와 비교하고 방문자는 비교하지 않는다", async () => {
        mocks.queryRaw.mockResolvedValue([
            { date: "2026-10-13", kind: "pageviews", key: "", count: 30 },
            { date: "2026-10-13", kind: "visitors", key: "", count: 8 },
            { date: "2026-10-12", kind: "pageviews", key: "", count: 400 },
            { date: "2026-10-12", kind: "visitors", key: "", count: 90 },
            // 지금 12시 — 어제 12시대까지만 비교에 든다
            { date: "2026-10-12", kind: "hour", key: "09", count: 50 },
            { date: "2026-10-12", kind: "hour", key: "12", count: 5 },
            { date: "2026-10-12", kind: "hour", key: "13", count: 70 },
        ]);
        mocks.userFindMany.mockReset();
        mocks.userFindMany
            .mockResolvedValueOnce([
                { createdAt: new Date("2026-10-13T01:30:00Z") },
                // 어제 서울 10:00 은 들고 14:00 은 빠진다
                { createdAt: new Date("2026-10-12T01:00:00Z") },
                { createdAt: new Date("2026-10-12T05:00:00Z") },
            ])
            .mockResolvedValueOnce([]);
        mocks.syncFindMany.mockResolvedValue([
            {
                userId: 3,
                startedAt: new Date("2026-10-12T02:00:00Z"),
                status: "completed",
                errorMessage: null,
            },
            {
                userId: 4,
                startedAt: new Date("2026-10-12T09:00:00Z"),
                status: "completed",
                errorMessage: null,
            },
        ]);
        const data = await getAdminDashboard(
            { range: "today", metric: "pageviews" },
            NOW
        );
        const kpi = (metric: string) =>
            data.kpis.find((item) => item.metric === metric);
        expect(data.comparison).toEqual({
            untilHour: 12,
            visitsComparable: true,
        });
        expect(kpi("visitors")).toMatchObject({ value: 8, previous: null });
        expect(kpi("pageviews")).toMatchObject({ value: 30, previous: 55 });
        expect(kpi("signups")).toMatchObject({ value: 1, previous: 1 });
        expect(kpi("syncs")).toMatchObject({ value: 0, previous: 1 });
    });

    it("직전 기간이 수집 시작 전이나 보관 기간 밖이면 방문 증감을 비우고 그 날은 빈 칸", async () => {
        const data = await getAdminDashboard(
            { range: "90d", metric: "visitors" },
            NOW
        );
        expect(data.comparison.visitsComparable).toBe(false);
        const kpi = (metric: string) =>
            data.kpis.find((item) => item.metric === metric);
        expect(kpi("visitors")?.previous).toBeNull();
        expect(kpi("pageviews")?.previous).toBeNull();
        // 가입 · 동기화는 표에서 직접 세므로 비교한다
        expect(kpi("signups")?.previous).toBe(0);
        expect(data.series[0]).toMatchObject({
            date: "2026-07-16",
            values: { visitors: null, pageviews: null, signups: 0 },
        });
        expect(
            data.series.find((point) => point.date === "2026-09-13")?.values
                .visitors
        ).toBe(0);
    });

    it("활성 사용자는 동기화 · 기여한 사람, 새 기여자는 기간에 처음 기여한 사람", async () => {
        mocks.syncGroupBy.mockResolvedValue([
            {
                userId: 1,
                _max: { startedAt: new Date("2026-10-12T00:00:00Z") },
            },
            {
                userId: 2,
                _max: { startedAt: new Date("2026-09-25T00:00:00Z") },
            },
        ]);
        mocks.evaluationGroupBy.mockResolvedValue([
            {
                userId: 2,
                _min: { createdAt: new Date("2026-08-01T00:00:00Z") },
                _max: {
                    createdAt: new Date("2026-08-01T00:00:00Z"),
                    opinionCreatedAt: new Date("2026-10-11T00:00:00Z"),
                },
            },
            {
                userId: 3,
                _min: { createdAt: new Date("2026-10-09T00:00:00Z") },
                _max: {
                    createdAt: new Date("2026-10-09T00:00:00Z"),
                    opinionCreatedAt: null,
                },
            },
        ]);
        // 3번은 투표를 더 일찍 했다 — 처음 기여는 9/1 이라 새 기여자가 아니다
        mocks.goalVoteGroupBy.mockResolvedValue([
            {
                userId: 3,
                _min: { createdAt: new Date("2026-09-01T00:00:00Z") },
                _max: { createdAt: new Date("2026-09-01T00:00:00Z") },
            },
            {
                userId: 4,
                _min: { createdAt: new Date("2026-10-08T00:00:00Z") },
                _max: { createdAt: new Date("2026-10-08T00:00:00Z") },
            },
        ]);
        mocks.eventGroupBy.mockResolvedValue([
            {
                authorId: 5,
                _min: { submittedAt: new Date("2026-09-20T00:00:00Z") },
                _max: { submittedAt: new Date("2026-09-20T00:00:00Z") },
            },
        ]);
        const data = await getAdminDashboard(
            { range: "7d", metric: "visitors" },
            NOW
        );
        // 7일(10/7~) = 1 · 2 · 3 · 4, 28일(9/16~) = 여기에 5
        expect(data.active).toEqual({ week: 4, month: 5, ratio: 80 });
        expect(data.newContributors).toBe(1);
        expect(mocks.syncGroupBy.mock.calls[0][0].where).toMatchObject({
            user: { role: { not: "admin" } },
            status: "completed",
            startedAt: { gte: new Date("2026-09-16T00:00:00+09:00") },
        });
    });
});
