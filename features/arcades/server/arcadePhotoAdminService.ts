import "server-only";

import { z } from "zod";

import {
    ARCADE_PHOTO_ALT_MAX_LENGTH,
    ARCADE_PHOTO_MAX,
} from "@/features/arcades/schemas/arcadeSchema";
import { refreshArcades } from "@/features/arcades/server/arcadeAdminService";
import type { ActionResult } from "@/lib/actions/result";
import { actionValidationFailure } from "@/lib/actions/validation";
import { requireAdmin } from "@/lib/admin";
import {
    createImageUploadToken,
    deleteBlobIfOwned,
    isImageContentType,
    isValidImageBlob,
} from "@/lib/blob";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";
import {
    claimUploadTokenQuota,
    getUploadLimitMessage,
    releaseUploadTokenQuota,
} from "@/lib/uploadRateLimit";

const INVALID_IMAGE_MESSAGE = "JPG·PNG·WebP 이미지만 올릴 수 있습니다.";
const PHOTO_LIMIT_MESSAGE = `사진은 ${ARCADE_PHOTO_MAX}장까지 올릴 수 있습니다.`;

const idSchema = z.coerce.number().int().positive();

// 공개 Blob 저장소의 오락실별 경로 — 저장할 때 이 경로로 올린 파일인지 다시 확인한다
function photoPath(arcadeId: number) {
    return `arcades/${arcadeId}/photo`;
}

function isCalendarDate(value: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
    );
}

const savePhotoSchema = z.object({
    arcadeId: idSchema,
    url: z.string().trim().min(1, "올린 사진을 확인하지 못했습니다."),
    alt: z
        .string()
        .trim()
        .min(1, "사진 설명을 입력해주세요.")
        .max(
            ARCADE_PHOTO_ALT_MAX_LENGTH,
            `사진 설명은 ${ARCADE_PHOTO_ALT_MAX_LENGTH}자 이하로 입력해주세요.`
        ),
    // 촬영 날짜(선택) — 서울 기준 그날 0시로 적는다
    capturedAt: z
        .string()
        .trim()
        .refine(
            (value) => value === "" || isCalendarDate(value),
            "촬영 날짜를 확인해주세요."
        )
        .transform((value) =>
            value ? new Date(`${value}T00:00:00+09:00`) : null
        ),
    // 공개 사진은 촬영자의 게시 권리와 공개 동의가 있어야 한다(rightsConfirmedAt·publicConsentAt 은 필수 칸)
    consent: z.literal(true, {
        error: "촬영자의 게시 권리와 공개 동의를 확인해주세요.",
    }),
});

async function arcadeSlug(arcadeId: number) {
    const details = await db.arcadePublicDetails.findUnique({
        where: { arcadeId },
        select: { slug: true },
    });
    return details?.slug ?? String(arcadeId);
}

function logPhotoError(error: unknown, event: string) {
    logServerError(error, {
        event,
        routePath: "/admin/arcades",
        routeType: "action",
    });
}

// 사진 한 장 전용 공개 업로드 토큰 — 오락실마다 3장까지, 관리자도 시간당 업로드 제한을 따른다
export async function requestArcadePhotoUpload(
    arcadeIdInput: unknown,
    contentType: string
): Promise<ActionResult<{ pathname: string; token: string }>> {
    const admin = await requireAdmin();
    const arcadeId = idSchema.safeParse(arcadeIdInput);
    if (!arcadeId.success)
        return { success: false, message: "잘못된 오락실입니다." };
    if (!isImageContentType(contentType))
        return { success: false, message: INVALID_IMAGE_MESSAGE };

    let grantId: number | null = null;
    try {
        const count = await db.arcadePublicPhoto.count({
            where: { arcadeId: arcadeId.data },
        });
        if (count >= ARCADE_PHOTO_MAX)
            return { success: false, message: PHOTO_LIMIT_MESSAGE };

        const quota = await claimUploadTokenQuota(admin.id, "arcade-photo");
        if (!quota.allowed)
            return { success: false, message: getUploadLimitMessage() };
        grantId = quota.grantId;

        const upload = await createImageUploadToken(
            photoPath(arcadeId.data),
            contentType
        );
        if (!upload) {
            await releaseUploadTokenQuota(admin.id, grantId).catch(() => null);
            return { success: false, message: INVALID_IMAGE_MESSAGE };
        }
        return { success: true, message: "", ...upload };
    } catch (error) {
        logPhotoError(error, "admin.arcade.photo-upload.request.failed");
        if (grantId !== null)
            await releaseUploadTokenQuota(admin.id, grantId).catch(() => null);
        return {
            success: false,
            message: "사진을 올릴 준비를 하지 못했습니다.",
        };
    }
}

