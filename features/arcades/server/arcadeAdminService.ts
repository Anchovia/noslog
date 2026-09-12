import "server-only";

import { revalidatePath, updateTag } from "next/cache";
import { Prisma } from "@prisma/client";

import { arcadeHoursSchema } from "@/features/arcades/schemas/publicArcadeSchema";
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
import {
    ARCADE_WEEKDAYS,
    readPublicArcadeWeekly,
    toPublicArcadeWeekly,
    type PublicArcadeWeekly,
} from "@/lib/arcadeDetails";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { localizePath, SUPPORTED_LOCALES } from "@/lib/i18n/routing";
import { logServerError } from "@/lib/observability/server";

type ArcadeFieldName = Extract<keyof ArcadeFormValues, string> | "id";
type ArcadeActionResult = ActionResult<Record<never, never>, ArcadeFieldName>;

// 공개 정보가 없던 오락실에 처음 쓸 때의 기본값 — 공개 페이지가 쓰는 대체값과 같다
const PUBLIC_DETAILS_DEFAULTS = {
    countryCode: "KR",
    timeZone: "Asia/Seoul",
    currencyCode: "KRW",
} as const;

const CABINET_MISMATCH_MESSAGE =
    "기체 목록이 바뀌었습니다. 새로고침한 뒤 다시 저장해주세요.";

class CabinetMismatchError extends Error {}

function arcadeData(input: ArcadeValues) {
    return {
        name: input.name,
        region: input.region,
        address: input.address,
        latitude: input.latitude,
        longitude: input.longitude,
        // 기체 수는 기체 목록에서 센다(옛 칸을 쓰는 곳을 위해 계속 채운다)
        machine_count: input.cabinets.length || null,
        play_price: input.playPrice,
        coin_count: input.coinCount,
        business_hours:
            input.businessHours === null
                ? Prisma.DbNull
                : (input.businessHours as Prisma.InputJsonValue),
        notes: input.notes,
    };
}

function weeklyKey(weekly: PublicArcadeWeekly | null) {
    return JSON.stringify(
        ARCADE_WEEKDAYS.map((_, index) => {
            const day = weekly?.[String(index)];
            return day === undefined ? "unknown" : day;
        })
    );
}

