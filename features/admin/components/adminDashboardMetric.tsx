"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import {
    DASHBOARD_METRICS,
    DASHBOARD_METRIC_COLORS,
    dashboardHref,
    parseDashboardParams,
} from "@/features/admin/dashboardParams";
import type {
    DashboardMetric,
    DashboardRange,
} from "@/features/admin/dashboardParams";
import type { AdminDashboardData } from "@/features/admin/server/adminDashboardService";
import AdminDashboardChart, {
    AdminDashboardHours,
} from "./adminDashboardChart";

function useDashboardMetric(initialMetric: DashboardMetric) {
    const params = useSearchParams();
    if (!params) return initialMetric;
    const metrics = params.getAll("metric");
    return parseDashboardParams({
        metric: metrics.length > 1 ? metrics : metrics[0],
    }).metric;
}

export function AdminDashboardMetricLabel({
    initialMetric,
}: {
    initialMetric: DashboardMetric;
}) {
    return DASHBOARD_METRICS[useDashboardMetric(initialMetric)];
}

export function AdminDashboardMetricLink({
    range,
    metric,
    initialMetric,
    children,
}: {
    range: DashboardRange;
    metric: DashboardMetric;
    initialMetric: DashboardMetric;
    children?: ReactNode;
}) {
    const selected = useDashboardMetric(initialMetric);
    const href = dashboardHref(range, metric);
    return (
        <Link
            href={href}
            prefetch={false}
            className="nl-dashboard__kpi"
            aria-current={metric === selected ? "true" : undefined}
            onNavigate={(event) => {
                event.preventDefault();
                if (metric !== selected)
                    window.history.pushState(null, "", href);
            }}
        >
            {children}
        </Link>
    );
}

export function AdminDashboardRangeLink({
    range,
    currentRange,
    initialMetric,
    children,
}: {
    range: DashboardRange;
    currentRange: DashboardRange;
    initialMetric: DashboardMetric;
    children?: ReactNode;
}) {
    const metric = useDashboardMetric(initialMetric);
    return (
        <Link
            href={dashboardHref(range, metric)}
            className="nl-segments__item nl-control"
            aria-current={range === currentRange ? "true" : undefined}
        >
            {children}
        </Link>
    );
}

export function AdminDashboardTrend({
    range,
    initialMetric,
    hourly,
    series,
}: {
    range: DashboardRange;
    initialMetric: DashboardMetric;
    hourly: AdminDashboardData["hourly"];
    series: AdminDashboardData["series"];
}) {
    const metric = useDashboardMetric(initialMetric);
    const label = DASHBOARD_METRICS[metric];
    return (
        <section
            className="nl-dashboard__panel"
            aria-labelledby="dashboard-trend"
        >
            <div className="nl-dashboard__panel-head">
                <h2 id="dashboard-trend" className="nl-component-title">
                    {label}
                </h2>
            </div>
            {hourly ? (
                <>
                    <AdminDashboardHours
                        data={hourly}
                        color={DASHBOARD_METRIC_COLORS.pageviews}
                    />
                    <p className="nl-metadata nl-muted">
                        시간대별 페이지뷰 · 서울 기준. 날짜별 그래프는 7일
                        이상에서 보입니다.
                    </p>
                </>
            ) : (
                <AdminDashboardChart
                    key={`${range}-${metric}`}
                    data={series.map(({ date, label, values }) => ({
                        date,
                        label,
                        value: values[metric],
                    }))}
                    label={label}
                    color={DASHBOARD_METRIC_COLORS[metric]}
                />
            )}
        </section>
    );
}
