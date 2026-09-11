import "server-only";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { isValidPrivateImageBlob } from "@/lib/blob";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale } from "@/lib/i18n/routing";
import type { ActionResult } from "@/lib/actions/result";
import {
    arcadeReportInputFromFormData,
    createArcadeReportSchema,
} from "@/features/arcades/schemas/arcadeReportSchema";
import type { ArcadeReportFormValues } from "@/features/arcades/schemas/arcadeReportSchema";
import { logServerError } from "@/lib/observability/server";

export async function submitArcadeReport(
    formData: FormData
): Promise<ActionResult<Record<never, never>, keyof ArcadeReportFormValues>> {
    const requestedLocale = formData.get("locale");
    const locale =
        typeof requestedLocale === "string" && isLocale(requestedLocale)
            ? requestedLocale
            : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();
    if (!session.id)
        return { success: false, message: t("feedback.loginError") };
    const parsed = createArcadeReportSchema(t).safeParse(
        arcadeReportInputFromFormData(formData)
    );
    if (!parsed.success)
        return {
            success: false,
            message: t("feedback.contentError"),
            fieldErrors: parsed.error.flatten().fieldErrors,
        };
    const { arcadeId, cabinetId, reportType, content, imageUrl, submissionId } =
        parsed.data;
    try {
        const existing = await db.feedbackReport.findUnique({
            where: {
                userId_submissionId: { userId: session.id, submissionId },
            },
            select: { id: true },
        });
        if (existing) return { success: true, message: t("feedback.success") };
        const arcade = await db.arcade.findFirst({
            where: { id: arcadeId, is_active: true },
            select: {
                name: true,
                cabinets: {
                    where: { id: cabinetId ?? -1, isActive: true },
                    select: { id: true, label: true, position: true },
                },
            },
        });
        if (!arcade || (cabinetId !== null && !arcade.cabinets.length))
            return { success: false, message: t("arcades.error.notFound") };
        if (
            imageUrl &&
            !(await isValidPrivateImageBlob(
                imageUrl,
                `feedback/${session.id}/report`
            ))
        )
            return { success: false, message: t("feedback.attachmentError") };
        const cabinet = arcade.cabinets[0];
        const context = [
            arcade.name,
            t(`arcades.reportType.${reportType}`),
            cabinet
                ? (cabinet.label ??
                  t("arcades.cabinetNumber", { count: cabinet.position + 1 }))
                : null,
        ]
            .filter(Boolean)
            .join(" · ");
        // Preserve context in the existing moderator view without changing /admin UI.
        await db.feedbackReport.upsert({
            where: {
                userId_submissionId: { userId: session.id, submissionId },
            },
            create: {
                userId: session.id,
                submissionId,
                arcadeId,
                cabinetId,
                arcadeReportType: reportType,
                content: `${context}\n\n${content}`,
                imageUrl,
            },
            update: {},
            select: { id: true },
        });
        revalidatePath("/admin/feedback");
        return { success: true, message: t("feedback.success") };
    } catch (error) {
        logServerError(error, {
            event: "arcades.report.submit.failed",
            routePath: "/gamecenter",
            routeType: "action",
        });
        return { success: false, message: t("feedback.submitError") };
    }
}
