import "server-only";

import { Prisma } from "@prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import type { ZodError } from "zod";

import {
    ANNOUNCEMENT_LOCALES,
    announcementDeleteInputFromFormData,
    announcementDeleteSchema,
    announcementFormInputFromFormData,
    announcementFormSchema,
    announcementUpdateInputFromFormData,
    announcementUpdateSchema,
    type AnnouncementValues,
} from "@/features/announcements/schemas/announcementSchema";
import type { ActionResult } from "@/lib/actions/result";
import { actionValidationFailure } from "@/lib/actions/validation";
import { requireAdmin } from "@/lib/admin";
import { createImageUploadToken, isImageContentType } from "@/lib/blob";
import {
    claimUploadTokenQuota,
    getUploadLimitMessage,
    releaseUploadTokenQuota,
} from "@/lib/uploadRateLimit";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import {
    savePollWithPost,
    type PollSaveError,
} from "@/features/polls/server/pollService";
import { logServerError } from "@/lib/observability/server";

type AnnouncementLocale = (typeof ANNOUNCEMENT_LOCALES)[number];
type AnnouncementFieldName =
    | "id"
    | "publicSlug"
    | "placement"
    | "category"
    | "priority"
    | "activeFrom"
    | "expiresAt"
    | "isPublished"
    | `translations.${AnnouncementLocale}.title`
    | `translations.${AnnouncementLocale}.content`;
export type AnnouncementActionResult = ActionResult<
    { id: number },
    AnnouncementFieldName
>;
type AnnouncementFailure = Extract<
    AnnouncementActionResult,
    { success: false }
>;

function invalidAnnouncementInput(error: ZodError): AnnouncementFailure {
    return actionValidationFailure<AnnouncementFieldName>(error, {
        message: "공지사항 입력을 확인해주세요.",
        preferFirstIssue: true,
        fieldPath: "full",
        alwaysIncludeFieldErrors: true,
    });
}

function refreshAnnouncements() {
    updateTag(CACHE_TAGS.announcements);
    revalidatePath("/");
    revalidatePath("/announcements");
    revalidatePath("/admin/announcements");
}

function slugConflict(error: unknown): AnnouncementFailure | null {
    if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
    ) {
        const message = "이미 사용 중인 공개 주소입니다.";
        return {
            success: false,
            message,
            fieldErrors: { publicSlug: [message] },
        };
    }
    return null;
}

// 공개 자격(publishedAt <= activeFrom)을 지키도록 중대 공지의 노출 시작을 공개 시각 이후로 맞춤.
// 일반 공지는 일정·우선순위를 쓰지 않으므로 비움
function resolveSchedule(input: AnnouncementValues, publishedAt: Date | null) {
    if (input.placement !== "SERVICE_CRITICAL") {
        return { activeFrom: null, expiresAt: null, priority: 0 };
    }
    const activeFrom =
        publishedAt && input.activeFrom && input.activeFrom < publishedAt
            ? publishedAt
            : input.activeFrom;
    const expiresAt =
        activeFrom && input.expiresAt && input.expiresAt <= activeFrom
            ? null
            : input.expiresAt;
    return { activeFrom, expiresAt, priority: input.priority };
}

function translationRows(input: AnnouncementValues) {
    return ANNOUNCEMENT_LOCALES.map((locale) => ({
        locale,
        title: input.translations[locale].title,
        content: input.translations[locale].content,
    }));
}

// 투표 저장이 막힌 이유를 관리자 화면 문구로 (2026-09-23 V2)
class PollSaveAbort extends Error {
    constructor(readonly reason: PollSaveError) {
        super(reason);
    }
}

const POLL_SAVE_MESSAGES: Record<PollSaveError, string> = {
    invalid: "투표 내용을 다시 확인해주세요.",
    locked: "표가 들어온 뒤에는 질문과 선택지를 바꿀 수 없습니다.",
    closed: "마감한 투표는 고칠 수 없습니다.",
    question: "투표 질문을 입력해주세요.",
    options: "선택지를 2개 이상 20개 이하로 입력해주세요.",
    duplicate: "같은 선택지를 두 번 넣을 수 없습니다.",
    maxChoices: "고를 수 있는 최대 개수를 다시 확인해주세요.",
    closesAt: "마감은 지금보다 뒤여야 합니다.",
};

