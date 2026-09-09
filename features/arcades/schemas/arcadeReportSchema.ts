import { z } from "zod";
import { createFeedbackReportSchema } from "@/features/feedback/schemas/feedbackReportSchema";
import type { createTranslator } from "@/lib/i18n/messages";

export const ARCADE_REPORT_TYPES = [
    "unavailable",
    "condition",
    "count",
    "price",
    "hours",
    "address",
    "other",
] as const;
export function createArcadeReportSchema(
    t: ReturnType<typeof createTranslator>
) {
    return createFeedbackReportSchema(t)
        .extend({
            arcadeId: z.number().int().positive(),
            cabinetId: z.number().int().positive().nullable(),
            reportType: z.enum(ARCADE_REPORT_TYPES),
            submissionId: z.uuid(),
        })
        .superRefine((value, ctx) => {
            if (
                value.cabinetId !== null &&
                !["unavailable", "condition"].includes(value.reportType)
            ) {
                ctx.addIssue({
                    code: "custom",
                    path: ["cabinetId"],
                    message: t("arcades.error.select"),
                });
            }
        });
}
export type ArcadeReportFormValues = z.input<
    ReturnType<typeof createArcadeReportSchema>
>;
export type ArcadeReportValues = z.output<
    ReturnType<typeof createArcadeReportSchema>
>;

export function arcadeReportInputFromFormData(formData: FormData) {
    const cabinet = formData.get("cabinetId");
    return {
        content: String(formData.get("content") ?? ""),
        imageUrl: String(formData.get("imageUrl") ?? ""),
        arcadeId: Number(formData.get("arcadeId")),
        cabinetId: cabinet ? Number(cabinet) : null,
        reportType: String(formData.get("reportType") ?? ""),
        submissionId: String(formData.get("submissionId") ?? ""),
    };
}
