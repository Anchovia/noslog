import { z } from "zod";
import type { createTranslator } from "@/lib/i18n/messages";

export const accountDeletionSummarySchema = z.object({
    plays: z.number().int().nonnegative(),
    growth: z.number().int().nonnegative(),
    community: z.number().int().nonnegative(),
    progress: z.number().int().nonnegative(),
    uploads: z.number().int().nonnegative(),
});
export type AccountDeletionSummary = z.infer<
    typeof accountDeletionSummarySchema
>;

export function createAccountDeletionSchema(
    t: ReturnType<typeof createTranslator>
) {
    const confirmation = t("settings.deleteConfirmation");
    return z.object({
        confirmation: z.string().refine((value) => value === confirmation, {
            error: t("settings.deleteConfirmationError", { confirmation }),
        }),
    });
}
export type AccountDeletionFormValues = z.infer<
    ReturnType<typeof createAccountDeletionSchema>
>;

export const accountDeletionResultSchema = z.discriminatedUnion("success", [
    z.object({ success: z.literal(true) }),
    z.object({
        success: z.literal(false),
        message: z.string(),
        reauthenticationRequired: z.boolean().optional(),
    }),
]);
export type AccountDeletionResult = z.infer<typeof accountDeletionResultSchema>;
