import "server-only";

import { revalidatePath, updateTag } from "next/cache";

import type { ActionResult } from "@/lib/actions/result";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale, localizePath } from "@/lib/i18n/routing";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";

// 같은 사람이 같은 기체를 하루에 여러 번 눌러도 기록은 하나
const CHECK_DEDUPE_MS = 24 * 60 * 60 * 1000;

export type CabinetCheckActionResult = ActionResult<{ checkedAt: string }>;

/**
 * 「가동 확인」 한 번 누르기. 로그인 이용자가 기체가 지금 돌아간다고 남기는 기록이며,
 * 공개 데이터에서는 마지막 확인 시각과 확인 인원으로만 드러난다.
 */
export async function confirmCabinetRunning(
    cabinetId: number,
    requestedLocale = "ko"
): Promise<CabinetCheckActionResult> {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();
    if (!session.id)
        return {
            success: false,
            message: t("onboarding.error.loginRequired"),
        };
    if (!Number.isInteger(cabinetId) || cabinetId <= 0)
        return { success: false, message: t("arcades.error.select") };

    try {
        const cabinet = await db.arcadeCabinet.findFirst({
            where: {
                id: cabinetId,
                isActive: true,
                arcade: { is_active: true },
            },
            select: {
                id: true,
                arcade: {
                    select: {
                        id: true,
                        publicDetails: { select: { slug: true } },
                    },
                },
            },
        });
        if (!cabinet)
            return { success: false, message: t("arcades.error.notFound") };

        const now = new Date();
        const recent = await db.arcadeCabinetCheck.findFirst({
            where: {
                cabinetId: cabinet.id,
                userId: session.id,
                checkedAt: { gte: new Date(now.getTime() - CHECK_DEDUPE_MS) },
            },
            select: { checkedAt: true },
            orderBy: { checkedAt: "desc" },
        });
        const check =
            recent ??
            (await db.arcadeCabinetCheck.create({
                data: { cabinetId: cabinet.id, userId: session.id },
                select: { checkedAt: true },
            }));

        updateTag(CACHE_TAGS.arcades);
        const slug =
            cabinet.arcade.publicDetails?.slug ?? String(cabinet.arcade.id);
        for (const path of ["/gamecenter", `/gamecenter/${slug}`]) {
            revalidatePath(path);
            revalidatePath(localizePath(path, locale));
        }
        return {
            success: true,
            message: t("arcades.confirmSaved"),
            checkedAt: check.checkedAt.toISOString(),
        };
    } catch (error) {
        logServerError(error, {
            event: "arcades.cabinet-check.failed",
            routePath: "/gamecenter",
            routeType: "action",
        });
        return { success: false, message: t("arcades.confirmFailed") };
    }
}

/** 이 사용자가 24시간 안에 확인을 남긴 기체 id — 상세 화면의 「확인함」 상태 */
export async function getUserCheckedCabinetIds(
    userId: number,
    cabinetIds: number[]
): Promise<number[]> {
    if (!cabinetIds.length) return [];
    const rows = await db.arcadeCabinetCheck.findMany({
        where: {
            userId,
            cabinetId: { in: cabinetIds },
            checkedAt: { gte: new Date(Date.now() - CHECK_DEDUPE_MS) },
        },
        select: { cabinetId: true },
        distinct: ["cabinetId"],
    });
    return rows.map((row) => row.cabinetId);
}

export type RecentCabinetCheck = {
    username: string | null;
    userId: number;
    cabinetPosition: number;
    cabinetLabel: string | null;
    checkedAt: string;
};

/** 오락실의 최근 확인 기록(레일 「최근 확인」) — 최근 30일, 사람마다 가장 최근 것 하나 */
export async function getRecentCabinetChecks(
    arcadeId: number,
    limit = 5
): Promise<RecentCabinetCheck[]> {
    const rows = await db.arcadeCabinetCheck.findMany({
        where: {
            cabinet: { arcadeId, isActive: true },
            checkedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        orderBy: { checkedAt: "desc" },
        take: limit * 4,
        select: {
            userId: true,
            checkedAt: true,
            user: { select: { username: true } },
            cabinet: { select: { position: true, label: true } },
        },
    });
    const seen = new Set<number>();
    const result: RecentCabinetCheck[] = [];
    for (const row of rows) {
        if (seen.has(row.userId)) continue;
        seen.add(row.userId);
        result.push({
            username: row.user.username,
            userId: row.userId,
            cabinetPosition: row.cabinet.position,
            cabinetLabel: row.cabinet.label,
            checkedAt: row.checkedAt.toISOString(),
        });
        if (result.length >= limit) break;
    }
    return result;
}