export async function createAnnouncement(
    formData: FormData
): Promise<AnnouncementActionResult> {
    await requireAdmin();
    const result = announcementFormSchema.safeParse(
        announcementFormInputFromFormData(formData)
    );
    if (!result.success) return invalidAnnouncementInput(result.error);
    const input = result.data;
    const publishedAt = input.isPublished ? new Date() : null;

    try {
        const created = await db.$transaction(async (tx) => {
            const row = await tx.announcement.create({
                data: {
                    title: input.translations.ko.title,
                    content: input.translations.ko.content,
                    publicSlug: input.publicSlug,
                    placement: input.placement,
                    category: input.category,
                    isPublished: input.isPublished,
                    publishedAt,
                    ...resolveSchedule(input, publishedAt),
                    translations: { create: translationRows(input) },
                },
                select: { id: true },
            });
            const failed = await savePollWithPost(
                tx,
                { announcementId: row.id },
                input.poll ?? null
            );
            if (failed) throw new PollSaveAbort(failed);
            return row;
        });
        refreshAnnouncements();
        return {
            success: true,
            message: "공지사항을 등록했습니다.",
            id: created.id,
        };
    } catch (error) {
        if (error instanceof PollSaveAbort)
            return {
                success: false,
                message: POLL_SAVE_MESSAGES[error.reason],
            };
        const conflict = slugConflict(error);
        if (conflict) return conflict;
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
}

export async function updateAnnouncement(
    formData: FormData
): Promise<AnnouncementActionResult> {
    await requireAdmin();
    const result = announcementUpdateSchema.safeParse(
        announcementUpdateInputFromFormData(formData)
    );
    if (!result.success) return invalidAnnouncementInput(result.error);
    const { id, ...input } = result.data;

    try {
        const current = await db.announcement.findUnique({
            where: { id },
            select: {
                publishedAt: true,
                translations: {
                    select: { locale: true, title: true, content: true },
                },
            },
        });
        if (!current) {
            return {
                success: false,
                message: "공지사항을 찾을 수 없습니다.",
            };
        }
        const publishedAt = input.isPublished
            ? (current.publishedAt ?? new Date())
            : null;
        const now = new Date();

        await db.$transaction(async (tx) => {
            await tx.announcement.update({
                where: { id },
                data: {
                    title: input.translations.ko.title,
                    content: input.translations.ko.content,
                    publicSlug: input.publicSlug,
                    placement: input.placement,
                    category: input.category,
                    isPublished: input.isPublished,
                    publishedAt,
                    ...resolveSchedule(input, publishedAt),
                    translations: {
                        upsert: translationRows(input).map((row) => {
                            const previous = current.translations.find(
                                (item) => item.locale === row.locale
                            );
                            const changed =
                                !previous ||
                                previous.title !== row.title ||
                                previous.content !== row.content;
                            return {
                                where: {
                                    announcementId_locale: {
                                        announcementId: id,
                                        locale: row.locale,
                                    },
                                },
                                create: row,
                                // 내용이 바뀐 번역만 수정 시각을 남김
                                update: changed
                                    ? {
                                          title: row.title,
                                          content: row.content,
                                          modifiedAt: now,
                                      }
                                    : {},
                            };
                        }),
                    },
                },
                select: { id: true },
            });
            // 글과 투표를 한 번에 — 투표가 막히면 글 저장도 되돌린다(2026-09-23 V2)
            const failed = await savePollWithPost(
                tx,
                { announcementId: id },
                input.poll ?? null
            );
            if (failed) throw new PollSaveAbort(failed);
        });
        refreshAnnouncements();
        return { success: true, message: "공지사항을 저장했습니다.", id };
    } catch (error) {
        if (error instanceof PollSaveAbort)
            return {
                success: false,
                message: POLL_SAVE_MESSAGES[error.reason],
            };
        const conflict = slugConflict(error);
        if (conflict) return conflict;
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
}

export async function deleteAnnouncement(
    formData: FormData
): Promise<AnnouncementActionResult> {
    await requireAdmin();
    const result = announcementDeleteSchema.safeParse(
        announcementDeleteInputFromFormData(formData)
    );
    if (!result.success) return invalidAnnouncementInput(result.error);
    const { id } = result.data;

    try {
        await db.announcement.delete({ where: { id } });
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
    return { success: true, message: "공지사항을 삭제했습니다.", id };
}

// 본문 이미지 올리기(2026-09-18) — 관리자만. 공개 저장소 announcements/{관리자}/image 아래 한 장 전용 토큰
export async function requestAnnouncementImageUpload(
    contentType: string
): Promise<ActionResult<{ pathname: string; token: string }>> {
    const admin = await requireAdmin();
    if (!isImageContentType(contentType))
        return {
            success: false,
            message: "JPG · PNG · WebP 이미지만 올릴 수 있습니다.",
        };
    let grantId: number | null = null;
    try {
        const quota = await claimUploadTokenQuota(
            admin.id,
            "announcement-image"
        );
        if (!quota.allowed)
            return { success: false, message: getUploadLimitMessage() };
        grantId = quota.grantId;
        const upload = await createImageUploadToken(
            `announcements/${admin.id}/image`,
            contentType
        );
        if (!upload) throw new Error("invalid image type");
        return { success: true, message: "", ...upload };
    } catch (error) {
        logServerError(error, {
            event: "announcements.image-upload.request.failed",
            routePath: "/admin/announcements",
            routeType: "action",
        });
        if (grantId !== null)
            await releaseUploadTokenQuota(admin.id, grantId).catch(() => null);
        return { success: false, message: "이미지를 올리지 못했습니다." };
    }
}
