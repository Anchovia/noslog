"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath, updateTag } from "next/cache";

import {
    bingoDeleteInputFromFormData,
    bingoDeleteSchema,
    bingoSaveInputFromFormData,
    bingoSaveSchema,
    type BingoFormFieldName,
    type BingoSaveValues,
} from "@/features/bingos/schemas/bingoEditorSchema";
import type { ActionFieldErrors, ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";

type BingoActionResult = ActionResult<{ id: number }, BingoFormFieldName>;
type BingoDeleteActionResult = ActionResult;

function toNullableText(value: string) {
    return value || null;
}

function toNullableDate(value: string) {
    return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

function parseRuleConfig(value: string) {
    if (!value) return Prisma.DbNull;

    try {
        const parsed = JSON.parse(value) as Prisma.InputJsonValue | null;
        return parsed === null ? Prisma.JsonNull : parsed;
    } catch {
        return { value } satisfies Prisma.InputJsonValue;
    }
}

function getBingoFieldErrors(
    issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>
) {
    const fieldErrors: ActionFieldErrors<BingoFormFieldName> = {};

    for (const issue of issues) {
        if (issue.path[0] === "id") continue;
        const field = issue.path.join(".") as BingoFormFieldName;
        fieldErrors[field] ??= [];
        fieldErrors[field]?.push(issue.message);
    }

    return fieldErrors;
}

function invalidBingoResult(
    issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>
): BingoActionResult {
    const fieldErrors = getBingoFieldErrors(issues);
    const firstMessage = Object.values(fieldErrors).flat()[0];

    return {
        success: false,
        message:
            firstMessage ?? issues[0]?.message ?? "빙고 입력을 확인해주세요.",
        ...(Object.keys(fieldErrors).length > 0 ? { fieldErrors } : {}),
    };
}

function bingoData(input: BingoSaveValues) {
    return {
        title: input.title,
        description: toNullableText(input.description),
        coverMusicIndex: input.coverMusicIndex,
        rewardNos: input.rewardNos,
        requiredLines: input.requiredLines,
        status: input.status,
        startsAt: toNullableDate(input.startsAt),
        endsAt: toNullableDate(input.endsAt),
    };
}

function refreshBingos(bingoId?: number) {
    updateTag(CACHE_TAGS.bingos);
    revalidatePath("/admin");
    revalidatePath("/admin/bingos");
    revalidatePath("/bingo");
    if (bingoId !== undefined) revalidatePath(`/bingo/${bingoId}`);
}

export async function saveBingo(
    formData: FormData
): Promise<BingoActionResult> {
    await requireAdmin();
    const result = bingoSaveSchema.safeParse(
        bingoSaveInputFromFormData(formData)
    );
    if (!result.success) return invalidBingoResult(result.error.issues);
    const input = result.data;

    let bingoId = input.id;
    try {
        const coverExists = await db.music.count({
            where: { index: input.coverMusicIndex },
        });
        if (!coverExists) {
            return {
                success: false,
                message: "선택한 표지 악곡을 찾을 수 없습니다.",
                fieldErrors: {
                    coverMusicIndex: ["선택한 표지 악곡을 찾을 수 없습니다."],
                },
            };
        }

        await db.$transaction(async (transaction) => {
            if (input.id !== undefined) {
                await transaction.bingo.update({
                    where: { id: input.id },
                    data: bingoData(input),
                });
            } else {
                const created = await transaction.bingo.create({
                    data: bingoData(input),
                });
                bingoId = created.id;
            }

            for (const cell of input.cells) {
                const data = {
                    position: cell.position,
                    title: cell.title,
                    missionType: cell.missionType,
                    ruleType: cell.ruleType,
                    ruleConfig: parseRuleConfig(cell.ruleConfig),
                    categoryShort: toNullableText(cell.categoryShort),
                    targetDifficulty: toNullableText(cell.targetDifficulty),
                    targetLevel: cell.targetLevel,
                    musicIndex: toNullableText(cell.musicIndex),
                };

                await transaction.bingoCell.upsert({
                    where: {
                        bingoId_position: {
                            bingoId: bingoId!,
                            position: cell.position,
                        },
                    },
                    create: { ...data, bingoId: bingoId! },
                    update: data,
                });
            }
        });
    } catch (error) {
        logServerError(error, {
            event: "admin.bingo.save.failed",
            routePath: "/admin/bingos",
            routeType: "action",
        });
        return {
            success: false,
            message: "빙고를 저장하지 못했습니다.",
        };
    }

    refreshBingos(bingoId);
    return {
        success: true,
        message:
            input.id === undefined
                ? "빙고를 추가했습니다."
                : "빙고를 저장했습니다.",
        id: bingoId!,
    };
}

export async function deleteBingo(
    formData: FormData
): Promise<BingoDeleteActionResult> {
    await requireAdmin();
    const result = bingoDeleteSchema.safeParse(
        bingoDeleteInputFromFormData(formData)
    );
    if (!result.success) {
        return {
            success: false,
            message: result.error.issues[0]?.message ?? "잘못된 빙고입니다.",
        };
    }
    const { id } = result.data;

    try {
        const progressCount = await db.bingoCellProgress.count({
            where: { cell: { bingoId: id } },
        });
        if (progressCount > 0) {
            return {
                success: false,
                message: "진행 기록이 있는 빙고는 삭제할 수 없습니다.",
            };
        }

        await db.bingo.delete({ where: { id } });
    } catch (error) {
        logServerError(error, {
            event: "admin.bingo.delete.failed",
            routePath: "/admin/bingos",
            routeType: "action",
        });
        return {
            success: false,
            message: "빙고를 삭제하지 못했습니다.",
        };
    }

    refreshBingos();
    return { success: true, message: "빙고를 삭제했습니다." };
}
