import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { LoadingStatus, SkeletonText } from "@/components/ui/skeleton";

describe("스켈레톤 부품", () => {
    it("글자 자리는 받은 글자 스타일 클래스와 폭 단계를 그대로 쓰고 화면 읽기에서 숨긴다", () => {
        const html = renderToStaticMarkup(
            createElement(SkeletonText, {
                className: "nl-entity-title",
                width: "m",
            })
        );
        expect(html).toContain('class="nl-skeleton-text nl-entity-title"');
        expect(html).toContain('data-width="m"');
        expect(html).toContain('aria-hidden="true"');
        expect(html).toContain('<span class="nl-skeleton"></span>');
    });

    it("짧은 값 자리는 표본 글자 폭만 쓰고 폭 단계는 두지 않는다", () => {
        const html = renderToStaticMarkup(
            createElement(SkeletonText, {
                className: "nl-metric-value",
                width: "l",
                sample: "0,000",
            })
        );
        expect(html).toContain("data-sample");
        expect(html).not.toContain("data-width");
        expect(html).toContain(">0,000</span>");
    });

    it("로딩 안내는 화면 읽기용 상태 한 줄", () => {
        expect(
            renderToStaticMarkup(
                createElement(LoadingStatus, { label: "불러오는 중" })
            )
        ).toBe('<span class="sr-only" role="status">불러오는 중</span>');
    });
});
