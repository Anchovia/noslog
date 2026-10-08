import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import AppliedTokens from "@/components/ui/applied-tokens";

const render = (tokens: Parameters<typeof AppliedTokens>[0]["tokens"]) =>
    renderToStaticMarkup(
        createElement(AppliedTokens, {
            label: "조건",
            tokens,
            clearLabel: "필터 모두 지우기",
            onClear: () => {},
        })
    );

describe("AppliedTokens", () => {
    it("renders nothing without tokens", () => {
        expect(render([])).toBe("");
    });
    it("marks only toned tokens and keeps the label apart from the remove icon", () => {
        const html = render([
            {
                key: "difficulty-Expert",
                label: "Expert",
                tone: "expert",
                removeLabel: "Expert 조건 해제",
                onRemove: () => {},
            },
            {
                key: "level-12",
                label: "Lv.12",
                removeLabel: "12 조건 해제",
                onRemove: () => {},
            },
        ]);
        expect(html.match(/data-tone=/g)).toHaveLength(1);
        expect(html).toContain('data-tone="expert"');
        expect(html).toContain(
            '<span class="nl-applied__label">Expert</span><svg'
        );
        expect(html).toContain('aria-label="12 조건 해제"');
        expect(html).toContain("필터 모두 지우기");
    });
});
