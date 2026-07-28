"use server";

import { revalidatePath } from "next/cache";

import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale } from "@/lib/i18n/routing";
import getSession from "@/lib/session";

export interface ToggleBingoCellResult {
    success: boolean;
    isCompleted?: boolean;
    message?: string;
}

// 현재 로그인한 사용자의 빙고 칸을 요청한 완료 상태로 저장함
export async function setBingoCellCompletion(
    bingoCellId: number,
    isCompleted: boolean,
    requestedLocale = "ko"
): Promise<ToggleBingoCellResult> {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();

    if (!session.id) {
        return {
            success: false,
            message: t("bingo.loginToSave"),
        };
    }

    if (
        !Number.isInteger(bingoCellId) ||
        bingoCellId < 1 ||
        typeof isCompleted !== "boolean"
    ) {
        return { success: false, message: t("bingo.invalidCell") };
    }

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
                userId: session.id,
                bingoCellId,
            },
        },
        create: {
            bingoCellId,
            userId: session.id,
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

    revalidatePath("/bingo");
    revalidatePath(`/bingo/${cell.bingoId}`);

    return { success: true, isCompleted };
}
