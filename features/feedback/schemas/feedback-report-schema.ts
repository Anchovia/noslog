import { z } from "zod";

import type { createTranslator } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/routing";

type Translator = ReturnType<typeof createTranslator>;

/** 제보 종류 — 오류 제보 · 제안 의견 (2026-09-18). 오락실 제보처럼 다른 경로로 들어온 제보는 종류가 비어 있다 */
export const FEEDBACK_CATEGORIES = ["bug", "idea"] as const;
export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export function createFeedbackReportSchema(t: Translator) {
    return z.object({
        category: z.enum(FEEDBACK_CATEGORIES, {
            error: t("feedback.categoryError"),
        }),
        // 최소 글자 없이 빈 칸만 막는다 — 짧은 제보도 받는다 (2026-09-18 사용자 결정)
        content: z
            .string()
            .trim()
            .min(1, t("feedback.contentRequired"))
            .max(1000, t("feedback.contentTooLong")),
        imageUrl: z
            .union([
                z.literal(""),
                z.url({ error: t("feedback.attachmentError") }),
            ])
            .transform((value) => value || null),
    });
}

type FeedbackReportSchema = ReturnType<typeof createFeedbackReportSchema>;
export type FeedbackReportFormValues = z.input<FeedbackReportSchema>;
export type FeedbackReportValues = z.output<FeedbackReportSchema>;

export function feedbackReportInputFromFormData(formData: FormData) {
    return {
        category: String(formData.get("category") ?? ""),
        content: String(formData.get("content") ?? ""),
        imageUrl: String(formData.get("imageUrl") ?? ""),
    };
}

export function createFeedbackReportFormData(
    values: FeedbackReportValues,
    locale: Locale
) {
    const formData = new FormData();
    formData.set("category", values.category);
    formData.set("content", values.content);
    formData.set("imageUrl", values.imageUrl ?? "");
    formData.set("locale", locale);

    return formData;
}
