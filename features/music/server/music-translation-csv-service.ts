import "server-only";

import {
    type MusicTranslationExportRow,
    parseMusicTranslationCsv,
    serializeMusicTranslationCsv,
} from "@/features/music/csv/music-translation-csv";
import {
    MUSIC_TRANSLATION_LOCALES,
    musicTranslationCsvTextSchema,
    normalizeMusicTranslationLocale,
    normalizeMusicTranslationStatus,
} from "@/features/music/schemas/music-translation-admin-schema";
import {
    logMusicTranslationError,
    refreshMusicTranslations,
} from "@/features/music/server/music-translation-admin-shared";
import type { MusicTranslationCsvPreview } from "@/features/music/types/music-admin";
import type { ActionResult } from "@/lib/actions/result";
import { actionValidationFailure } from "@/lib/actions/validation";
import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";

type MusicTranslationCsvValidationResult = ActionResult<
    {
        previews: MusicTranslationCsvPreview[];
        totalCount: number;
    },
    "csv"
>;
type MusicTranslationCsvImportResult = ActionResult<{ count: number }, "csv">;

async function validateTranslationCsvContent(csv: string) {
    const parsed = parseMusicTranslationCsv(csv);
    if (parsed.errors.length > 0) {
        return {
            rows: parsed.rows,
            errors: parsed.errors,
            previews: [] as MusicTranslationCsvPreview[],
        };
    }

    const musics = await db.music.findMany({
        where: {
            index: { in: [...new Set(parsed.rows.map((row) => row.index))] },
        },
        select: { index: true, title: true },
    });
    const titles = new Map(musics.map((music) => [music.index, music.title]));
    const errors = parsed.rows
        .filter((row) => !titles.has(row.index))
        .map(
            (row) =>
                row.line +
                "행: 존재하지 않는 악곡 index입니다. (" +
                row.index +
                ")"
        );

    return {
        rows: parsed.rows,
        errors,
        previews: parsed.rows
            .filter((row) => titles.has(row.index))
            .map((row) => ({
                index: row.index,
                locale: row.locale,
                title: row.title,
                status: row.status,
                originalTitle: titles.get(row.index) ?? "",
            })),
    };
}

export async function validateMusicTranslationsCsv(
    csv: string
): Promise<MusicTranslationCsvValidationResult> {
    await requireAdmin();
    const inputResult = musicTranslationCsvTextSchema.safeParse({ csv });
    if (!inputResult.success)
        return actionValidationFailure(inputResult.error, {
            message: "CSV를 확인해주세요.",
            preferFirstIssue: true,
            alwaysIncludeFieldErrors: true,
        });

    try {
        const result = await validateTranslationCsvContent(
            inputResult.data.csv
        );
        if (result.errors.length > 0) {
            return {
                success: false,
                message: "CSV 내용을 수정한 뒤 다시 검증해주세요.",
                fieldErrors: { csv: result.errors },
            };
        }

        return {
            success: true,
            message: result.previews.length + "개 번역을 반영할 수 있습니다.",
            previews: result.previews.slice(0, 20),
            totalCount: result.previews.length,
        };
    } catch (error) {
        logMusicTranslationError(
            error,
            "admin.music.translation-csv.validate.failed"
        );
        return {
            success: false,
            message: "CSV를 검증하지 못했습니다.",
        };
    }
}

export async function importMusicTranslationsCsv(
    csv: string
): Promise<MusicTranslationCsvImportResult> {
    await requireAdmin();
    const inputResult = musicTranslationCsvTextSchema.safeParse({ csv });
    if (!inputResult.success)
        return actionValidationFailure(inputResult.error, {
            message: "CSV를 확인해주세요.",
            preferFirstIssue: true,
            alwaysIncludeFieldErrors: true,
        });

    try {
        const result = await validateTranslationCsvContent(
            inputResult.data.csv
        );
        if (result.errors.length > 0) {
            return {
                success: false,
                message: "검증 오류가 있어 번역을 반영하지 않았습니다.",
                fieldErrors: { csv: result.errors },
            };
        }

        const reviewedAt = new Date();
        await db.$transaction(
            result.rows.map((row) =>
                db.musicTranslation.upsert({
                    where: {
                        musicIndex_locale: {
                            musicIndex: row.index,
                            locale: row.locale,
                        },
                    },
                    create: {
                        musicIndex: row.index,
                        locale: row.locale,
                        title: row.title,
                        status: row.status,
                        reviewedAt:
                            row.status === "approved" ? reviewedAt : null,
                    },
                    update: {
                        title: row.title,
                        status: row.status,
                        reviewedAt:
                            row.status === "approved" ? reviewedAt : null,
                    },
                })
            )
        );

        refreshMusicTranslations();
        return {
            success: true,
            message: result.rows.length + "개 번역을 반영했습니다.",
            count: result.rows.length,
        };
    } catch (error) {
        logMusicTranslationError(
            error,
            "admin.music.translation-csv.import.failed"
        );
        return {
            success: false,
            message: "악곡 번역 CSV를 반영하지 못했습니다.",
        };
    }
}

export async function createMusicTranslationCsvExport(
    localeParam: string | null,
    statusParam: string | null
) {
    await requireAdmin();
    const locale = normalizeMusicTranslationLocale(localeParam);
    const status = normalizeMusicTranslationStatus(statusParam);
    const locales = locale ? [locale] : [...MUSIC_TRANSLATION_LOCALES];

    const musics = await db.music.findMany({
        where: status
            ? {
                  translations: {
                      some: {
                          locale: { in: locales },
                          status,
                      },
                  },
              }
            : undefined,
        select: {
            index: true,
            title: true,
            titleKana: true,
            translations: {
                where: {
                    locale: { in: locales },
                    ...(status ? { status } : {}),
                },
                select: {
                    locale: true,
                    title: true,
                    status: true,
                },
            },
        },
        orderBy: { title: "asc" },
    });

    const rows: MusicTranslationExportRow[] = musics.flatMap((music) =>
        locales.flatMap((translationLocale) => {
            const translation = music.translations.find(
                (item) => item.locale === translationLocale
            );
            if (status && !translation) return [];

            return [
                {
                    index: music.index,
                    originalTitle: music.title,
                    titleKana: music.titleKana,
                    locale: translationLocale,
                    title: translation?.title ?? "",
                    status:
                        normalizeMusicTranslationStatus(translation?.status) ??
                        "draft",
                },
            ];
        })
    );
    const localeSuffix = locale ? "-" + locale : "";
    const statusSuffix = status ? "-" + status : "";

    return {
        csv: serializeMusicTranslationCsv(rows),
        filename:
            "noslog-music-translations" + localeSuffix + statusSuffix + ".csv",
    };
}
