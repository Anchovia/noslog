import "server-only";

import {
    musicTranslationApproveInputFromFormData,
    musicTranslationApproveSchema,
    type MusicTranslationFieldName,
    musicTranslationFormSchema,
    musicTranslationInputFromFormData,
} from "@/features/music/schemas/music-translation-admin-schema";
import {
    logMusicTranslationError,
    refreshMusicTranslations,
} from "@/features/music/server/music-translation-admin-shared";
import type { ActionResult } from "@/lib/actions/result";
import { actionValidationFailure } from "@/lib/actions/validation";
import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";

type MusicTranslationActionResult = ActionResult<
    Record<never, never>,
    MusicTranslationFieldName
>;
type MusicTranslationApproveResult = ActionResult;

export async function saveMusicTranslation(
    formData: FormData
): Promise<MusicTranslationActionResult> {
    await requireAdmin();
    const result = musicTranslationFormSchema.safeParse(
        musicTranslationInputFromFormData(formData)
    );
    if (!result.success)
        return actionValidationFailure(result.error, {
            message: "악곡 번역 입력을 확인해주세요.",
            preferFirstIssue: true,
            alwaysIncludeFieldErrors: true,
        });
    const input = result.data;

    try {
        if (!input.title) {
            await db.musicTranslation.deleteMany({
                where: {
                    musicIndex: input.musicIndex,
                    locale: input.locale,
                },
            });
        } else {
            const reviewedAt = input.status === "approved" ? new Date() : null;
            await db.musicTranslation.upsert({
                where: {
                    musicIndex_locale: {
                        musicIndex: input.musicIndex,
                        locale: input.locale,
                    },
                },
                create: {
                    musicIndex: input.musicIndex,
                    locale: input.locale,
                    title: input.title,
                    status: input.status,
                    reviewedAt,
                },
                update: {
                    title: input.title,
                    status: input.status,
                    reviewedAt,
                },
            });
        }
    } catch (error) {
        logMusicTranslationError(error, "admin.music.translation.save.failed");
        return {
            success: false,
            message: "악곡 번역을 저장하지 못했습니다.",
        };
    }

    refreshMusicTranslations(input.musicIndex);
    return {
        success: true,
        message: input.title
            ? "악곡 번역을 저장했습니다."
            : "악곡 번역을 삭제했습니다.",
    };
}

export async function approveMusicTranslation(
    formData: FormData
): Promise<MusicTranslationApproveResult> {
    await requireAdmin();
    const result = musicTranslationApproveSchema.safeParse(
        musicTranslationApproveInputFromFormData(formData)
    );
    if (!result.success) {
        return actionValidationFailure(result.error, {
            message: "승인할 악곡 번역을 확인해주세요.",
            preferFirstIssue: true,
            fieldPath: false,
        });
    }
    const input = result.data;

    try {
        const updated = await db.musicTranslation.updateMany({
            where: {
                musicIndex: input.musicIndex,
                locale: input.locale,
                status: "draft",
            },
            data: {
                status: "approved",
                reviewedAt: new Date(),
            },
        });
        if (updated.count === 0) {
            return {
                success: false,
                message: "승인할 초안 번역을 찾을 수 없습니다.",
            };
        }
    } catch (error) {
        logMusicTranslationError(
            error,
            "admin.music.translation.approve.failed"
        );
        return {
            success: false,
            message: "악곡 번역을 승인하지 못했습니다.",
        };
    }

    refreshMusicTranslations(input.musicIndex);
    return { success: true, message: "악곡 번역을 승인했습니다." };
}
