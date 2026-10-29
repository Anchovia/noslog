import "server-only";

import { revalidatePath, updateTag } from "next/cache";

import type { ArcadeReportFormValues } from "@/features/arcades/schemas/arcade-report-schema";
import {
    arcadeReportInputFromFormData,
    createArcadeReportSchema,
} from "@/features/arcades/schemas/arcade-report-schema";
import type { ActionResult } from "@/lib/actions/result";
import { actionValidationFailure } from "@/lib/actions/validation";
import { isValidPrivateImageBlob } from "@/lib/blob";
import { CACHE_TAGS } from "@/lib/cache-tags";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale } from "@/lib/i18n/routing";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";

/** 오락실 제보는 사람마다 24시간에 이만큼 — 일반 피드백과 따로 센다 */
const ARCADE_REPORT_DAILY_LIMIT = 30;

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
        return actionValidationFailure(parsed.error, {
            message: t("feedback.contentError"),
            alwaysIncludeFieldErrors: true,
        });
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
            where: { id: arcadeId, isActive: true },
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
        const userId = session.id;
        // 세기와 넣기 사이를 사람마다 잠가 동시에 보낸 요청이 하루 한도를 넘지 않게 한다
        const saved = await db.$transaction(async (tx) => {
            await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`feedback-report:${userId}`}))`;
            const recent = await tx.feedbackReport.count({
                where: {
                    userId,
                    arcadeReportType: { not: null },
                    createdAt: { gte: new Date(Date.now() - 86_400_000) },
                },
            });
            if (recent >= ARCADE_REPORT_DAILY_LIMIT) return false;
            // Preserve context in the existing moderator view without changing /admin UI.
            await tx.feedbackReport.upsert({
                where: { userId_submissionId: { userId, submissionId } },
                create: {
                    userId,
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
            return true;
        });
        if (!saved)
            return { success: false, message: t("feedback.dailyLimit") };
        revalidatePath("/admin/feedback");
        // 공개 오락실 화면의 열린 신고 수(캐시)도 바로 바뀌게
        updateTag(CACHE_TAGS.arcades);
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
