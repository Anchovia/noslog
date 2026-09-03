import { revalidatePath, updateTag } from "next/cache";

import {
    parseMusicTranslationCsv,
    serializeMusicTranslationCsv,
    type MusicTranslationExportRow,
} from "@/features/music/csv/musicTranslationCsv";
import {
    MUSIC_TRANSLATION_LOCALES,
    musicTranslationApproveInputFromFormData,
    musicTranslationApproveSchema,
    musicTranslationCsvTextSchema,
    musicTranslationFormSchema,
    musicTranslationInputFromFormData,
    normalizeMusicTranslationLocale,
    normalizeMusicTranslationStatus,
    type MusicTranslationFieldName,
    type MusicTranslationLocale,
    type MusicTranslationStatus,
} from "@/features/music/schemas/musicTranslationAdminSchema";
import type {
    AdminMusicListData,
    MusicTranslationCsvPreview,
} from "@/features/music/types/musicAdmin";
import type { ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";

type MusicTranslationActionResult = ActionResult<
    Record<never, never>,
    MusicTranslationFieldName
>;
type MusicTranslationApproveResult = ActionResult;
type MusicTranslationCsvValidationResult = ActionResult<
    {
        previews: MusicTranslationCsvPreview[];
        totalCount: number;
    },
    "csv"
>;
type MusicTranslationCsvImportResult = ActionResult<{ count: number }, "csv">;

interface AdminMusicListParams {
    missing?: string;
    q?: string;
    translationLocale?: string;
    translationStatus?: string;
}

function logMusicTranslationError(
    error: unknown,
    event: string,
    routeType = "action"
) {
    logServerError(error, {
        event,
        routePath: "/admin/music",
        routeType,
    });
}

function refreshMusicTranslations(musicIndex?: string) {
    updateTag(CACHE_TAGS.musicCatalog);
    updateTag(CACHE_TAGS.musicDetails);
    revalidatePath("/admin/music");
    if (musicIndex) {
        revalidatePath("/admin/music/" + encodeURIComponent(musicIndex));
        revalidatePath("/music/" + encodeURIComponent(musicIndex));
    }
}

export async function getAdminMusicList(
    params: AdminMusicListParams
): Promise<AdminMusicListData> {
    await requireAdmin();
    const query = params.q ?? "";
    const keyword = query.trim();
    const activeLocale = normalizeMusicTranslationLocale(
        params.translationLocale
    );
    const activeStatus =
        params.translationStatus === "missing"
            ? "missing"
            : normalizeMusicTranslationStatus(params.translationStatus);
    const missingLevelConstant = params.missing === "1";
    const translationFilter =
        activeLocale && activeStatus === "missing"
            ? { translations: { none: { locale: activeLocale } } }
            : activeLocale && activeStatus
              ? {
                    translations: {
                        some: {
                            locale: activeLocale,
                            status: activeStatus,
                        },
                    },
                }
              : {};

    try {
        const [musics, totalMusicCount, translationGroups] = await Promise.all([
            db.music.findMany({
                where: {
                    ...translationFilter,
                    ...(missingLevelConstant
                        ? { charts: { some: { level_constant: null } } }
                        : {}),
                    ...(keyword
                        ? {
                              OR: [
                                  { title: { contains: keyword } },
                                  { artist: { contains: keyword } },
                                  { index: { contains: keyword } },
                                  {
                                      translations: {
                                          some: {
                                              title: { contains: keyword },
                                          },
                                      },
                                  },
                              ],
                          }
                        : {}),
                },
                select: {
                    index: true,
                    title: true,
                    artist: true,
                    category_short: true,
                    charts: { select: { id: true, level_constant: true } },
                    translations: {
                        where: activeLocale
                            ? { locale: activeLocale }
                            : {
                                  locale: {
                                      in: [...MUSIC_TRANSLATION_LOCALES],
                                  },
                              },
                        select: {
                            locale: true,
                            title: true,
                            status: true,
                        },
                    },
                },
                orderBy: { title: "asc" },
                take: 100,
            }),
            db.music.count(),
            db.musicTranslation.groupBy({
                by: ["locale", "status"],
                where: { locale: { in: [...MUSIC_TRANSLATION_LOCALES] } },
                _count: { _all: true },
            }),
        ]);

        const coverage = [
            { locale: "ko", label: "한국어" },
            { locale: "en", label: "영어" },
        ].map(({ locale, label }) => {
            const translationLocale = locale as MusicTranslationLocale;
            const count = (status: MusicTranslationStatus) =>
                translationGroups.find(
                    (group) =>
                        group.locale === translationLocale &&
                        group.status === status
                )?._count._all ?? 0;
            const approved = count("approved");
            const draft = count("draft");

            return {
                locale: translationLocale,
                label,
                approved,
                draft,
                missing: Math.max(0, totalMusicCount - approved - draft),
                total: totalMusicCount,
            };
        });

        return {
            query,
            activeLocale,
            activeStatus,
            missingLevelConstant,
            coverage,
            musics: musics.map((music) => {
                const translation = activeLocale
                    ? music.translations.find(
                          (item) => item.locale === activeLocale
                      )
                    : null;

                return {
                    index: music.index,
                    title: music.title,
                    artist: music.artist,
                    categoryShort: music.category_short,
                    chartCount: music.charts.length,
                    configuredChartCount: music.charts.filter(
                        (chart) => chart.level_constant !== null
                    ).length,
                    translation: translation
                        ? {
                              title: translation.title,
                              status:
                                  normalizeMusicTranslationStatus(
                                      translation.status
                                  ) ?? "draft",
                          }
                        : null,
                };
            }),
        };
    } catch (error) {
        logMusicTranslationError(error, "admin.music.list.failed", "page");
        throw error;
    }
}

export async function saveMusicTranslation(
    formData: FormData
): Promise<MusicTranslationActionResult> {
    await requireAdmin();
    const result = musicTranslationFormSchema.safeParse(
        musicTranslationInputFromFormData(formData)
    );
    if (!result.success) {
        return {
            success: false,
            message:
                result.error.issues[0]?.message ??
                "악곡 번역 입력을 확인해주세요.",
            fieldErrors: result.error.flatten().fieldErrors,
        };
    }
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
        return {
            success: false,
            message:
                result.error.issues[0]?.message ??
                "승인할 악곡 번역을 확인해주세요.",
        };
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
    if (!inputResult.success) {
        return {
            success: false,
            message:
                inputResult.error.issues[0]?.message ?? "CSV를 확인해주세요.",
            fieldErrors: inputResult.error.flatten().fieldErrors,
        };
    }

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
    if (!inputResult.success) {
        return {
            success: false,
            message:
                inputResult.error.issues[0]?.message ?? "CSV를 확인해주세요.",
            fieldErrors: inputResult.error.flatten().fieldErrors,
        };
    }

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
            title_kana: true,
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
                    titleKana: music.title_kana,
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