// 기체·영업시간을 공개 페이지가 읽는 표에 쓴다. 바꿨거나 「오늘 확인」 한 항목만 확인 시각을 지금으로 남긴다
async function syncPublicFacts(
    tx: Prisma.TransactionClient,
    arcadeId: number,
    input: ArcadeValues,
    now: Date
) {
    const existing = await tx.arcadeCabinet.findMany({ where: { arcadeId } });
    const byId = new Map(existing.map((cabinet) => [cabinet.id, cabinet]));
    let nextPosition = existing.reduce(
        (max, cabinet) => Math.max(max, cabinet.position + 1),
        0
    );
    const kept = new Set<number>();
    let cabinetVerified = false;

    for (const cabinet of input.cabinets) {
        const current =
            cabinet.cabinetId === null
                ? undefined
                : byId.get(cabinet.cabinetId);
        if (cabinet.cabinetId !== null && !current)
            throw new CabinetMismatchError();
        const values = {
            label: cabinet.label,
            note: cabinet.note,
            availability: cabinet.availability,
            condition: cabinet.condition,
        };
        const changed =
            !current ||
            !current.isActive ||
            current.label !== cabinet.label ||
            current.note !== cabinet.note ||
            current.availability !== cabinet.availability ||
            current.condition !== cabinet.condition;
        // 미확인은 확인한 사실이 없으므로 확인 시각을 비운다
        const verify =
            cabinet.availability !== "unknown" && (changed || cabinet.confirm);
        const clear = cabinet.availability === "unknown" && changed;
        const verification = verify
            ? { verifiedAt: now, verificationSource: "admin" }
            : clear
              ? { verifiedAt: null, verificationSource: null }
              : {};
        if (verify) cabinetVerified = true;

        if (current) {
            kept.add(current.id);
            await tx.arcadeCabinet.update({
                where: { id: current.id },
                data: { ...values, isActive: true, ...verification },
            });
        } else {
            await tx.arcadeCabinet.create({
                data: {
                    arcadeId,
                    position: nextPosition++,
                    ...values,
                    ...verification,
                },
            });
        }
    }

    // 목록에서 뺀 기체는 지우지 않고 숨긴다 — 확인·신고 기록과 번호를 보존한다
    const removed = existing
        .filter((cabinet) => cabinet.isActive && !kept.has(cabinet.id))
        .map((cabinet) => cabinet.id);
    if (removed.length > 0) {
        await tx.arcadeCabinet.updateMany({
            where: { id: { in: removed } },
            data: { isActive: false },
        });
    }

    const details = await tx.arcadePublicDetails.findUnique({
        where: { arcadeId },
        select: { slug: true, hours: true },
    });
    const weekly = input.businessHours
        ? toPublicArcadeWeekly(input.businessHours.weekly)
        : null;
    const hoursChanged =
        weeklyKey(weekly) !== weeklyKey(readPublicArcadeWeekly(details?.hours));
    const writeHours =
        hoursChanged || (weekly !== null && input.hoursConfirmed);

    if (writeHours || cabinetVerified) {
        const currentHours = arcadeHoursSchema.safeParse(details?.hours);
        const data = {
            ...(writeHours
                ? {
                      hours:
                          weekly === null
                              ? Prisma.DbNull
                              : ({
                                    weekly,
                                    // 날짜별 예외는 이 화면에서 편집하지 않으므로 그대로 둔다
                                    exceptions: currentHours.success
                                        ? currentHours.data.exceptions
                                        : {},
                                } as Prisma.InputJsonValue),
                      hoursVerifiedAt: weekly === null ? null : now,
                  }
                : {}),
            ...(cabinetVerified ? { cabinetVerifiedAt: now } : {}),
        };
        await tx.arcadePublicDetails.upsert({
            where: { arcadeId },
            create: {
                arcadeId,
                slug: String(arcadeId),
                ...PUBLIC_DETAILS_DEFAULTS,
                ...data,
            },
            update: data,
        });
    }

    return details?.slug ?? String(arcadeId);
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
            fieldErrors.playPrice?.[0] ??
            fieldErrors.coinCount?.[0] ??
            fieldErrors.businessHours?.[0] ??
            fieldErrors.cabinets?.[0] ??
            fieldErrors.notes?.[0] ??
            "입력 내용을 확인해주세요.",
        fieldErrors,
    };
}

function cabinetMismatch(): ArcadeActionResult {
    return {
        success: false,
        message: CABINET_MISMATCH_MESSAGE,
        fieldErrors: { cabinets: [CABINET_MISMATCH_MESSAGE] },
    };
}

function refreshArcades(includeProfiles: boolean, slug: string) {
    updateTag(CACHE_TAGS.arcades);
    if (includeProfiles) updateTag(CACHE_TAGS.userProfiles);
    revalidatePath("/admin/arcades");
    for (const path of ["/gamecenter", `/gamecenter/${slug}`]) {
        revalidatePath(path);
        for (const locale of SUPPORTED_LOCALES)
            revalidatePath(localizePath(path, locale));
    }
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

    let slug: string;
    try {
        const now = new Date();
        slug = await db.$transaction(async (tx) => {
            const arcade = await tx.arcade.create({
                data: arcadeData(result.data),
                select: { id: true },
            });
            return syncPublicFacts(tx, arcade.id, result.data, now);
        });
    } catch (error) {
        if (error instanceof CabinetMismatchError) return cabinetMismatch();
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

    refreshArcades(false, slug);
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
    const { id, ...input } = result.data;

    let slug: string;
    try {
        const now = new Date();
        slug = await db.$transaction(async (tx) => {
            await tx.arcade.update({
                where: { id },
                data: { ...arcadeData(input), is_active: input.isActive },
            });
            return syncPublicFacts(tx, id, input, now);
        });
    } catch (error) {
        if (error instanceof CabinetMismatchError) return cabinetMismatch();
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

    refreshArcades(true, slug);
    return { success: true, message: "오락실 정보를 저장했습니다." };
}
