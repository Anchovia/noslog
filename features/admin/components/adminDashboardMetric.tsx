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

const HOURLY_NOTE_DAILY = "날짜별 그래프는 7일 이상에서 보입니다.";
const HOURLY_NOTE_UNCOUNTED = "시간대별로 모으지 않습니다";

// 방문자는 시각별로 세지 않아 「시간대별 방문자 · 서울 기준」 을 붙이지 않는다
function HourlyNote({
    metric,
    label,
}: {
    metric: DashboardMetric;
    label: string;
}) {
    return metric === "visitors"
        ? HOURLY_NOTE_DAILY
        : `시간대별 ${label} · 서울 기준. ${HOURLY_NOTE_DAILY}`;
}

function useDashboardMetric(initialMetric: DashboardMetric) {
    const params = useSearchParams();
    if (!params) return initialMetric;
    const metrics = params.getAll("metric");
    return parseDashboardParams({
        metric: metrics.length > 1 ? metrics : metrics[0],
    }).metric;
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
    // 방문자는 하루 단위로만 세어 시각별 값이 없다
    const hourlyMetric = metric === "visitors" ? null : metric;
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
                        key={metric}
                        data={hourly.map(({ hour, label, values, future }) => ({
                            hour,
                            label,
                            value: hourlyMetric ? values[hourlyMetric] : 0,
                            future,
                        }))}
                        label={label}
                        color={DASHBOARD_METRIC_COLORS[metric]}
                        emptyMessage={
                            hourlyMetric ? undefined : HOURLY_NOTE_UNCOUNTED
                        }
                    />
                    <p className="nl-metadata nl-muted">
                        <HourlyNote metric={metric} label={label} />
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

/** 추이 패널 로딩 — 오늘 보기도 수치와 관계없이 같은 그래프 틀이라 그래프 자리 스켈레톤 하나 (2026-09-22 B1) */
export function AdminDashboardTrendLoading({
    initialMetric,
    hourly,
}: {
    initialMetric: DashboardMetric;
    hourly: boolean;
}) {
    const metric = useDashboardMetric(initialMetric);
    const label = DASHBOARD_METRICS[metric];
    return (
        <section className="nl-dashboard__panel">
            <div className="nl-dashboard__panel-head">
                <h2 className="nl-component-title">{label}</h2>
            </div>
            <div className="nl-dashboard__chart nl-skeleton" />
            {hourly ? (
                <p className="nl-metadata nl-muted">
                    <HourlyNote metric={metric} label={label} />
                </p>
            ) : null}
        </section>
    );
}
