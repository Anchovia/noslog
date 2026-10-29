import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { createTranslator, getMessages } from "@/lib/i18n/messages";

vi.mock("@/app/(site)/music/community-actions", () => ({
    translateChartContribution: vi.fn(),
}));
vi.mock("@/components/i18n/locale-provider", () => ({
    useLocale: () => "ko",
    useTranslations: () => createTranslator(getMessages("ko")),
}));

import useCommunityTranslation from "@/features/music/hooks/use-community-translation";

type Options = Parameters<typeof useCommunityTranslation>[0];

function Probe(options: Options) {
    return createElement("div", null, useCommunityTranslation(options).button);
}

const render = (overrides: Partial<Options>) =>
    renderToStaticMarkup(
        createElement(Probe, {
            kind: "opinion",
            id: 1,
            text: "後半のトリルが重い",
            language: "ja",
            translations: {},
            enabled: true,
            signedIn: false,
            ...overrides,
        })
    );

describe("「번역 보기」 버튼 — 새 번역은 로그인한 사람만 만든다", () => {
    const label = createTranslator(getMessages("ko"))("community.translate");

    it("hides the button from a guest when no translation is stored", () => {
        expect(render({})).not.toContain(label);
    });

    it("shows a guest the stored translation's button", () => {
        expect(
            render({ translations: { ko: "후반 트릴이 무겁다" } })
        ).toContain(label);
    });

    it("lets a signed-in person ask for a new translation", () => {
        expect(render({ signedIn: true })).toContain(label);
    });
});
