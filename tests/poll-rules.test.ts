import { describe, expect, it } from "vitest";

import {
    POLL_MAX_OPTIONS,
    emptyPollInput,
    pickLocaleText,
    pollLockedChange,
    validatePollInput,
    type PollInput,
} from "@/features/polls/schemas/pollSchema";

const now = new Date("2026-09-23T00:00:00.000Z");
const base: PollInput = {
    question: { ko: "가장 어려운 패턴 경향은?" },
    options: [{ text: { ko: "계단" } }, { text: { ko: "연타" } }],
    multiple: false,
    maxChoices: null,
    closesAt: null,
    results: "ALWAYS",
    showVoters: false,
    allowAddOptions: false,
};

describe("투표 규칙", () => {
    it("accepts a poll with a question and two options", () => {
        expect(validatePollInput(base, now)).toBeNull();
        expect(validatePollInput(emptyPollInput("ko"), now)).toBe("question");
    });
    it("needs 2 to 20 options and no empty one", () => {
        expect(
            validatePollInput({ ...base, options: [base.options[0]] }, now)
        ).toBe("options");
        expect(
            validatePollInput(
                { ...base, options: [...base.options, { text: { ko: "" } }] },
                now
            )
        ).toBe("options");
        const many = Array.from({ length: POLL_MAX_OPTIONS + 1 }, (_, i) => ({
            text: { ko: `보기 ${i}` },
        }));
        expect(validatePollInput({ ...base, options: many }, now)).toBe(
            "options"
        );
    });
    it("rejects two options with the same text", () => {
        expect(
            validatePollInput(
                {
                    ...base,
                    options: [
                        { text: { ko: "계단" } },
                        { text: { ko: "계단" } },
                    ],
                },
                now
            )
        ).toBe("duplicate");
    });
    it("checks the deadline is in the future and the choice limit fits", () => {
        expect(
            validatePollInput({ ...base, closesAt: "2026-09-22" }, now)
        ).toBe("closesAt");
        expect(
            validatePollInput({ ...base, closesAt: "2026-09-30" }, now)
        ).toBeNull();
        expect(
            validatePollInput({ ...base, multiple: true, maxChoices: 3 }, now)
        ).toBe("maxChoices");
    });
});

describe("표가 들어온 뒤 잠그는 범위", () => {
    const current = {
        question: { ko: "가장 어려운 패턴 경향은?" },
        multiple: false,
        options: [
            { id: 1, text: { ko: "계단" } },
            { id: 2, text: { ko: "연타" } },
        ],
        allowAddOptions: false,
    };
    const kept: PollInput = {
        ...base,
        options: [
            { id: 1, text: { ko: "계단" } },
            { id: 2, text: { ko: "연타" } },
        ],
    };
    it("allows changing only the deadline", () => {
        expect(pollLockedChange(current, kept)).toBe(false);
        expect(
            pollLockedChange(current, { ...kept, closesAt: "2026-09-30" })
        ).toBe(false);
    });
    it("locks the question, the options and the way of choosing", () => {
        expect(
            pollLockedChange(current, {
                ...kept,
                question: { ko: "다른 질문" },
            })
        ).toBe(true);
        expect(pollLockedChange(current, { ...kept, multiple: true })).toBe(
            true
        );
        expect(
            pollLockedChange(current, {
                ...kept,
                options: [
                    { id: 1, text: { ko: "계단 고침" } },
                    kept.options[1],
                ],
            })
        ).toBe(true);
        expect(
            pollLockedChange(current, {
                ...kept,
                options: [kept.options[0]],
            })
        ).toBe(true);
    });
    it("allows adding options only when the poll said so", () => {
        const added = {
            ...kept,
            options: [...kept.options, { text: { ko: "폴리리듬" } }],
        };
        expect(pollLockedChange(current, added)).toBe(true);
        expect(
            pollLockedChange({ ...current, allowAddOptions: true }, added)
        ).toBe(false);
    });
});

describe("언어 고르기", () => {
    it("falls back to Korean, then to whatever was written", () => {
        expect(pickLocaleText({ ko: "질문", ja: "しつもん" }, "ja")).toBe(
            "しつもん"
        );
        expect(pickLocaleText({ ko: "질문" }, "en")).toBe("질문");
        expect(pickLocaleText({ ja: "しつもん" }, "en")).toBe("しつもん");
        expect(pickLocaleText({}, "ko")).toBe("");
    });
});
