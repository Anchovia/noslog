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

        const empty = render({ points: [], keepPlotGeometry: true });
        expect(empty).toContain("nl-line-chart__series--placeholder");
        expect(empty).not.toContain("<circle");
        expect(empty).toContain(base.emptyMessage);
    });
    it("keeps the compact text fallback for other consumers by default", () => {
        const single = render({ points: [point] });
        expect(single).not.toContain("nl-line-chart__series");
        expect(single).toContain(base.singleMessage);
        const empty = render({ points: [] });
        expect(empty).not.toContain("nl-line-chart__series");
        expect(empty).toContain(base.emptyMessage);
    });
});
