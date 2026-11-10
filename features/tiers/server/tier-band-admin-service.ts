import "server-only";

import type { Prisma } from "@prisma/client";

import {
    tierBandCreateInputFromFormData,
    tierBandCreateSchema,
    tierBandDeleteSchema,
    tierBandUpdateInputFromFormData,
    tierBandUpdateSchema,
    tierIdInputFromFormData,
} from "@/features/tiers/schemas/tier-admin-schema";
import {
    ARCHIVED_TIER_LIST,
    invalidTierMutation,
    isEditableTierList,
    logTierActionError,
    parkPositions,
    placePositions,
    revalidateTierList,
    type TierMutationActionResult,
    touchTierList,
} from "@/features/tiers/server/tier-admin-shared";
import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";

export async function addTierBand(
    formData: FormData
): Promise<TierMutationActionResult> {
    await requireAdmin();
    const result = tierBandCreateSchema.safeParse(
        tierBandCreateInputFromFormData(formData)
    );
    if (!result.success) return invalidTierMutation(result.error);
    const { tierListId, value } = result.data;

    try {
        if (!(await isEditableTierList(tierListId))) return ARCHIVED_TIER_LIST;
        const bands = await db.tierBand.findMany({
            where: { tierListId },
            select: { id: true, value: true },
            orderBy: { value: "desc" },
        });
        if (bands.some((band) => band.value === value)) {
            return {
                success: false,
                message: "같은 서열 상수 구간이 이미 있습니다.",
            };
        }

        const insertionIndex = bands.findIndex((band) => band.value < value);
        const position =
            insertionIndex === -1 ? bands.length + 1 : insertionIndex + 1;
        const operations: Prisma.PrismaPromise<unknown>[] = [
            ...parkPositions(
                "TierBand",
                bands.map((band) => band.id)
            ),
            db.tierBand.create({
                data: { tierListId, value, position },
            }),
            ...placePositions(
                "TierBand",
                bands.map((band, index) => ({
                    id: band.id,
                    position: index + 1 + (index >= position - 1 ? 1 : 0),
                }))
            ),
        ];

        await db.$transaction([...operations, touchTierList(tierListId)]);
        revalidateTierList(tierListId);
        return { success: true, message: "서열 상수 구간을 추가했습니다." };
    } catch (error) {
        logTierActionError(error, "admin.tier-band.create.failed");
        return { success: false, message: "구간을 추가하지 못했습니다." };
    }
}

export async function updateTierBand(
    formData: FormData
): Promise<TierMutationActionResult> {
    await requireAdmin();
    const result = tierBandUpdateSchema.safeParse(
        tierBandUpdateInputFromFormData(formData)
    );
    if (!result.success) return invalidTierMutation(result.error);
    const { id, value } = result.data;

    try {
        const band = await db.tierBand.findUnique({
            where: { id },
            select: {
                value: true,
                tierListId: true,
                entries: { select: { chartId: true } },
            },
        });
        if (!band) {
            return { success: false, message: "서열 상수 구간이 없습니다." };
        }
        if (!(await isEditableTierList(band.tierListId)))
            return ARCHIVED_TIER_LIST;
        if (band.value === value) {
            return { success: true, message: "변경 사항이 없습니다." };
        }

        const bands = await db.tierBand.findMany({
            where: { tierListId: band.tierListId },
            select: { id: true, value: true },
        });
        if (bands.some((item) => item.id !== id && item.value === value)) {
            return {
                success: false,
                message: "같은 서열 상수 구간이 이미 있습니다.",
            };
        }

        const sortedBands = bands
            .map((item) => (item.id === id ? { ...item, value } : item))
            .sort((left, right) => right.value - left.value);
        const operations: Prisma.PrismaPromise<unknown>[] = [
            ...parkPositions(
                "TierBand",
                bands.map((item) => item.id)
            ),
            ...placePositions(
                "TierBand",
                sortedBands.map((item, index) => ({
                    id: item.id,
                    position: index + 1,
                }))
            ),
            db.tierBand.update({ where: { id }, data: { value } }),
            ...(band.entries.length > 0
                ? [
                      db.tierPlacementHistory.createMany({
                          data: band.entries.map((entry) => ({
                              tierListId: band.tierListId,
                              chartId: entry.chartId,
                              bandValue: value,
                          })),
                      }),
                  ]
                : []),
        ];

        await db.$transaction([...operations, touchTierList(band.tierListId)]);
        revalidateTierList(band.tierListId);
        return { success: true, message: "서열 상수 구간을 저장했습니다." };
    } catch (error) {
        logTierActionError(error, "admin.tier-band.update.failed");
        return { success: false, message: "구간을 저장하지 못했습니다." };
    }
}

export async function deleteTierBand(
    formData: FormData
): Promise<TierMutationActionResult> {
    await requireAdmin();
    const result = tierBandDeleteSchema.safeParse(
        tierIdInputFromFormData(formData)
    );
    if (!result.success) return invalidTierMutation(result.error);
    const { id } = result.data;

    try {
        const band = await db.tierBand.findUnique({
            where: { id },
            select: {
                tierListId: true,
                entries: { select: { chartId: true } },
            },
        });
        if (!band) {
            return { success: false, message: "서열 상수 구간이 없습니다." };
        }
        if (!(await isEditableTierList(band.tierListId)))
            return ARCHIVED_TIER_LIST;

        const remainingBands = await db.tierBand.findMany({
            where: { tierListId: band.tierListId, NOT: { id } },
            select: { id: true },
            orderBy: { value: "desc" },
        });
        const operations: Prisma.PrismaPromise<unknown>[] = [
            ...parkPositions(
                "TierBand",
                remainingBands.map((item) => item.id)
            ),
            ...(band.entries.length > 0
                ? [
                      db.tierPlacementHistory.createMany({
                          data: band.entries.map((entry) => ({
                              tierListId: band.tierListId,
                              chartId: entry.chartId,
                              bandValue: null,
                          })),
                      }),
                  ]
                : []),
            db.tierBand.delete({ where: { id } }),
            ...placePositions(
                "TierBand",
                remainingBands.map((item, index) => ({
                    id: item.id,
                    position: index + 1,
                }))
            ),
        ];

        await db.$transaction([...operations, touchTierList(band.tierListId)]);
        revalidateTierList(band.tierListId);
        return { success: true, message: "서열 상수 구간을 삭제했습니다." };
    } catch (error) {
        logTierActionError(error, "admin.tier-band.delete.failed");
        return { success: false, message: "구간을 삭제하지 못했습니다." };
    }
}
