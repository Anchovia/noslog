import "server-only";

import { requireAdmin } from "@/lib/admin";
import { STALE_SYNC_THRESHOLD_MS } from "@/lib/admin/syncHealth";
import { analyticsDateKey } from "@/lib/analytics";
import {
    API_ROUTES,
    EXTERNAL_EVENTS,
    isExternalEvent,
    PAGE_ROUTES,
    routeLabel,
} from "@/lib/analyticsRoutes";
import db from "@/lib/db";

// 기간 — 기본 7일(2026-09-13 사용자 결정). 통계 날짜는 서울 기준
export const DASHBOARD_RANGES = {
    today: { days: 1, label: "오늘" },
    "7d": { days: 7, label: "7일" },
    "28d": { days: 28, label: "28일" },
    "90d": { days: 90, label: "90일" },
} as const;
export type DashboardRange = keyof typeof DASHBOARD_RANGES;

export const DASHBOARD_METRICS = {
    visitors: "방문자",
    pageviews: "페이지뷰",
    signups: "가입",
    syncs: "동기화",
} as const;
export type DashboardMetric = keyof typeof DASHBOARD_METRICS;

export function parseDashboardParams(params: {
    range?: string | string[];
    metric?: string | string[];
}) {
    // in 은 toString 같은 기본 속성까지 참으로 봐서 자기 열쇠만 받는다
    const range: DashboardRange =
        typeof params.range === "string" &&
        Object.hasOwn(DASHBOARD_RANGES, params.range)
            ? (params.range as DashboardRange)
            : "7d";
    const metric: DashboardMetric =
        typeof params.metric === "string" &&
        Object.hasOwn(DASHBOARD_METRICS, params.metric)
            ? (params.metric as DashboardMetric)
            : "visitors";
    return { range, metric };
}

const DAY_MS = 24 * 60 * 60 * 1000;

function shiftKey(key: string, days: number) {
    return new Date(Date.parse(`${key}T00:00:00Z`) + days * DAY_MS)
        .toISOString()
        .slice(0, 10);
}

// endKey 까지 거꾸로 days 칸 — 오래된 날부터
function dayKeys(endKey: string, days: number) {
    return Array.from({ length: days }, (_, index) =>
        shiftKey(endKey, index - days + 1)
    );
}

interface DayTotals {
    visitors: number;
    pageviews: number;
    signups: number;
    syncs: number;
    failed: number;
}

export interface DashboardRow {
    key: string;
    label: string;
    detail: string;
    count: number;
}

function sortedRows(
    counts: Map<string, number>,
    describe: (key: string) => { label: string; detail: string }
): DashboardRow[] {
    return [...counts]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([key, count]) => ({ key, count, ...describe(key) }));
}

/**
 * 대시보드 한 화면 — 기간의 하루별 합계와 바로 앞 같은 길이 기간(증감 비교),
 * 자주 보는 페이지·API·외부 호출(기간 합계), 처리할 일(지금 개수)
 */
