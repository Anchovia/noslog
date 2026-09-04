import "server-only";

import { revalidatePath } from "next/cache";
import { bingoProgressSchema } from "@/features/bingos/schemas/bingoProgressSchema";
import type { ActionResult } from "@/lib/actions/result";
import { logServerError } from "@/lib/observability/server";

import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale } from "@/lib/i18n/routing";
import { getSessionUser } from "@/lib/user";

export type ToggleBingoCellResult = ActionResult<{ isCompleted: boolean }>;

// 현재 로그인한 사용자의 빙고 칸을 요청한 완료 상태로 저장함
export async function setBingoCellCompletion(
    bingoCellId: number,
    isCompleted: boolean,
    requestedLocale = "ko"
): Promise<ToggleBingoCellResult> {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const { session, user } = await getSessionUser();

    if (!user) {
        if (session.id) session.destroy();
        return {
            success: false,
            message: t("bingo.loginToSave"),
        };
    }

    if (!bingoProgressSchema.safeParse({ bingoCellId, isCompleted }).success) {
        return { success: false, message: t("bingo.invalidCell") };
    }

    let bingoId: number;
    try {
        const cell = await db.bingoCell.findUnique({
            where: { id: bingoCellId },
            select: {
                bingoId: true,
                bingo: {
                    select: {
                        status: true,
                        startsAt: true,
                        endsAt: true,
                    },
                },
            },
        });

        if (!cell) {
            return { success: false, message: t("bingo.cellNotFound") };
        }
        bingoId = cell.bingoId;

        const now = new Date();
        const isUnavailable =
            cell.bingo.status !== "published" ||
            (cell.bingo.startsAt && cell.bingo.startsAt > now) ||
            (cell.bingo.endsAt && cell.bingo.endsAt < now);

        if (isUnavailable) {
            return { success: false, message: t("bingo.unavailable") };
        }

        await db.bingoCellProgress.upsert({
            where: {
                userId_bingoCellId: {
                    userId: user.id,
                    bingoCellId,
                },
            },
            create: {
                bingoCellId,
                userId: user.id,
                isCompleted,
                completionSource: "manual",
                completedAt: isCompleted ? now : null,
            },
            update: {
                isCompleted,
                completionSource: "manual",
                completedAt: isCompleted ? now : null,
            },
        });
    } catch (error) {
        logServerError(error, {
            event: "bingo.progress.save.failed",
            routePath: "/bingo/[id]",
            routeType: "action",
        });
        return { success: false, message: t("bingo.saveError") };
    }

    revalidatePath("/bingo");
    revalidatePath(`/bingo/${bingoId}`);

    return { success: true, message: "", isCompleted };
}
