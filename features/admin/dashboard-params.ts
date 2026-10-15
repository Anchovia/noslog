// 기간 — 기본 7일. 통계 날짜는 서울 기준.
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

export function dashboardHref(range: DashboardRange, metric: DashboardMetric) {
    return `/admin?range=${range}&metric=${metric}`;
}

// 기존 데이터 색 토큰 — 지표 수치 칸과 그래프에서 함께 사용한다.
export const DASHBOARD_METRIC_COLORS: Record<DashboardMetric, string> = {
    visitors: "var(--nl-local-data-categorical-1)",
    pageviews: "var(--nl-local-data-categorical-2)",
    signups: "var(--nl-local-data-categorical-3)",
    syncs: "var(--nl-local-data-categorical-5)",
};
