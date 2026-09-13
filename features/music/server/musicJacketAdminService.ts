import "server-only";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import { JACKET_INDEX_PATTERN } from "@/features/music/server/jacketCollectionService";
import type { ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/admin";
import {
    createImageUploadToken,
    deleteBlobIfOwned,
    isImageContentType,
    isValidImageBlob,
} from "@/lib/blob";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { MANUAL_JACKET_PREFIX, isManualJacketUrl } from "@/lib/musicJackets";
import { logServerError } from "@/lib/observability/server";
import {
    claimUploadTokenQuota,
    getUploadLimitMessage,
    releaseUploadTokenQuota,
} from "@/lib/uploadRateLimit";

const INVALID_IMAGE_MESSAGE = "JPG·PNG·WebP 이미지만 올릴 수 있습니다.";
const NOT_FOUND_MESSAGE = "악곡을 찾을 수 없습니다.";

const indexSchema = z.string().trim().regex(JACKET_INDEX_PATTERN);

// 곡마다 따로 둔 공개 Blob 폴더 — 저장할 때 이 곡 폴더로 올린 파일인지 다시 확인한다
function jacketFolder(index: string) {
    return `${MANUAL_JACKET_PREFIX}${index}/`;
}

// 자켓은 목록·상세·서열표·빙고·검정·프로필 캐시에 함께 실린다
function refreshJacket(index: string) {
    for (const tag of [
        CACHE_TAGS.musicCatalog,
        CACHE_TAGS.musicDetails,
        CACHE_TAGS.tierLists,
        CACHE_TAGS.bingos,
        CACHE_TAGS.exams,
        CACHE_TAGS.userProfiles,
    ])
        updateTag(tag);
    revalidatePath("/admin/music");
    revalidatePath(`/admin/music/${encodeURIComponent(index)}`);
}

function logJacketError(error: unknown, event: string, index: string) {
    logServerError(error, {
        event,
        routePath: `/admin/music/${encodeURIComponent(index)}`,
        routeType: "action",
    });
}

// 자켓 한 장 전용 공개 업로드 토큰 — 관리자도 시간당 업로드 제한을 따른다
export async function requestMusicJacketUpload(
    musicIndexInput: unknown,
    contentType: string
): Promise<ActionResult<{ pathname: string; token: string }>> {
    const admin = await requireAdmin();
    const index = indexSchema.safeParse(musicIndexInput);
    if (!index.success) return { success: false, message: NOT_FOUND_MESSAGE };
    if (!isImageContentType(contentType))
        return { success: false, message: INVALID_IMAGE_MESSAGE };

    let grantId: number | null = null;
    try {
        const music = await db.music.findUnique({
            where: { index: index.data },
            select: { index: true },
        });
        if (!music) return { success: false, message: NOT_FOUND_MESSAGE };

        const quota = await claimUploadTokenQuota(admin.id, "music-jacket");
        if (!quota.allowed)
            return { success: false, message: getUploadLimitMessage() };
        grantId = quota.grantId;

        const upload = await createImageUploadToken(
            `${jacketFolder(index.data)}jacket`,
            contentType
        );
        if (!upload) {
            await releaseUploadTokenQuota(admin.id, grantId).catch(() => null);
            return { success: false, message: INVALID_IMAGE_MESSAGE };
        }
        return { success: true, message: "", ...upload };
    } catch (error) {
        logJacketError(
            error,
            "admin.music.jacket-upload.request.failed",
            index.data
        );
        if (grantId !== null)
            await releaseUploadTokenQuota(admin.id, grantId).catch(() => null);
        return {
            success: false,
            message: "자켓을 올릴 준비를 하지 못했습니다.",
        };
    }
}

// 올린 파일을 확인하고 자켓으로 기록한다. 이전에 올리거나 수집한 파일은 지우고, 저장하지 못하면 올린 파일을 지운다
export async function saveMusicJacket(
    formData: FormData
): Promise<ActionResult> {
    await requireAdmin();
    const index = indexSchema.safeParse(formData.get("musicIndex"));
    if (!index.success) return { success: false, message: NOT_FOUND_MESSAGE };
    const url = String(formData.get("url") ?? "").trim();

    // 이 곡 폴더로 올린 공개 이미지인지 저장소에서 다시 확인한다 — 아니면 아무것도 지우지 않는다
    if (!(await isValidImageBlob(url, jacketFolder(index.data))))
        return {
            success: false,
            message: "올린 자켓을 확인하지 못했습니다. 다시 올려주세요.",
        };

    let previous: string | null;
    try {
        const music = await db.music.findUnique({
            where: { index: index.data },
            select: { background: true },
        });
        if (!music) {
            await deleteBlobIfOwned(url);
            return { success: false, message: NOT_FOUND_MESSAGE };
        }
        previous = music.background;
        await db.music.update({
            where: { index: index.data },
            data: { background: url },
        });
    } catch (error) {
        logJacketError(error, "admin.music.jacket-save.failed", index.data);
        await deleteBlobIfOwned(url);
        return { success: false, message: "자켓을 저장하지 못했습니다." };
    }

    // 로컬 주소(/bg)·외부 주소는 Blob 이 아니라 지우지 않는다
    if (previous && previous !== url) await deleteBlobIfOwned(previous);
    refreshJacket(index.data);
    return { success: true, message: "자켓을 바꿨습니다." };
}

// 직접 올린 자켓을 지우고 기본(로컬 파일, 없으면 다음 관리자 동기화 때 수집) 자켓으로 돌아간다
export async function resetMusicJacket(
    formData: FormData
): Promise<ActionResult> {
    await requireAdmin();
    const index = indexSchema.safeParse(formData.get("musicIndex"));
    if (!index.success) return { success: false, message: NOT_FOUND_MESSAGE };

    let removed: string;
    try {
        const music = await db.music.findUnique({
            where: { index: index.data },
            select: { background: true },
        });
        if (!music) return { success: false, message: NOT_FOUND_MESSAGE };
        if (!music.background || !isManualJacketUrl(music.background))
            return { success: true, message: "이미 기본 자켓입니다." };
        removed = music.background;
        await db.music.updateMany({
            where: { index: index.data, background: removed },
            data: { background: null },
        });
    } catch (error) {
        logJacketError(error, "admin.music.jacket-reset.failed", index.data);
        return { success: false, message: "자켓을 되돌리지 못했습니다." };
    }

    await deleteBlobIfOwned(removed);
    refreshJacket(index.data);
    return { success: true, message: "기본 자켓으로 되돌렸습니다." };
}
