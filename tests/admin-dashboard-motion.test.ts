import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ useSearchParams: () => null }));

vi.mock("recharts", async () => {
    const { createElement } = await import("react");
    const component = (name: string) =>
        function MockRecharts({
            children,
            className,
            isAnimationActive,
        }: {
            children?: React.ReactNode;
            className?: string;
            isAnimationActive?: boolean;
        }) {
            return createElement(
                "div",
                {
                    "data-recharts": name,
                    "data-class": className,
                    "data-animation": String(isAnimationActive),
                },
                children
            );
        };
    return {
        Bar: component("bar"),
        BarChart: component("bar-chart"),
        CartesianGrid: component("grid"),
        Line: component("line"),
        LineChart: component("line-chart"),
        ResponsiveContainer: component("responsive"),
        Tooltip: component("tooltip"),
        XAxis: component("x-axis"),
        YAxis: component("y-axis"),
    };
});

import AdminDashboardChart, {
    AdminDashboardHours,
} from "@/features/admin/components/adminDashboardChart";
import AdminDashboard from "@/features/admin/components/adminDashboard";
import AdminDashboardLoading from "@/features/admin/components/adminDashboardLoading";
import type { AdminDashboardData } from "@/features/admin/server/adminDashboardService";

describe("관리자 대시보드 그래프 움직임", () => {
    it("추이 선은 Recharts 움직임을 끄고 공용 드러남 클래스를 쓴다", () => {
        const html = renderToStaticMarkup(
            createElement(AdminDashboardChart, {
                data: [{ date: "2026-09-21", label: "9/21", value: 3 }],
                label: "방문자",
            })
        );

        expect(html).toContain('data-recharts="line"');
        expect(html).toContain('data-class="nl-chart-reveal"');
        expect(html).toContain('data-animation="false"');
    });

    it("시간대 막대도 같은 공용 드러남 클래스를 쓴다", () => {
        const html = renderToStaticMarkup(
            createElement(AdminDashboardHours, {
                data: [
                    {
                        hour: "00",
                        label: "0시",
                        value: 2,
                        future: false,
                    },
                ],
                label: "페이지뷰",
                color: "var(--nl-local-data-categorical-2)",
            })
        );

        expect(html).toContain('data-recharts="bar"');
        expect(html).toContain('data-class="nl-chart-reveal"');
        expect(html).toContain('data-animation="false"');
    });

    it("시각별로 세지 않는 수치는 같은 틀 가운데 공용 안내를 둔다", () => {
        const html = renderToStaticMarkup(
            createElement(AdminDashboardHours, {
                data: [{ hour: "00", label: "0시", value: 0, future: false }],
                label: "방문자",
                color: "var(--nl-local-data-categorical-1)",
                emptyMessage: "시간대별로 모으지 않습니다",
            })
        );

        expect(html).toContain('class="nl-dashboard__chart"');
        expect(html).toContain(
            'aria-label="오늘 시간대별 방문자 — 시간대별로 모으지 않습니다"'
        );
        expect(html).toContain(
            'class="nl-line-chart__state nl-body-secondary nl-muted" data-placement="center"'
        );
    });

    it("비율과 목록 막대는 공용 드러남·값 변경 클래스를 쓴다", () => {
        const data: AdminDashboardData = {
            range: "7d",
            metric: "visitors",
            days: 7,
            hourly: null,
            audience: {
                member: { visitors: 2, pageviews: 4 },
                guest: { visitors: 3, pageviews: 6 },
            },
            funnel: [{ label: "가입", count: 5 }],
            contributions: [{ key: "goalVotes", label: "서열 투표", count: 3 }],
            from: "2026-09-15",
            to: "2026-09-21",
            kpis: [
                {
                    metric: "visitors",
                    label: "방문자",
                    value: 5,
                    previous: 4,
                    failed: null,
                },
            ],
            series: [
                {
                    date: "2026-09-21",
                    label: "9/21",
                    values: {
                        visitors: 5,
                        pageviews: 10,
                        signups: 1,
                        syncs: 2,
                    },
                },
            ],
            topPages: [{ key: "/", label: "홈", detail: "/", count: 5 }],
            apiCalls: [],
            externalCalls: [],
            todo: [],
        };

        const html = renderToStaticMarkup(
            createElement(AdminDashboard, { data })
        );

        expect(html).toContain('class="nl-dashboard__split nl-chart-reveal"');
        expect(html).toContain('class="nl-chart-bar"');
        expect(html).toContain(
            'class="nl-dashboard__bar nl-chart-reveal nl-chart-bar"'
        );
    });

    it("기간 로딩은 실제 대시보드 틀과 공용 스켈레톤만 쓴다", () => {
        const data: AdminDashboardData = {
            range: "7d",
            metric: "visitors",
            days: 7,
            hourly: null,
            audience: {
                member: { visitors: 2, pageviews: 4 },
                guest: { visitors: 3, pageviews: 6 },
            },
            funnel: [{ label: "가입", count: 5 }],
            contributions: [{ key: "goalVotes", label: "서열 투표", count: 3 }],
            from: "2026-09-15",
            to: "2026-09-21",
            kpis: [
                {
                    metric: "visitors",
                    label: "방문자",
                    value: 5,
                    previous: 4,
                    failed: null,
                },
            ],
            series: [
                {
                    date: "2026-09-21",
                    label: "9/21",
                    values: {
                        visitors: 5,
                        pageviews: 10,
                        signups: 1,
                        syncs: 2,
                    },
                },
            ],
            topPages: [{ key: "/", label: "홈", detail: "/", count: 5 }],
            apiCalls: [],
            externalCalls: [],
            todo: [],
        };

        const html = renderToStaticMarkup(
            createElement(AdminDashboardLoading, { data })
        );

        expect(html).toContain('class="nl-dashboard__grid"');
        expect(html).toContain('class="nl-dashboard__chart nl-skeleton"');
        expect(html).toContain('class="nl-dashboard__kpi-tone nl-skeleton"');
        expect(html).toContain("가입자 · 손님");
        expect(html).toMatch(
            /로그인 여부만 셉니다 · <span class="nl-skeleton-text nl-metadata"[^>]*data-sample=""/
        );
        expect(html).not.toContain("로그인 여부만 셉니다 · 7일");
        expect(html).toContain("자주 보는 페이지");
        expect(html).toContain("API 호출");
        expect(html).toContain("nl-skeleton-text");
        expect(html).not.toContain("style=");

        const css = readFileSync(resolve("app/styles/admin.css"), "utf8");
        expect(css).toMatch(
            /\.nl-dashboard__pending-loading\s*\{[\s\S]*?background:\s*var\(--nl-surface-canvas\)/
        );
    });
});