// 올린 파일을 확인하고 맨 뒤 자리에 붙인다. 저장하지 못하면 올린 파일도 지운다
export async function saveArcadePhoto(
    formData: FormData
): Promise<ActionResult> {
    await requireAdmin();
    const parsed = savePhotoSchema.safeParse({
        arcadeId: formData.get("arcadeId"),
        url: String(formData.get("url") ?? ""),
        alt: String(formData.get("alt") ?? ""),
        capturedAt: String(formData.get("capturedAt") ?? ""),
        consent: formData.get("consent") === "true",
    });
    if (!parsed.success)
        return actionValidationFailure(parsed.error, {
            message: "사진 정보를 확인해주세요.",
            preferFirstIssue: true,
            fieldPath: false,
        });
    const { arcadeId, url, alt, capturedAt } = parsed.data;

    // 이 오락실 경로로 올린 공개 이미지인지 저장소에서 다시 확인한다 — 아니면 아무것도 지우지 않는다
    if (!(await isValidImageBlob(url, photoPath(arcadeId))))
        return {
            success: false,
            message: "올린 사진을 확인하지 못했습니다. 다시 올려주세요.",
        };

    let slug: string;
    try {
        const now = new Date();
        const saved = await db.$transaction(async (tx) => {
            const count = await tx.arcadePublicPhoto.count({
                where: { arcadeId },
            });
            if (count >= ARCADE_PHOTO_MAX) return false;
            // 지울 때 자리를 당겨 두므로 0…count-1 이 차 있고 다음 자리는 count 다
            await tx.arcadePublicPhoto.create({
                data: {
                    arcadeId,
                    slot: count,
                    url,
                    alt,
                    capturedAt,
                    rightsConfirmedAt: now,
                    publicConsentAt: now,
                },
            });
            return true;
        });
        if (!saved) {
            await deleteBlobIfOwned(url);
            return { success: false, message: PHOTO_LIMIT_MESSAGE };
        }
        slug = await arcadeSlug(arcadeId);
    } catch (error) {
        logPhotoError(error, "admin.arcade.photo-save.failed");
        await deleteBlobIfOwned(url);
        return { success: false, message: "사진을 저장하지 못했습니다." };
    }

    refreshArcades(false, slug);
    return { success: true, message: "사진을 올렸습니다." };
}

// 사진을 지우고 뒤 사진들을 한 칸씩 당긴다(대표 사진을 지우면 다음 사진이 대표)
export async function deleteArcadePhoto(
    formData: FormData
): Promise<ActionResult> {
    await requireAdmin();
    const photoId = idSchema.safeParse(formData.get("photoId"));
    if (!photoId.success)
        return { success: false, message: "잘못된 사진입니다." };

    let removed: { arcadeId: number; url: string };
    try {
        const photo = await db.arcadePublicPhoto.findUnique({
            where: { id: photoId.data },
            select: { arcadeId: true, url: true },
        });
        if (!photo)
            return { success: false, message: "사진을 찾을 수 없습니다." };
        removed = photo;
        await db.$transaction(async (tx) => {
            await tx.arcadePublicPhoto.delete({ where: { id: photoId.data } });
            const rest = await tx.arcadePublicPhoto.findMany({
                where: { arcadeId: photo.arcadeId },
                orderBy: { slot: "asc" },
                select: { id: true, slot: true },
            });
            // 앞에서부터 옮기면 옮겨 갈 자리가 늘 비어 있다(자리 유일성)
            for (const [index, item] of rest.entries()) {
                if (item.slot !== index)
                    await tx.arcadePublicPhoto.update({
                        where: { id: item.id },
                        data: { slot: index },
                    });
            }
        });
    } catch (error) {
        logPhotoError(error, "admin.arcade.photo-delete.failed");
        return { success: false, message: "사진을 지우지 못했습니다." };
    }

    await deleteBlobIfOwned(removed.url);
    refreshArcades(false, await arcadeSlug(removed.arcadeId));
    return { success: true, message: "사진을 지웠습니다." };
}

// 고른 사진을 맨 앞(대표)으로 — 나머지 사진의 순서는 그대로 한 칸씩 뒤로
export async function setArcadeMainPhoto(
    formData: FormData
): Promise<ActionResult> {
    await requireAdmin();
    const photoId = idSchema.safeParse(formData.get("photoId"));
    if (!photoId.success)
        return { success: false, message: "잘못된 사진입니다." };

    let arcadeId: number;
    try {
        const photo = await db.arcadePublicPhoto.findUnique({
            where: { id: photoId.data },
            select: { arcadeId: true, slot: true },
        });
        if (!photo)
            return { success: false, message: "사진을 찾을 수 없습니다." };
        arcadeId = photo.arcadeId;
        if (photo.slot === 0)
            return { success: true, message: "이미 대표 사진입니다." };
        await db.$transaction(async (tx) => {
            // 자리 유일성 때문에 고른 사진을 잠시 비워 두고, 앞 사진들을 뒤에서부터 한 칸씩 민다
            await tx.arcadePublicPhoto.update({
                where: { id: photoId.data },
                data: { slot: -1 },
            });
            const before = await tx.arcadePublicPhoto.findMany({
                where: {
                    arcadeId: photo.arcadeId,
                    slot: { gte: 0, lt: photo.slot },
                },
                orderBy: { slot: "desc" },
                select: { id: true, slot: true },
            });
            for (const item of before)
                await tx.arcadePublicPhoto.update({
                    where: { id: item.id },
                    data: { slot: item.slot + 1 },
                });
            await tx.arcadePublicPhoto.update({
                where: { id: photoId.data },
                data: { slot: 0 },
            });
        });
    } catch (error) {
        logPhotoError(error, "admin.arcade.photo-main.failed");
        return { success: false, message: "대표 사진을 바꾸지 못했습니다." };
    }

    refreshArcades(false, await arcadeSlug(arcadeId));
    return { success: true, message: "대표 사진을 바꿨습니다." };
}
