"use server";

import { revalidatePath } from "next/cache";

import db from "@/lib/db";
import getSession from "@/lib/session";

export interface ToggleBingoCellResult {
    success: boolean;
    isCompleted?: boolean;
    message?: string;
}

// 현재 로그인한 사용자의 빙고 칸 완료 상태만 변경함
export async function toggleBingoCell(
    bingoCellId: number
): Promise<ToggleBingoCellResult> {
    const session = await getSession();

    if (!session.id) {
        return {
            success: false,
            message: "로그인 후 빙고 진행 상태를 저장할 수 있습니다.",
        };
    }

    if (!Number.isInteger(bingoCellId) || bingoCellId < 1) {
        return { success: false, message: "잘못된 빙고 칸입니다." };
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
            progress: {
                where: { userId: session.id },
                select: { id: true },
            },
        },
    });

    if (!cell) {
        return { success: false, message: "빙고 칸을 찾을 수 없습니다." };
    }

    const now = new Date();
    const isUnavailable =
        cell.bingo.status !== "published" ||
        (cell.bingo.startsAt && cell.bingo.startsAt > now) ||
        (cell.bingo.endsAt && cell.bingo.endsAt < now);

    if (isUnavailable) {
        return { success: false, message: "현재 진행할 수 없는 빙고입니다." };
    }

    const previous = cell.progress[0];

    if (previous) {
        await db.bingoCellProgress.delete({
            where: {
                userId_bingoCellId: {
                    userId: session.id,
                    bingoCellId,
                },
            },
        });
    } else {
        await db.bingoCellProgress.create({
            data: {
                bingoCellId,
                userId: session.id,
                isCompleted: true,
                completionSource: "manual",
                completedAt: new Date(),
            },
        });
    }

    revalidatePath("/bingo");
    revalidatePath(`/bingo/${cell.bingoId}`);

    return { success: true, isCompleted: !previous };
}
