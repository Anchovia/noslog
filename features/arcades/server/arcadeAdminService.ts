import "server-only";

import { revalidatePath, updateTag } from "next/cache";
import { Prisma } from "@prisma/client";

import {
    arcadeFormInputFromFormData,
    arcadeFormSchema,
    arcadeUpdateInputFromFormData,
    arcadeUpdateSchema,
    type ArcadeFormValues,
    type ArcadeValues,
} from "@/features/arcades/schemas/arcadeSchema";
import type { ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";

type ArcadeFieldName = Extract<keyof ArcadeFormValues, string> | "id";
type ArcadeActionResult = ActionResult<Record<never, never>, ArcadeFieldName>;

function arcadeData(input: ArcadeValues) {
    return {
        name: input.name,
        region: input.region,
        address: input.address,
        latitude: input.latitude,
        longitude: input.longitude,
        machine_count: input.machineCount,
        play_price: input.playPrice,
        coin_count: input.coinCount,
        business_hours:
            input.businessHours === null
                ? Prisma.DbNull
                : (input.businessHours as Prisma.InputJsonValue),
        machine_status: input.machineStatus,
        status_note: input.statusNote,
        notes: input.notes,
    };
}

function validationFailure(
    fieldErrors: Partial<Record<ArcadeFieldName, string[] | undefined>>
): ArcadeActionResult {
    return {
        success: false,
        message:
            fieldErrors.id?.[0] ??
            fieldErrors.name?.[0] ??
            fieldErrors.region?.[0] ??
            fieldErrors.address?.[0] ??
            fieldErrors.latitude?.[0] ??
            fieldErrors.longitude?.[0] ??
            fieldErrors.machineCount?.[0] ??
            fieldErrors.playPrice?.[0] ??
            fieldErrors.coinCount?.[0] ??
            fieldErrors.businessHours?.[0] ??
            fieldErrors.machineStatus?.[0] ??
            fieldErrors.statusNote?.[0] ??
            fieldErrors.notes?.[0] ??
            "입력 내용을 확인해주세요.",
        fieldErrors,
    };
}

function refreshArcades(includeProfiles: boolean) {
    updateTag(CACHE_TAGS.arcades);
    if (includeProfiles) updateTag(CACHE_TAGS.userProfiles);
    revalidatePath("/admin/arcades");
    revalidatePath("/gamecenter");
}

export async function createArcade(
    formData: FormData
): Promise<ArcadeActionResult> {
    await requireAdmin();
    const result = arcadeFormSchema.safeParse(
        arcadeFormInputFromFormData(formData)
    );
    if (!result.success) {
        return validationFailure(result.error.flatten().fieldErrors);
    }

    try {
        await db.arcade.create({ data: arcadeData(result.data) });
    } catch (error) {
        logServerError(error, {
            event: "admin.arcade.create.failed",
            routePath: "/admin/arcades",
            routeType: "action",
        });
        return {
            success: false,
            message: "오락실을 추가하지 못했습니다.",
        };
    }

    refreshArcades(false);
    return { success: true, message: "오락실을 추가했습니다." };
}

export async function updateArcade(
    formData: FormData
): Promise<ArcadeActionResult> {
    await requireAdmin();
    const result = arcadeUpdateSchema.safeParse(
        arcadeUpdateInputFromFormData(formData)
    );
    if (!result.success) {
        return validationFailure(result.error.flatten().fieldErrors);
    }
    const { id, isActive, ...input } = result.data;

    try {
        await db.arcade.update({
            where: { id },
            data: {
                ...arcadeData({ ...input, isActive }),
                is_active: isActive,
            },
        });
    } catch (error) {
        logServerError(error, {
            event: "admin.arcade.update.failed",
            routePath: "/admin/arcades",
            routeType: "action",
        });
        return {
            success: false,
            message: "오락실 정보를 저장하지 못했습니다.",
        };
    }

    refreshArcades(true);
    return { success: true, message: "오락실 정보를 저장했습니다." };
}
