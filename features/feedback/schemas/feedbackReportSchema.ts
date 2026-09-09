import { z } from "zod";

import type { createTranslator } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/routing";

type Translator = ReturnType<typeof createTranslator>;

export function createFeedbackReportSchema(t: Translator) {
    return z.object({
        content: z
            .string()
            .trim()
            .min(10, t("feedback.contentError"))
            .max(1000, t("feedback.contentError")),
        imageUrl: z
            .union([
                z.literal(""),
                z.url({ error: t("feedback.attachmentError") }),
            ])
            .transform((value) => value || null),
    });
}

export type FeedbackReportSchema = ReturnType<
    typeof createFeedbackReportSchema
>;
export type FeedbackReportFormValues = z.input<FeedbackReportSchema>;
export type FeedbackReportValues = z.output<FeedbackReportSchema>;

export function feedbackReportInputFromFormData(formData: FormData) {
    return {
        content: String(formData.get("content") ?? ""),
        imageUrl: String(formData.get("imageUrl") ?? ""),
    };
}

export function createFeedbackReportFormData(
    values: FeedbackReportValues,
    locale: Locale
) {
    const formData = new FormData();
    formData.set("content", values.content);
    formData.set("imageUrl", values.imageUrl ?? "");
    formData.set("locale", locale);

    return formData;
}
