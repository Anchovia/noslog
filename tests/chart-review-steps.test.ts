import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import ChartReviewPanel from "@/components/admin/chart-pattern/chartReviewPanel";
import type { ChartDraftStatus } from "@/features/contributions/schemas/chart-draft-schema";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/routing";

const current = vi.hoisted(() => ({ locale: "ko" as Locale }));

vi.mock("@/app/(site)/music/[index]/[difficulty]/draft-actions", () => ({
    addChartComment: vi.fn(),
    deleteMyChartComment: vi.fn(),
    listChartComments: vi.fn(),
    resolveChartComment: vi.fn(),
}));
vi.mock("@/components/i18n/locale-provider", () => ({
    useLocale: () => current.locale,
    useTranslations: () => createTranslator(getMessages(current.locale)),
}));
vi.mock("@tanstack/react-query", () => ({
    useQueryClient: () => ({}),
    useQuery: () => ({ data: undefined }),
    useMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));
vi.mock("@/components/admin/chart-pattern/chartEditorStore", () => ({
    useChartEditorStore: (
        select: (state: {
            currentTimeMs: number;
            setCommentTimes: () => void;
        }) => unknown
    ) => select({ currentTimeMs: 0, setCommentTimes: () => {} }),
}));

function render(locale: Locale, status: ChartDraftStatus) {
    current.locale = locale;
    const html = renderToStaticMarkup(
        createElement(ChartReviewPanel, {
            chartId: 1,
            draftId: 1,
            status,
            comments: [],
            canModerate: true,
            onSeek: () => {},
        })
    ).replace(/<!-- -->/g, "");
    const end = html.indexOf("</ol>");
    return {
        steps: html.slice(html.indexOf("<ol"), end),
        line: html.slice(end, html.indexOf("</p>", end)),
    };
}

// 191 레일에서 칸마다 라벨을 두면 낱말이 끊겨, 라벨은 화면 읽기에만 두고 지금 단계를 막대 아래 한 줄로
describe("채보 검토 단계 줄", () => {
    const cases: [Locale, ChartDraftStatus, number, string][] = [
        ["ko", "pending", 2, "검토 대기"],
        ["en", "pending", 2, "In review"],
        ["ja", "pending", 2, "確認待ち"],
        ["en", "changes_requested", 3, "Changes requested"],
        ["ko", "draft", 1, "작성 중"],
        ["ko", "approved", 4, "공개"],
    ];
    it.each(cases)("%s %s", (locale, status, position, label) => {
        const { steps, line } = render(locale, status);
        const messages = getMessages(locale) as Record<string, string>;
        // 막대 4칸 · 칸 이름 넷은 화면 읽기에만 · 지금 칸만 aria-current
        expect(steps.match(/<li/g)).toHaveLength(4);
        for (const step of [
            "draft",
            "pending",
            "changes_requested",
            "approved",
        ])
            expect(steps).toContain(
                `<span class="sr-only">${messages[`contribution.draftStatus.${step}`]}</span>`
            );
        expect(steps.match(/aria-current="step"/g)).toHaveLength(1);
        // 칸에는 막대뿐 — 화면 읽기 전용 이름을 빼면 보이는 글자가 없다
        expect(
            steps
                .replace(/<span class="sr-only">[^<]*<\/span>/g, "")
                .replace(/<[^>]+>/g, "")
                .trim()
        ).toBe("");
        expect(steps.match(/bg-nl-primary/g)).toHaveLength(position);
        // 고대비 규칙이 잡는 막대 표시 — 채운 칸만 data-on
        expect(steps.match(/class="nl-step-bar /g)).toHaveLength(4);
        expect(steps.match(/data-on="true"/g)).toHaveLength(position);
        // 막대 아래 한 줄 = 「n / 4」 흐린 메타 →8→ 지금 단계 이름
        // 목록이 이미 단계 이름 · 지금 단계를 알리므로 보이는 줄은 화면 읽기에서 뺀다(두 번 읽지 않게)
        expect(line).toContain(
            '<p class="flex items-baseline gap-nl-8" aria-hidden="true">'
        );
        expect(line).toContain(
            `<span class="nl-metadata text-nl-subdued">${position} / 4</span>`
        );
        expect(line).toContain(
            `<span class="nl-emphasis-label text-nl-content">${label}</span>`
        );
    });
});
