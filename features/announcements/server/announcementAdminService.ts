import "server-only";

import { revalidatePath, updateTag } from "next/cache";

import {
    announcementDeleteInputFromFormData,
    announcementDeleteSchema,
    announcementFormInputFromFormData,
    announcementFormSchema,
    announcementUpdateInputFromFormData,
    announcementUpdateSchema,
    type AnnouncementFormValues,
} from "@/features/announcements/schemas/announcementSchema";
import type { ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";

type AnnouncementFieldName =
    Extract<keyof AnnouncementFormValues, string> | "id";
type AnnouncementActionResult = ActionResult<
    Record<never, never>,
    AnnouncementFieldName
>;

function refreshAnnouncements() {
    updateTag(CACHE_TAGS.announcements);
    revalidatePath("/");
    revalidatePath("/admin/announcements");
}

export async function createAnnouncement(
    formData: FormData
): Promise<AnnouncementActionResult> {
    await requireAdmin();
    const result = announcementFormSchema.safeParse(
        announcementFormInputFromFormData(formData)
    );
    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        return {
            success: false,
            message:
                fieldErrors.title?.[0] ??
                fieldErrors.content?.[0] ??
                "공지사항 입력을 확인해주세요.",
            fieldErrors,
        };
    }
    const input = result.data;

    try {
        await db.announcement.create({
            data: {
                ...input,
                publishedAt: input.isPublished ? new Date() : null,
            },
        });
    } catch (error) {
        logServerError(error, {
            event: "admin.announcement.create.failed",
            routePath: "/admin/announcements",
            routeType: "action",
        });
        return {
            success: false,
            message: "공지사항을 등록하지 못했습니다.",
        };
    }
    refreshAnnouncements();
    return { success: true, message: "공지사항을 등록했습니다." };
}

export async function updateAnnouncement(
    formData: FormData
): Promise<AnnouncementActionResult> {
    await requireAdmin();
    const result = announcementUpdateSchema.safeParse(
        announcementUpdateInputFromFormData(formData)
    );
    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        return {
            success: false,
            message:
                fieldErrors.id?.[0] ??
                fieldErrors.title?.[0] ??
                fieldErrors.content?.[0] ??
                "공지사항 입력을 확인해주세요.",
            fieldErrors,
        };
    }
    const { id, ...input } = result.data;

    try {
        const current = await db.announcement.findUnique({
            where: { id },
            select: { publishedAt: true },
        });
        if (!current) {
            return {
                success: false,
                message: "공지사항을 찾을 수 없습니다.",
            };
        }

        await db.announcement.update({
            where: { id },
            data: {
                ...input,
                publishedAt: input.isPublished
                    ? (current.publishedAt ?? new Date())
                    : null,
            },
        });
    } catch (error) {
        logServerError(error, {
            event: "admin.announcement.update.failed",
            routePath: "/admin/announcements",
            routeType: "action",
        });
        return {
            success: false,
            message: "공지사항을 저장하지 못했습니다.",
        };
    }
    refreshAnnouncements();
    return { success: true, message: "공지사항을 저장했습니다." };
}

export async function deleteAnnouncement(
    formData: FormData
): Promise<AnnouncementActionResult> {
    await requireAdmin();
    const result = announcementDeleteSchema.safeParse(
        announcementDeleteInputFromFormData(formData)
    );
    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        return {
            success: false,
            message: fieldErrors.id?.[0] ?? "잘못된 공지사항입니다.",
            fieldErrors,
        };
    }

    try {
        await db.announcement.delete({ where: { id: result.data.id } });
    } catch (error) {
        logServerError(error, {
            event: "admin.announcement.delete.failed",
            routePath: "/admin/announcements",
            routeType: "action",
        });
        return {
            success: false,
            message: "공지사항을 삭제하지 못했습니다.",
        };
    }
    refreshAnnouncements();
    return { success: true, message: "공지사항을 삭제했습니다." };
}
