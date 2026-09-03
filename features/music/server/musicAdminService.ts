import { revalidatePath, updateTag } from "next/cache";

import {
    chartMetadataInputFromFormData,
    chartMetadataSchema,
    musicMetadataInputFromFormData,
    musicMetadataSchema,
    type ChartMetadataFieldName,
    type MusicMetadataFieldName,
} from "@/features/music/schemas/musicAdminSchema";
import type { AdminMusicDetail } from "@/features/music/types/musicAdmin";
import type { ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";
import { formatDateInput } from "@/lib/utils";

type MusicMetadataActionResult = ActionResult<
    Record<never, never>,
    MusicMetadataFieldName
>;
type ChartMetadataActionResult = ActionResult<
    Record<never, never>,
    ChartMetadataFieldName
>;

const difficultyOrder: Record<string, number> = {
    normal: 0,
    hard: 1,
    expert: 2,
    real: 3,
};

function refreshMusicMetadata(musicIndex: string, difficulty?: string) {
    updateTag(CACHE_TAGS.musicCatalog);
    updateTag(CACHE_TAGS.musicDetails);
    revalidatePath("/admin/music");
    revalidatePath(`/admin/music/${encodeURIComponent(musicIndex)}`);
    revalidatePath(`/music/${encodeURIComponent(musicIndex)}`);
    if (difficulty) {
        revalidatePath(
            `/music/${encodeURIComponent(musicIndex)}/${difficulty.toLowerCase()}`
        );
    }
}

function logMusicAdminError(
    error: unknown,
    event: string,
    routePath: string,
    routeType = "action"
) {
    logServerError(error, {
        event,
        routePath,
        routeType,
    });
}

export async function getAdminMusicDetail(
    musicIndex: string
): Promise<AdminMusicDetail | null> {
    await requireAdmin();

    try {
        const music = await db.music.findUnique({
            where: { index: musicIndex },
            include: {
                translations: {
                    where: { locale: { in: ["ko", "en"] } },
                    orderBy: { locale: "asc" },
                },
                charts: {
                    include: {
                        levelConstantHistory: {
                            orderBy: { effective_at: "desc" },
                            take: 5,
                        },
                    },
                },
            },
        });
        if (!music) return null;

        const charts = [...music.charts].sort(
            (first, second) =>
                (difficultyOrder[first.difficulty.toLowerCase()] ?? 99) -
                (difficultyOrder[second.difficulty.toLowerCase()] ?? 99)
        );

        return {
            index: music.index,
            title: music.title,
            artist: music.artist,
            categoryShort: music.category_short,
            description: music.description ?? "",
            bpmMin:
                charts
                    .find((chart) => chart.bpm_min !== null)
                    ?.bpm_min?.toString() ?? "",
            bpmMax:
                charts
                    .find((chart) => chart.bpm_max !== null)
                    ?.bpm_max?.toString() ?? "",
            durationSeconds:
                charts
                    .find((chart) => chart.duration_seconds !== null)
                    ?.duration_seconds?.toString() ?? "",
            translations: music.translations.map((translation) => ({
                locale: translation.locale,
                title: translation.title,
                status: translation.status,
            })),
            charts: charts.map((chart) => ({
                id: chart.id,
                difficulty: chart.difficulty,
                level: chart.level,
                levelConstant: chart.level_constant,
                noteCount: chart.note_count,
                releasedAt: formatDateInput(chart.released_at),
                unlockCondition: chart.unlock_condition ?? "",
                playVideoUrl: chart.play_video_url ?? "",
                chartPreviewUrl: chart.chart_preview_url ?? "",
                history: chart.levelConstantHistory.map(
                    (history) => history.value
                ),
            })),
        };
    } catch (error) {
        logMusicAdminError(
            error,
            "admin.music.detail.failed",
            `/admin/music/${encodeURIComponent(musicIndex)}`,
            "page"
        );
        throw error;
    }
}

export async function saveMusicMetadata(
    formData: FormData
): Promise<MusicMetadataActionResult> {
    await requireAdmin();
    const result = musicMetadataSchema.safeParse(
        musicMetadataInputFromFormData(formData)
    );
    if (!result.success) {
        return {
            success: false,
            message:
                result.error.issues[0]?.message ??
                "악곡 공통 정보 입력을 확인해주세요.",
            fieldErrors: result.error.flatten().fieldErrors,
        };
    }
    const input = result.data;

    try {
        await db.$transaction([
            db.music.update({
                where: { index: input.musicIndex },
                data: { description: input.description },
            }),
            db.musicChart.updateMany({
                where: { music_idx: input.musicIndex },
                data: {
                    bpm_min: input.bpmMin,
                    bpm_max: input.bpmMax,
                    duration_seconds: input.durationSeconds,
                },
            }),
        ]);
    } catch (error) {
        logMusicAdminError(
            error,
            "admin.music.metadata.save.failed",
            `/admin/music/${encodeURIComponent(input.musicIndex)}`
        );
        return {
            success: false,
            message: "악곡 공통 정보를 저장하지 못했습니다.",
        };
    }

    refreshMusicMetadata(input.musicIndex);
    return { success: true, message: "악곡 공통 정보를 저장했습니다." };
}

export async function saveChartMetadata(
    formData: FormData
): Promise<ChartMetadataActionResult> {
    await requireAdmin();
    const result = chartMetadataSchema.safeParse(
        chartMetadataInputFromFormData(formData)
    );
    if (!result.success) {
        return {
            success: false,
            message:
                result.error.issues[0]?.message ??
                "채보 정보 입력을 확인해주세요.",
            fieldErrors: result.error.flatten().fieldErrors,
        };
    }
    const input = result.data;

    try {
        const current = await db.musicChart.findUnique({
            where: { id: input.chartId },
            select: {
                level_constant: true,
                difficulty: true,
                music_idx: true,
            },
        });
        if (!current || current.music_idx !== input.musicIndex) {
            return {
                success: false,
                message: "저장할 채보를 찾을 수 없습니다.",
            };
        }

        await db.$transaction(async (transaction) => {
            await transaction.musicChart.update({
                where: { id: input.chartId },
                data: {
                    level_constant: input.levelConstant,
                    note_count: input.noteCount,
                    released_at: input.releasedAt,
                    unlock_condition: input.unlockCondition,
                    play_video_url: input.playVideoUrl,
                    chart_preview_url: input.chartPreviewUrl,
                },
            });

            if (
                input.levelConstant !== null &&
                input.levelConstant !== current.level_constant
            ) {
                await transaction.chartLevelConstantHistory.create({
                    data: {
                        chart_id: input.chartId,
                        value: input.levelConstant,
                    },
                });
            }
        });

        refreshMusicMetadata(input.musicIndex, current.difficulty);
    } catch (error) {
        logMusicAdminError(
            error,
            "admin.music.chart-metadata.save.failed",
            `/admin/music/${encodeURIComponent(input.musicIndex)}`
        );
        return {
            success: false,
            message: "채보 정보를 저장하지 못했습니다.",
        };
    }

    return { success: true, message: "채보 정보를 저장했습니다." };
}
