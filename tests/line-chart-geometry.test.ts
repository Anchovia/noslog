import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import LineChart from "@/components/ui/line-chart";

const base = {
    label: "chart",
    dimensionLabel: "date",
    valueLabel: "Grd",
    formatValue: (value: number) => String(value),
    formatAxis: (value: number) => String(value),
    domain: [0, 10] as [number, number],
    emptyMessage: "기록 없음",
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
    it("keeps the plot frame and places the empty message inside it when asked", () => {
        // 점 하나는 틀 유지 옵션이어도 일반 그래프로 그린다 — 설명 문장 없음(2026-10-01 V11)
        const plain = render({ points: [point], keepPlotGeometry: true });
        expect(plain).not.toContain("nl-line-chart__series--placeholder");
        expect(plain).not.toContain("nl-line-chart__state");
        expect(plain).toContain("nl-line-chart__target");

        const empty = render({ points: [], keepPlotGeometry: true });
        expect(empty).toContain("nl-line-chart__series--placeholder");
        expect(empty).not.toContain("<circle");
        expect(empty).toContain(base.emptyMessage);
    });
    it("keeps only the baseline and colors growth lines when asked (2026-09-19)", () => {
        const grid = (markup: string) =>
            markup.match(/nl-line-chart__grid/g)?.length ?? 0;
        const points = [point, { ...point, id: "b", value: 7 }];
        expect(grid(render({ points }))).toBe(3);
        expect(grid(render({ points, baselineOnly: true }))).toBe(1);
        expect(grid(render({ keepPlotGeometry: true }))).toBe(2);
        expect(
            grid(render({ keepPlotGeometry: true, baselineOnly: true }))
        ).toBe(1);
        expect(render({ points, tone: "growth" })).toContain(
            'data-tone="growth"'
        );
        expect(render({ points })).not.toContain("data-tone");
    });
    it("draws a single point inside the normal plot without a message", () => {
        const single = render({ points: [point] });
        expect(single).toContain("nl-line-chart__series");
        expect(single).not.toContain("nl-line-chart__series--placeholder");
        expect(single).toMatch(/<circle[^>]*cx="4"/);
        expect(single).toContain("nl-line-chart__target");
        expect(single).toContain("nl-line-chart__x");
        expect(single).toContain('data-single=""');
        expect(single).toContain("<table");
        // 평평한 선 · 속 빈 점 없이 가리킨 점과 같은 채운 점(반지름 4) 하나(2026-10-01 V11)
        expect(single).not.toContain("<polyline");
        expect(single.match(/<circle/g)).toHaveLength(1);
        expect(single).toMatch(/<circle[^>]*r="4"[^>]*data-active/);
        // 점 표시를 끈 차트도 점 하나는 찍는다
        expect(render({ points: [point], showPoints: false })).toContain(
            "<circle"
        );
        const empty = render({ points: [] });
        expect(empty).not.toContain("nl-line-chart__series");
        expect(empty).toContain(base.emptyMessage);
    });
});
