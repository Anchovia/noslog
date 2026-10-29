import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { createTranslator, getMessages } from "@/lib/i18n/messages";

// 이벤트 글쓰기 — 공개판이 있는 글의 투표는 화면에서도 마감만 열어 둔다(서버 규칙은 event-poll-save.test.ts)
const t = createTranslator(getMessages("ko"));

// 실제 창은 포털이라 서버 렌더에 나오지 않는다. 열린 창의 내용만 그대로 그린다
vi.mock("@/components/ui/responsive-dialog", () => ({
    default: ({
        open,
        children,
        modalFooter,
    }: {
        open: boolean;
        children?: ReactNode;
        modalFooter?: ReactNode;
    }) => (open ? createElement("div", null, children, modalFooter) : null),
}));
vi.mock("@/app/(site)/events/actions", () => ({
    discardEventBanner: vi.fn(),
    requestEventBannerUpload: vi.fn(),
    requestEventImageUpload: vi.fn(),
    saveEvent: vi.fn(),
}));
vi.mock("@/components/i18n/locale-provider", () => ({
    useLocale: () => "ko",
    useLocalizedHref: () => (path: string) => path,
    useTranslations: () => t,
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({}) }));
vi.mock("@/components/ui/markdown-editor", () => ({ default: () => null }));
vi.mock("@/features/announcements/components/announcement-body", () => ({
    default: () => null,
}));
vi.mock("@/features/events/components/event-delete-button", () => ({
    default: () => null,
}));

import EventEditor from "@/features/events/components/event-editor";
import PollBuilderDialog from "@/features/polls/components/poll-builder-dialog";
import PollFormSection from "@/features/polls/components/poll-form-section";
import { pollLabelsFrom } from "@/features/polls/components/poll-labels";
import type { PollInput } from "@/features/polls/schemas/poll-schema";

const labels = pollLabelsFrom(t);
const question = "가장 어려운 패턴 경향은?";
const poll: PollInput = {
    question: { ko: question },
    options: [10, 11, 12].map((id, index) => ({
        id,
        text: { ko: `선택지 ${index + 1}` },
    })),
    multiple: true,
    maxChoices: 2,
    closesAt: "2099-01-01",
    results: "ALWAYS",
    showVoters: false,
    allowAddOptions: false,
};

/** 여는 태그(button 은 닫는 태그까지)마다 하나씩 — 속성 · 글자로 고른다 */
function tags(html: string, element: "button" | "input", has: string) {
    return html
        .split(`<${element}`)
        .slice(1)
        .map((chunk) =>
            chunk.slice(
                0,
                chunk.indexOf(element === "button" ? "</button>" : ">")
            )
        )
        .filter((chunk) => chunk.includes(has));
}
const opening = (tag: string) => tag.slice(0, tag.indexOf(">") + 1) || tag;
const isDisabled = (tag: string) => / disabled=""/.test(opening(tag));
const isReadOnly = (tag: string) => / readOnly=""/.test(opening(tag));
const button = (html: string, has: string) => {
    const [found] = tags(html, "button", has);
    expect(found, has).toBeDefined();
    return found;
};

const section = (props: {
    value: PollInput | null;
    published?: boolean;
    votes?: number;
}) =>
    renderToStaticMarkup(
        createElement(PollFormSection, {
            onChange: () => {},
            labels,
            locales: ["ko"],
            locale: "ko",
            ...props,
        })
    );
const builder = (published: boolean) =>
    renderToStaticMarkup(
        createElement(PollBuilderDialog, {
            open: true,
            onOpenChange: () => {},
            value: poll,
            onSave: () => {},
            labels,
            locales: ["ko"],
            published,
        })
    );

describe("이벤트 글쓰기 투표 구역 — 공개판이 있는 글", () => {
    it("disables 「투표 만들기」 when the post has a published version", () => {
        expect(
            isDisabled(button(section({ value: null }), labels.create))
        ).toBe(false);
        expect(
            isDisabled(
                button(section({ value: null, published: true }), labels.create)
            )
        ).toBe(true);
    });

    it("disables 「지우기」 but keeps 「고치기」 for the deadline", () => {
        const draft = section({ value: poll });
        expect(isDisabled(button(draft, labels.remove))).toBe(false);

        const html = section({ value: poll, published: true });
        expect(isDisabled(button(html, labels.remove))).toBe(true);
        expect(isDisabled(button(html, labels.edit))).toBe(false);
    });

    it("passes the post's published state from the editor", () => {
        const render = (isPublic: boolean) =>
            renderToStaticMarkup(
                createElement(EventEditor, {
                    event: {
                        id: 1,
                        values: {
                            title: "가을 스코어 어택",
                            content: "Real 한정",
                            startDate: "2099-09-20",
                            endDate: "2099-10-03",
                            bannerUrl: "",
                        },
                        submittedBefore: true,
                        isPublic,
                        poll: null,
                    },
                    siteUrl: "https://noslog.test",
                })
            );
        expect(isDisabled(button(render(false), labels.create))).toBe(false);
        expect(isDisabled(button(render(true), labels.create))).toBe(true);
    });
});

describe("투표 만들기 창 — 공개판이 있는 글은 마감만", () => {
    const draft = builder(false);
    const html = builder(true);

    it("makes the question and every option read-only", () => {
        const [questionInput] = tags(html, "input", `value="${question}"`);
        expect(isReadOnly(questionInput)).toBe(true);
        for (const index of [1, 2, 3]) {
            const [option] = tags(html, "input", `value="선택지 ${index}"`);
            expect(isReadOnly(option)).toBe(true);
        }
        const [draftQuestion] = tags(draft, "input", `value="${question}"`);
        expect(isReadOnly(draftQuestion)).toBe(false);
    });

    it("blocks adding, removing and pasting options", () => {
        expect(isDisabled(button(html, labels.addOption))).toBe(true);
        const removes = tags(
            html,
            "button",
            `aria-label="${labels.removeOption}"`
        );
        expect(removes).toHaveLength(3);
        expect(removes.every(isDisabled)).toBe(true);
        expect(html).not.toContain(labels.pasteOptions);

        expect(isDisabled(button(draft, labels.addOption))).toBe(false);
        expect(draft).toContain(labels.pasteOptions);
    });

    it("locks the choice way, max choices, voters, results and option adding", () => {
        for (const label of [
            labels.single,
            labels.multiple,
            labels.votersHidden,
            labels.votersShown,
        ]) {
            expect(isDisabled(button(html, label)), label).toBe(true);
            expect(isDisabled(button(draft, label)), label).toBe(false);
        }
        const [max] = tags(html, "input", 'type="number"');
        expect(isReadOnly(max)).toBe(true);
        expect(isDisabled(button(html, "nl-select"))).toBe(true);
        const [allowAdd] = tags(html, "input", 'type="checkbox"');
        expect(isDisabled(allowAdd)).toBe(true);
    });

    it("leaves the deadline open", () => {
        const [closes] = tags(html, "input", 'type="date"');
        expect(isReadOnly(closes)).toBe(false);
        expect(isDisabled(closes)).toBe(false);
        expect(isDisabled(button(html, labels.submit))).toBe(false);
    });
});
