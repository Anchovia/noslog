import { createElement } from "react";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type LinkProps = {
    href: string;
    prefetch?: boolean;
    onNavigate?: (event: { preventDefault: () => void }) => void;
    children?: ReactNode;
    "aria-current"?: string;
};
const mocks = vi.hoisted(() => ({
    params: new URLSearchParams("range=7d&metric=visitors"),
    link: vi.fn(),
    chart: vi.fn(),
    hours: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useSearchParams: () => mocks.params }));
vi.mock("next/link", () => ({
    default: (props: LinkProps) => {
        mocks.link(props);
        return createElement(
            "a",
            { href: props.href, "aria-current": props["aria-current"] },
            props.children
        );
    },
}));
vi.mock("@/features/admin/components/adminDashboardChart", () => ({
    default: (props: unknown) => {
        mocks.chart(props);
        return null;
    },
    AdminDashboardHours: (props: unknown) => {
        mocks.hours(props);
        return null;
    },
}));
import { DASHBOARD_METRIC_COLORS } from "@/features/admin/dashboardParams";
import {
    AdminDashboardMetricLink,
    AdminDashboardRangeLink,
    AdminDashboardTrend,
} from "@/features/admin/components/adminDashboardMetric";

describe("dashboard metric navigation", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.params = new URLSearchParams("range=7d&metric=visitors");
    });
    afterEach(() => vi.unstubAllGlobals());

    it("keeps a direct link but cancels server navigation for an in-place metric change", () => {
        const pushState = vi.fn();
        vi.stubGlobal("window", { history: { pushState } });
        const html = renderToStaticMarkup(
            createElement(
                AdminDashboardMetricLink,
                {
                    range: "7d",
                    metric: "syncs",
                    initialMetric: "visitors",
                },
                "동기화"
            )
        );
        expect(html).toContain('href="/admin?range=7d&amp;metric=syncs"');
        const props: LinkProps = mocks.link.mock.calls[0][0];
        expect(props.prefetch).toBe(false);
        const preventDefault = vi.fn();
        props.onNavigate?.({ preventDefault });
        expect(preventDefault).toHaveBeenCalledOnce();
        expect(pushState).toHaveBeenCalledWith(
            null,
            "",
            "/admin?range=7d&metric=syncs"
        );
    });

    it("does not create another history entry for the selected metric", () => {
        const pushState = vi.fn();
        vi.stubGlobal("window", { history: { pushState } });
        renderToStaticMarkup(
            createElement(
                AdminDashboardMetricLink,
                {
                    range: "7d",
                    metric: "visitors",
                    initialMetric: "visitors",
                },
                "방문자"
            )
        );
        const props: LinkProps = mocks.link.mock.calls[0][0];
        props.onNavigate?.({ preventDefault: vi.fn() });
        expect(pushState).not.toHaveBeenCalled();
        expect(props["aria-current"]).toBe("true");
    });

    it("follows URL changes and keeps the selected metric on normal period navigation", () => {
        const series = [
            {
                date: "2026-09-22",
                label: "9/22",
                values: { visitors: 2, pageviews: 7, signups: 1, syncs: 4 },
            },
        ];
        for (const metric of ["visitors", "syncs", "visitors"] as const) {
            mocks.params.set("metric", metric);
            const html = renderToStaticMarkup(
                createElement(AdminDashboardTrend, {
                    range: "7d",
                    initialMetric: "visitors",
                    hourly: null,
                    series,
                })
            );
            expect(html).toContain(metric === "syncs" ? "동기화" : "방문자");
            expect(mocks.chart.mock.lastCall?.[0].data[0].value).toBe(
                series[0].values[metric]
            );
            renderToStaticMarkup(
                createElement(
                    AdminDashboardRangeLink,
                    {
                        range: "28d",
                        currentRange: "7d",
                        initialMetric: "visitors",
                    },
                    "28일"
                )
            );
            expect(mocks.link.mock.lastCall?.[0].href).toBe(
                `/admin?range=28d&metric=${metric}`
            );
            expect(mocks.link.mock.lastCall?.[0].onNavigate).toBeUndefined();
        }
    });

    it("draws today's hourly bars for the selected metric in its own color", () => {
        const hourly = [
            {
                hour: "00",
                label: "0시",
                values: { pageviews: 9, signups: 2, syncs: 5 },
                future: false,
            },
        ];
        for (const [metric, label] of [
            ["pageviews", "페이지뷰"],
            ["signups", "가입"],
            ["syncs", "동기화"],
        ] as const) {
            mocks.params = new URLSearchParams(`range=today&metric=${metric}`);
            const html = renderToStaticMarkup(
                createElement(AdminDashboardTrend, {
                    range: "today",
                    initialMetric: "visitors",
                    hourly,
                    series: [],
                })
            );
            expect(html).toContain(`시간대별 ${label}`);
            const props = mocks.hours.mock.lastCall?.[0];
            expect(props.label).toBe(label);
            expect(props.color).toBe(DASHBOARD_METRIC_COLORS[metric]);
            expect(props.data[0].value).toBe(hourly[0].values[metric]);
        }
        expect(mocks.chart).not.toHaveBeenCalled();
    });

    it("keeps the same hourly frame for visitors with a centered note (B1)", () => {
        mocks.params = new URLSearchParams("range=today&metric=visitors");
        const html = renderToStaticMarkup(
            createElement(AdminDashboardTrend, {
                range: "today",
                initialMetric: "visitors",
                hourly: [
                    {
                        hour: "00",
                        label: "0시",
                        values: { pageviews: 9, signups: 2, syncs: 5 },
                        future: false,
                    },
                ],
                series: [],
            })
        );
        expect(html).toContain("날짜별 그래프는 7일 이상에서 보입니다.");
        expect(html).not.toContain("시간대별 방문자 · 서울 기준");
        const props = mocks.hours.mock.lastCall?.[0];
        expect(props.emptyMessage).toBe("시간대별로 모으지 않습니다");
        expect(props.data).toHaveLength(1);
        expect(props.data[0].value).toBe(0);
        expect(mocks.chart).not.toHaveBeenCalled();
    });
});
