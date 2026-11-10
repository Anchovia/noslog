import "server-only";

import type { ZodError } from "zod";

import {
    tierIdInputFromFormData,
    tierListDeleteSchema,
    type TierListFormFieldName,
    tierListSaveInputFromFormData,
    tierListSaveSchema,
    type TierListSaveValues,
} from "@/features/tiers/schemas/tier-admin-schema";
import {
    ARCHIVED_TIER_LIST,
    invalidTierMutation,
    isEditableTierList,
    logTierActionError,
    revalidateTierList,
    revalidateTierListIndex,
    type TierMutationActionResult,
} from "@/features/tiers/server/tier-admin-shared";
import type { ActionResult } from "@/lib/actions/result";
import { actionValidationFailure } from "@/lib/actions/validation";
import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";

type TierListActionResult = ActionResult<{ id: number }, TierListFormFieldName>;

function invalidTierListInput(error: ZodError): TierListActionResult {
    return actionValidationFailure<TierListFormFieldName>(error, {
        message: "서열표 입력을 확인해주세요.",
        preferFirstIssue: true,
        omitFields: ["id"],
    });
}

function tierListData(input: TierListSaveValues) {
    return {
        slug: input.slug,
        title: input.title,
        mode: input.mode,
        goal: input.goal,
        description: input.description || null,
        status: input.status,
    };
}

export async function createTierList(
    formData: FormData
): Promise<TierListActionResult> {
    await requireAdmin();
    const result = tierListSaveSchema.safeParse(
        tierListSaveInputFromFormData(formData)
    );
    if (!result.success) return invalidTierListInput(result.error);
    const input = result.data;

    try {
        const duplicate = await db.tierList.findFirst({
            where: {
                OR: [
                    { slug: input.slug },
                    ...(input.status === "published"
                        ? [
                              {
                                  mode: input.mode,
                                  goal: input.goal,
                                  status: "published" as const,
                              },
                          ]
                        : []),
                ],
            },
            select: { slug: true },
        });
        if (duplicate) {
            const slugDuplicate = duplicate.slug === input.slug;
            const message = slugDuplicate
                ? "이미 사용 중인 식별자입니다."
                : "같은 모드와 목표의 공개 서열표가 이미 있습니다.";
            const field = slugDuplicate ? "slug" : "status";
            return {
                success: false,
                message,
                fieldErrors: { [field]: [message] },
            };
        }

        const tierList = await db.tierList.create({
            data: { ...tierListData(input), updatedAt: new Date() },
        });
        revalidateTierList(tierList.id);
        return {
            success: true,
            message: "서열표를 생성했습니다.",
            id: tierList.id,
        };
    } catch (error) {
        logTierActionError(error, "admin.tier-list.create.failed");
        return { success: false, message: "서열표를 생성하지 못했습니다." };
    }
}

export async function updateTierList(
    formData: FormData
): Promise<TierListActionResult> {
    await requireAdmin();
    const result = tierListSaveSchema.safeParse(
        tierListSaveInputFromFormData(formData)
    );
    if (!result.success) return invalidTierListInput(result.error);
    const input = result.data;
    if (input.id === undefined) {
        return { success: false, message: "잘못된 서열표입니다." };
    }

    try {
        if (!(await isEditableTierList(input.id)))
            return { success: false, message: ARCHIVED_TIER_LIST.message };
        const duplicate = await db.tierList.findFirst({
            where: {
                NOT: { id: input.id },
                OR: [
                    { slug: input.slug },
                    ...(input.status === "published"
                        ? [
                              {
                                  mode: input.mode,
                                  goal: input.goal,
                                  status: "published" as const,
                              },
                          ]
                        : []),
                ],
            },
            select: { slug: true },
        });
        if (duplicate) {
            const slugDuplicate = duplicate.slug === input.slug;
            const message = slugDuplicate
                ? "이미 사용 중인 식별자입니다."
                : "같은 모드와 목표의 공개 서열표가 이미 있습니다.";
            const field = slugDuplicate ? "slug" : "status";
            return {
                success: false,
                message,
                fieldErrors: { [field]: [message] },
            };
        }

        await db.tierList.update({
            where: { id: input.id },
            data: tierListData(input),
        });
        revalidateTierList(input.id);
        return {
            success: true,
            message: "서열표 정보를 저장했습니다.",
            id: input.id,
        };
    } catch (error) {
        logTierActionError(error, "admin.tier-list.update.failed");
        return { success: false, message: "서열표를 저장하지 못했습니다." };
    }
}

export async function deleteTierList(
    formData: FormData
): Promise<TierMutationActionResult> {
    await requireAdmin();
    const result = tierListDeleteSchema.safeParse(
        tierIdInputFromFormData(formData)
    );
    if (!result.success) return invalidTierMutation(result.error);

    try {
        // 지우는 것은 보관 서열표만 — 화면에서 버튼을 숨긴 것과 같은 검사를 서버에서도 한다
        const list = await db.tierList.findUnique({
            where: { id: result.data.id },
            select: { id: true },
        });
        if (!list) return { success: false, message: "잘못된 서열표입니다." };
        if (await isEditableTierList(list.id))
            return {
                success: false,
                message: "지금 쓰는 서열표는 삭제할 수 없습니다.",
            };
        await db.tierList.delete({ where: { id: result.data.id } });
        revalidateTierListIndex();
        return { success: true, message: "보관 서열표를 삭제했습니다." };
    } catch (error) {
        logTierActionError(error, "admin.tier-list.delete.failed");
        return { success: false, message: "서열표를 삭제하지 못했습니다." };
    }
}
