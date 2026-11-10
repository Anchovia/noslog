import "server-only";

import type { Prisma } from "@prisma/client";

import {
    tierBoardLayoutSchema,
    type TierEntryPlacement,
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

export async function applyTierBoardLayout(
    tierListId: number,
    placements: TierEntryPlacement[]
): Promise<TierMutationActionResult> {
    await requireAdmin();
    const result = tierBoardLayoutSchema.safeParse({ tierListId, placements });
    if (!result.success) return invalidTierMutation(result.error);
    const input = result.data;

    try {
        if (!(await isEditableTierList(input.tierListId)))
            return ARCHIVED_TIER_LIST;
        const [bands, entries] = await Promise.all([
            db.tierBand.findMany({
                where: { tierListId: input.tierListId },
                select: { id: true, value: true },
            }),
            db.tierEntry.findMany({
                where: { tierListId: input.tierListId },
                select: {
                    id: true,
                    chartId: true,
                    tierBandId: true,
                    position: true,
                },
            }),
        ]);
        const bandIds = new Set(bands.map((band) => band.id));
        const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
        const placementIds = new Set(
            input.placements.map((placement) => placement.id)
        );
        if (
            placementIds.size !== input.placements.length ||
            placementIds.size !== entriesById.size ||
            input.placements.some(
                (placement) =>
                    !entriesById.has(placement.id) ||
                    !bandIds.has(placement.tierBandId)
            )
        ) {
            return {
                success: false,
                message: "현재 서열표와 배치 정보가 일치하지 않습니다.",
            };
        }

        const positionsByBand = new Map<number, number[]>();
        for (const placement of input.placements) {
            const positions = positionsByBand.get(placement.tierBandId) ?? [];
            positions.push(placement.position);
            positionsByBand.set(placement.tierBandId, positions);
        }
        if (
            [...positionsByBand.values()].some((positions) =>
                positions
                    .sort((left, right) => left - right)
                    .some((position, index) => position !== index + 1)
            )
        ) {
            return {
                success: false,
                message: "구간 안의 채보 순서를 확인해주세요.",
            };
        }

        const changedPlacements = input.placements.filter((placement) => {
            const entry = entriesById.get(placement.id);
            return (
                entry?.tierBandId !== placement.tierBandId ||
                entry.position !== placement.position
            );
        });
        if (changedPlacements.length === 0) {
            return { success: true, message: "변경 사항이 없습니다." };
        }

        const bandValues = new Map(bands.map((band) => [band.id, band.value]));
        const operations: Prisma.PrismaPromise<unknown>[] = [
            ...parkPositions(
                "TierEntry",
                changedPlacements.map((placement) => placement.id)
            ),
            ...placePositions(
                "TierEntry",
                changedPlacements.map((placement) => ({
                    id: placement.id,
                    position: placement.position,
                    tierBandId: placement.tierBandId,
                }))
            ),
            ...changedPlacements.flatMap((placement) => {
                const entry = entriesById.get(placement.id);
                if (!entry || entry.tierBandId === placement.tierBandId) {
                    return [];
                }

                return [
                    db.tierPlacementHistory.create({
                        data: {
                            tierListId: input.tierListId,
                            chartId: entry.chartId,
                            bandValue:
                                bandValues.get(placement.tierBandId) ?? null,
                        },
                    }),
                ];
            }),
        ];

        await db.$transaction([...operations, touchTierList(input.tierListId)]);
        revalidateTierList(input.tierListId);
        return { success: true, message: "서열표 배치를 적용했습니다." };
    } catch (error) {
        logTierActionError(error, "admin.tier-board.update.failed");
        return { success: false, message: "배치를 적용하지 못했습니다." };
    }
}
