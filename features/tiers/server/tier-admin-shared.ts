import "server-only";

import { Prisma } from "@prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import { after } from "next/server";
import type { ZodError } from "zod";

import { rebuildStalePlayerRatings } from "@/features/rankings/server/player-rating-service";
import type { ActionResult } from "@/lib/actions/result";
import { actionValidationFailure } from "@/lib/actions/validation";
import { CACHE_TAGS } from "@/lib/cache-tags";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";
import { isCurrentTierScope } from "@/lib/tiers";

export type TierMutationActionResult = ActionResult;

export function invalidTierMutation(error: ZodError): TierMutationActionResult {
    return actionValidationFailure(error, {
        message: "서열표 요청을 확인해주세요.",
        preferFirstIssue: true,
        fieldPath: false,
    });
}

// 지금 쓰는 서열표만 고친다 — 보관 서열표(옛 Recital FC 등)는 화면이 없어도 직접 호출로 바뀌지 않게(2026-10-16)
export const ARCHIVED_TIER_LIST: TierMutationActionResult = {
    success: false,
    message: "보관된 서열표는 고칠 수 없습니다.",
};
export async function isEditableTierList(tierListId: number) {
    const list = await db.tierList.findUnique({
        where: { id: tierListId },
        select: { mode: true, goal: true },
    });
    return !!list && isCurrentTierScope(list.mode, list.goal);
}

export function logTierActionError(error: unknown, event: string) {
    logServerError(error, {
        event,
        routePath: "/admin/tiers",
        routeType: "action",
    });
}

// 피아니스트 서열 상수가 바뀌었으면 저장해 둔 레이팅을 응답 뒤에 다시 센다(2026-10-15 L2-A2).
// 기준이 그대로면(초안 · 다른 목표 서열표) 한 줄 확인으로 끝난다
function rebuildRatingsAfterResponse() {
    after(() =>
        rebuildStalePlayerRatings().catch((error) =>
            logServerError(error, {
                event: "admin.tiers.player-ratings.rebuild",
                routePath: "/admin/tiers",
                routeType: "action",
            })
        )
    );
}

// 공개 화면 「N월 N일 업데이트」 는 배치 · 구간이 바뀐 날이다 — 구간 · 채보를 바꾸는 트랜잭션에 함께 넣는다
export function touchTierList(id: number) {
    return db.tierList.update({
        where: { id },
        data: { updatedAt: new Date() },
    });
}

export function revalidateTierList(id: number) {
    // 랭킹 레이팅 캐시도 tierLists 태그를 달고 있어 함께 비워진다(userRankings 따로 안 비움)
    updateTag(CACHE_TAGS.tierLists);
    rebuildRatingsAfterResponse();
    revalidatePath("/admin");
    revalidatePath("/admin/tiers");
    revalidatePath(`/admin/tiers/${id}`);
    revalidatePath("/tiers");
    revalidatePath(`/tiers/${id}`);
}

export function revalidateTierListIndex() {
    // 랭킹 레이팅 캐시도 tierLists 태그를 달고 있어 함께 비워진다(userRankings 따로 안 비움)
    updateTag(CACHE_TAGS.tierLists);
    rebuildRatingsAfterResponse();
    revalidatePath("/admin");
    revalidatePath("/admin/tiers");
    revalidatePath("/tiers");
}

type TierPositionTable = "TierBand" | "TierEntry";
// DB 표 이름(2026-10-16 P7 — snake 복수)
const POSITION_TABLE_NAMES: Record<TierPositionTable, string> = {
    TierBand: "tier_bands",
    TierEntry: "tier_entries",
};

/*
 * 순번을 문장 두 개로 다시 매긴다(2026-10-16 DB 재설계 P4 Q5) — 예전에는 줄마다 UPDATE 를 두 번(2N) 보냈다.
 * 유일 키(목록 · 순번, 구간 · 순번)는 행마다 바로 검사되므로 한 문장으로 맞바꾸면 중간에 부딪힌다.
 * 그래서 예전처럼 먼저 모두 음수(-id)로 비킨 뒤 한 번에 제자리로 옮긴다. updated_at 은 Prisma 대신 직접 쓴다
 */
export function parkPositions(table: TierPositionTable, ids: number[]) {
    if (ids.length === 0) return [];
    return [
        db.$executeRaw`UPDATE ${Prisma.raw(POSITION_TABLE_NAMES[table])} SET "position" = -"id", "updated_at" = CURRENT_TIMESTAMP WHERE "id" IN (${Prisma.join(ids)})`,
    ];
}

export function placePositions(
    table: TierPositionTable,
    rows: { id: number; position: number; tierBandId?: number }[]
) {
    if (rows.length === 0) return [];
    const values = Prisma.join(
        rows.map(
            (row) =>
                Prisma.sql`(${row.id}::int, ${row.position}::int, ${row.tierBandId ?? null}::int)`
        )
    );
    // TierEntry 는 다른 구간으로 옮길 때 구간도 함께 바꾼다
    const band =
        table === "TierEntry"
            ? Prisma.sql`, "tier_band_id" = COALESCE(v.band, t."tier_band_id")`
            : Prisma.empty;
    return [
        db.$executeRaw`UPDATE ${Prisma.raw(POSITION_TABLE_NAMES[table])} AS t SET "position" = v.position, "updated_at" = CURRENT_TIMESTAMP${band} FROM (VALUES ${values}) AS v(id, position, band) WHERE t."id" = v.id`,
    ];
}
