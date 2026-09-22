import { z } from "zod";

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/routing";

/** 선택지 수 — Discourse · 네이버 카페 20 을 따른다(2026-09-23 W1) */
export const POLL_MIN_OPTIONS = 2;
export const POLL_MAX_OPTIONS = 20;
export const POLL_QUESTION_MAX_LENGTH = 120;
export const POLL_OPTION_MAX_LENGTH = 80;
/** 결과를 언제 보여 줄지 — 항상 · 투표한 뒤 · 마감한 뒤 */
export const POLL_RESULT_VISIBILITIES = [
    "ALWAYS",
    "AFTER_VOTE",
    "AFTER_CLOSE",
] as const;
export type PollResultVisibility = (typeof POLL_RESULT_VISIBILITIES)[number];

const text = (max: number) =>
    z
        .string()
        .transform((value) => value.replace(/\r\n?/g, "\n").trim())
        .pipe(z.string().max(max));

/** 언어별 글 — 공지는 세 벌, 이벤트는 쓴 언어 한 벌. 빈 벌은 저장하지 않는다 */
const localeText = (max: number) =>
    z.partialRecord(z.enum(SUPPORTED_LOCALES), text(max));

export const pollOptionInputSchema = z.object({
    /** 이미 있는 선택지면 그 번호 — 표를 지키며 글만 고칠 때 쓴다 */
    id: z.number().int().positive().optional(),
    text: localeText(POLL_OPTION_MAX_LENGTH),
});

export const pollInputSchema = z.object({
    question: localeText(POLL_QUESTION_MAX_LENGTH),
    options: z.array(pollOptionInputSchema),
    multiple: z.boolean().default(false),
    maxChoices: z.number().int().positive().nullable().default(null),
    /** 비우면 마감 없음 — 기본값을 두지 않는다(확인한 곳 2/3) */
    closesAt: z.string().trim().nullable().default(null),
    results: z.enum(POLL_RESULT_VISIBILITIES).default("ALWAYS"),
    showVoters: z.boolean().default(false),
    allowAddOptions: z.boolean().default(false),
});

/** 폼에 실어 보내는 값 — JSON 한 덩이(없으면 "null" · 빈 문자열) */
export const pollFormValueSchema = z
    .union([z.string(), z.null(), z.undefined(), pollInputSchema])
    .transform((value, ctx) => {
        if (value === null || value === undefined) return null;
        if (typeof value !== "string") return value;
        if (!value.trim() || value === "null") return null;
        try {
            return pollInputSchema.parse(JSON.parse(value));
        } catch {
            ctx.addIssue({
                code: "custom",
                message: "투표를 저장하지 못했습니다.",
            });
            return z.NEVER;
        }
    });

export type PollInput = z.infer<typeof pollInputSchema>;
export type PollOptionInput = z.infer<typeof pollOptionInputSchema>;

/** 글 언어 한 벌만 쓰는 화면(이벤트)에서 쓰는 빈 값 */
export function emptyPollInput(locale: Locale): PollInput {
    return {
        question: { [locale]: "" },
        options: [{ text: { [locale]: "" } }, { text: { [locale]: "" } }],
        multiple: false,
        maxChoices: null,
        closesAt: null,
        results: "ALWAYS",
        showVoters: false,
        allowAddOptions: false,
    };
}

/** 글을 쓴 언어 한 벌만 채워도 되게, 채워진 벌 가운데 하나를 고른다(보는 언어 → ko → 아무거나) */
export function pickLocaleText(
    texts: Partial<Record<Locale, string>>,
    locale: Locale
) {
    return (
        texts[locale] ||
        texts.ko ||
        Object.values(texts).find((value) => value) ||
        ""
    );
}

export type PollValidationError =
    "question" | "options" | "duplicate" | "maxChoices" | "closesAt";

/**
 * 만들기 창에서 받은 값이 규칙에 맞는지 — 화면과 서버가 같은 함수를 쓴다.
 * 선택지 2~20개 · 빈 선택지 금지 · 같은 선택지 금지(Discourse 서버 규칙) · 마감은 앞으로.
 */
export function validatePollInput(
    poll: PollInput,
    now = new Date()
): PollValidationError | null {
    const question = Object.values(poll.question).filter(Boolean);
    if (question.length === 0) return "question";
    const filled = poll.options.map((option) =>
        Object.values(option.text).filter(Boolean)
    );
    if (
        filled.length < POLL_MIN_OPTIONS ||
        filled.length > POLL_MAX_OPTIONS ||
        filled.some((texts) => texts.length === 0)
    )
        return "options";
    for (const locale of SUPPORTED_LOCALES) {
        const texts = poll.options
            .map((option) => option.text[locale])
            .filter((value): value is string => Boolean(value));
        if (new Set(texts).size !== texts.length) return "duplicate";
    }
    if (poll.multiple && poll.maxChoices !== null) {
        if (poll.maxChoices < 2 || poll.maxChoices > poll.options.length)
            return "maxChoices";
    }
    if (poll.closesAt) {
        const closes = new Date(poll.closesAt);
        if (Number.isNaN(closes.getTime()) || closes <= now) return "closesAt";
    }
    return null;
}

/**
 * 표가 들어온 뒤에 바꿀 수 있는 것 — 마감 시각과(허용했다면) 선택지 추가뿐.
 * 질문 · 기존 선택지 글 · 고르는 방법은 잠근다(네이버 카페 · 디시 규칙, 2026-09-23).
 */
export function pollLockedChange(
    current: {
        question: Partial<Record<Locale, string>>;
        multiple: boolean;
        options: { id: number; text: Partial<Record<Locale, string>> }[];
        allowAddOptions: boolean;
    },
    next: PollInput
) {
    const sameText = (
        a: Partial<Record<Locale, string>>,
        b: Partial<Record<Locale, string>>
    ) =>
        SUPPORTED_LOCALES.every(
            (locale) => (a[locale] ?? "") === (b[locale] ?? "")
        );
    if (!sameText(current.question, next.question)) return true;
    if (current.multiple !== next.multiple) return true;
    const kept = next.options.filter((option) => option.id !== undefined);
    if (kept.length !== current.options.length) return true;
    for (const option of current.options) {
        const match = kept.find((item) => item.id === option.id);
        if (!match || !sameText(option.text, match.text)) return true;
    }
    const added = next.options.length - kept.length;
    if (added > 0 && !current.allowAddOptions) return true;
    return false;
}