export async function getAdminDashboard(
    { range, metric }: { range: DashboardRange; metric: DashboardMetric },
    now = new Date()
) {
    await requireAdmin();
    const days = DASHBOARD_RANGES[range].days;
    const current = dayKeys(analyticsDateKey(now), days);
    const previous = dayKeys(shiftKey(current[0], -1), days);
    const since = new Date(`${previous[0]}T00:00:00+09:00`);

    const [
        counts,
        users,
        syncs,
        pendingSubmissions,
        openFeedback,
        openArcadeReports,
        failedSyncs,
        staleSyncs,
        pendingCatalog,
        pendingOpinions,
    ] = await Promise.all([
        db.$queryRaw<
            { date: string; kind: string; key: string; count: number }[]
        >`
            SELECT to_char("date", 'YYYY-MM-DD') AS "date", "kind", "key", "count"
            FROM "analytics_daily_counts"
            WHERE "date" >= ${previous[0]}::date`,
        db.user.findMany({
            where: { created_at: { gte: since } },
            select: { created_at: true },
        }),
        db.dataSync.findMany({
            where: { started_at: { gte: since } },
            select: { started_at: true, status: true },
        }),
        db.examSubmission.count({ where: { status: "pending" } }),
        db.feedbackReport.count({ where: { status: "open", arcadeId: null } }),
        db.feedbackReport.count({
            where: { status: "open", arcadeId: { not: null } },
        }),
        db.dataSync.count({
            where: {
                status: "failed",
                started_at: { gte: new Date(now.getTime() - DAY_MS) },
            },
        }),
        db.dataSync.count({
            where: {
                status: "processing",
                started_at: {
                    lte: new Date(now.getTime() - STALE_SYNC_THRESHOLD_MS),
                },
            },
        }),
        db.musicCatalogCandidate.count({ where: { status: "pending" } }),
        db.communityOpinionReport.count({ where: { status: "pending" } }),
    ]);

    const totals = new Map<string, DayTotals>();
    const day = (key: string) => {
        let entry = totals.get(key);
        if (!entry) {
            entry = {
                visitors: 0,
                pageviews: 0,
                signups: 0,
                syncs: 0,
                failed: 0,
            };
            totals.set(key, entry);
        }
        return entry;
    };
    const inRange = new Set(current);
    const pages = new Map<string, number>();
    const apis = new Map<string, number>();
    const externals = new Map<string, number>();
    for (const row of counts) {
        const count = Number(row.count);
        if (row.kind === "visitors") day(row.date).visitors += count;
        else if (row.kind === "pageviews") day(row.date).pageviews += count;
        else if (inRange.has(row.date)) {
            const target =
                row.kind === "page"
                    ? pages
                    : row.kind === "api"
                      ? apis
                      : row.kind === "external"
                        ? externals
                        : null;
            target?.set(row.key, (target.get(row.key) ?? 0) + count);
        }
    }
    for (const user of users)
        day(analyticsDateKey(user.created_at)).signups += 1;
    for (const sync of syncs) {
        const entry = day(analyticsDateKey(sync.started_at));
        entry.syncs += 1;
        if (sync.status === "failed") entry.failed += 1;
    }
    const sum = (keys: string[], field: keyof DayTotals) =>
        keys.reduce((total, key) => total + (totals.get(key)?.[field] ?? 0), 0);

    const kpis = (Object.keys(DASHBOARD_METRICS) as DashboardMetric[]).map(
        (key) => ({
            metric: key,
            label: DASHBOARD_METRICS[key],
            value: sum(current, key),
            previous: sum(previous, key),
            failed: key === "syncs" ? sum(current, "failed") : null,
        })
    );

    return {
        range,
        metric,
        days,
        from: current[0],
        to: current[current.length - 1],
        kpis,
        series: current.map((key) => ({
            date: key,
            label: `${Number(key.slice(5, 7))}/${Number(key.slice(8, 10))}`,
            value: totals.get(key)?.[metric] ?? 0,
        })),
        topPages: sortedRows(pages, (key) => ({
            label: routeLabel(PAGE_ROUTES, key),
            detail: key,
        })).slice(0, 8),
        apiCalls: sortedRows(apis, (key) => ({
            label: routeLabel(API_ROUTES, key),
            detail: key,
        })),
        externalCalls: sortedRows(externals, (key) =>
            isExternalEvent(key)
                ? EXTERNAL_EVENTS[key]
                : { label: key, detail: "" }
        ),
        // 누르면 그 탭 목록으로. 0 인 일은 화면에서 한 줄(「나머지 없음」)로 접는다
        todo: [
            {
                label: "인증 심사 대기",
                count: pendingSubmissions,
                href: "/admin/submissions?status=pending",
            },
            {
                label: "피드백 접수",
                count: openFeedback,
                href: "/admin/feedback?status=open",
            },
            {
                label: "오락실 제보",
                count: openArcadeReports,
                href: "/admin/feedback?status=open",
            },
            {
                label: "동기화 실패(24시간)",
                count: failedSyncs,
                href: "/admin/syncs?status=failed",
            },
            {
                label: "동기화 지연",
                count: staleSyncs,
                href: "/admin/syncs?status=processing",
            },
            {
                label: "업데이트 대기",
                count: pendingCatalog,
                href: "/admin/catalog",
            },
            {
                label: "의견 신고",
                count: pendingOpinions,
                href: "/admin/community",
            },
        ],
    };
}

export type AdminDashboardData = Awaited<ReturnType<typeof getAdminDashboard>>;
