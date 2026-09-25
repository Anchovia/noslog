import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import StackedBar from "@/components/ui/stackedBar";

const render = (rows: Parameters<typeof StackedBar>[0]["rows"]) =>
    renderToStaticMarkup(createElement(StackedBar, { rows }));

describe("StackedBar", () => {
    it("draws each positive segment as its share of the row total", () => {
        const html = render([
            {
                key: "me",
                label: "나",
                segments: [
                    { key: "a", value: 3, color: "red" },
                    { key: "b", value: 1, color: "blue" },
                    { key: "c", value: 0, color: "green" },
                ],
            },
        ]);
        expect(html).toContain('aria-hidden="true"');
        expect(html).toContain("width:75%;background:red");
        expect(html).toContain("width:25%;background:blue");
        expect(html).not.toContain("green");
        expect(html.match(/nl-stacked-bar__row/g)).toHaveLength(1);
    });
    it("keeps an empty track when the row has no positive value", () => {
        const html = render([
            {
                key: "me",
                label: "나",
                segments: [{ key: "a", value: 0, color: "red" }],
            },
        ]);
        expect(html).toContain("nl-stacked-bar__track");
        expect(html).not.toContain("nl-stacked-bar__segment");
    });
    it("drops the label column when no row has a label", () => {
        const html = render([
            {
                key: "judgement",
                segments: [{ key: "a", value: 1, color: "red" }],
            },
        ]);
        expect(html).toContain("data-unlabeled");
        expect(html).not.toContain("nl-metadata");
        expect(
            render([{ key: "me", label: "나", segments: [] }])
        ).not.toContain("data-unlabeled");
    });
});
