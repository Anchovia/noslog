import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import LineChart from "@/components/ui/lineChart";

const base = {
    label: "chart",
    dimensionLabel: "date",
    valueLabel: "Grd",
    formatValue: (value: number) => String(value),
    formatAxis: (value: number) => String(value),
    domain: [0, 10] as [number, number],
    emptyMessage: "기록 없음",
    singleMessage: "추이를 표시하려면 더 많은 이력이 필요합니다.",
};
const point = {
    id: "a",
    dimension: "2026-09-01",
    shortDimension: "09-01",
    value: 5,
};
const render = (props: Partial<Parameters<typeof LineChart>[0]>) =>
    renderToStaticMarkup(
        createElement(LineChart, { ...base, points: [], ...props })
    );

describe("LineChart plot geometry for sparse data", () => {
    it("keeps the plot frame and places the message inside it when asked", () => {
        const single = render({ points: [point], keepPlotGeometry: true });
        expect(single).toContain("nl-line-chart__series--placeholder");
        expect(single).toContain("<circle");
        expect(single).toContain(base.singleMessage);
        expect(single).toMatch(/nl-line-chart__state[^>]*>추이를/);
        expect(single).not.toContain("nl-line-chart__x");
        expect(single).not.toContain("nl-line-chart__plot--panel");
        expect(
            render({
                points: [point],
                keepPlotGeometry: true,
                plotSurface: true,
            })
        ).toContain("nl-line-chart__plot--panel");

        // 1건 문구가 없으면 틀 유지 옵션이어도 점 하나는 일반 그래프로 그린다
        const plain = render({
            points: [point],
            keepPlotGeometry: true,
            singleMessage: undefined,
        });
        expect(plain).not.toContain("nl-line-chart__series--placeholder");
        expect(plain).toContain("nl-line-chart__target");

        const empty = render({ points: [], keepPlotGeometry: true });
        expect(empty).toContain("nl-line-chart__series--placeholder");
        expect(empty).not.toContain("<circle");
        expect(empty).toContain(base.emptyMessage);
    });
    it("draws a single point inside the normal plot without a message", () => {
        const single = render({ points: [point] });
        expect(single).toContain("nl-line-chart__series");
        expect(single).not.toContain("nl-line-chart__series--placeholder");
        expect(single).toMatch(/<circle[^>]*cx="4"/);
        expect(single).toContain("nl-line-chart__target");
        expect(single).toContain("nl-line-chart__x");
        expect(single).toContain("justify-content:center");
        expect(single).not.toContain(base.singleMessage);
        expect(single).toContain("<table");
        // 점 표시를 끈 차트도 점 하나는 찍는다
        expect(render({ points: [point], showPoints: false })).toContain(
            "<circle"
        );
        const empty = render({ points: [] });
        expect(empty).not.toContain("nl-line-chart__series");
        expect(empty).toContain(base.emptyMessage);
    });
});
