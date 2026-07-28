"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import {
    MUSIC_TRANSLATION_LOCALES,
    MUSIC_TRANSLATION_STATUSES,
    parseMusicTranslationCsv,
} from "@/lib/musicTranslations/csv";

function optionalNumber(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();
    if (!text) return null;
    const number = Number(text);
    return Number.isFinite(number) ? number : null;
}

function optionalText(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();
    return text || null;
}

export async function saveMusicMetadata(formData: FormData) {
    await requireAdmin();
    const musicIndex = String(formData.get("musicIndex") ?? "");
    if (!musicIndex) return;

    const bpmMin = optionalNumber(formData.get("bpmMin"));
    const bpmMax = optionalNumber(formData.get("bpmMax"));
    const durationSeconds = optionalNumber(formData.get("durationSeconds"));

    await db.$transaction([
        db.music.update({
            where: { index: musicIndex },
            data: { description: optionalText(formData.get("description")) },
        }),
        db.musicChart.updateMany({
            where: { music_idx: musicIndex },
            data: {
                bpm_min:
                    bpmMin === null ? null : Math.max(1, Math.round(bpmMin)),
                bpm_max:
                    bpmMax === null ? null : Math.max(1, Math.round(bpmMax)),
                duration_seconds:
                    durationSeconds === null
                        ? null
                        : Math.max(0, Math.round(durationSeconds)),
            },
        }),
    ]);
    updateTag(CACHE_TAGS.musicCatalog);
    updateTag(CACHE_TAGS.musicDetails);
    revalidatePath(`/music/${musicIndex}`);
}

export async function saveChartMetadata(formData: FormData) {
    await requireAdmin();
    const chartId = Number(formData.get("chartId"));
    const musicIndex = String(formData.get("musicIndex") ?? "");
    if (!Number.isInteger(chartId) || !musicIndex) return;

    const levelConstant = optionalNumber(formData.get("levelConstant"));
    const noteCount = optionalNumber(formData.get("noteCount"));
    const releasedAtText = String(formData.get("releasedAt") ?? "").trim();
    const releasedAt = releasedAtText
        ? new Date(`${releasedAtText}T00:00:00.000Z`)
        : null;

    const current = await db.musicChart.findUnique({
        where: { id: chartId },
        select: { level_constant: true, difficulty: true },
    });
    if (!current) return;

    await db.$transaction(async (tx) => {
        await tx.musicChart.update({
            where: { id: chartId },
            data: {
                level_constant: levelConstant,
                note_count:
                    noteCount === null
                        ? null
                        : Math.max(0, Math.round(noteCount)),
                released_at:
                    releasedAt && !Number.isNaN(releasedAt.getTime())
                        ? releasedAt
                        : null,
                unlock_condition: optionalText(formData.get("unlockCondition")),
                play_video_url: optionalText(formData.get("playVideoUrl")),
                chart_preview_url: optionalText(
                    formData.get("chartPreviewUrl")
                ),
            },
        });

        if (
            levelConstant !== null &&
            levelConstant !== current.level_constant
        ) {
            await tx.chartLevelConstantHistory.create({
                data: { chart_id: chartId, value: levelConstant },
            });
        }
    });

    updateTag(CACHE_TAGS.musicCatalog);
    updateTag(CACHE_TAGS.musicDetails);
    revalidatePath(`/music/${musicIndex}/${current.difficulty.toLowerCase()}`);
}

async function validateTranslationCsv(csv: string) {
    const parsed = parseMusicTranslationCsv(csv);
    if (parsed.errors.length > 0) return { ...parsed, previews: [] };

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
                `${row.line}행: 존재하지 않는 악곡 index입니다. (${row.index})`
        );

    return {
        rows: parsed.rows,
        errors,
        previews: parsed.rows
            .filter((row) => titles.has(row.index))
            .map((row) => ({
                ...row,
                originalTitle: titles.get(row.index)!,
            })),
    };
}

export async function validateMusicTranslationsCsv(csv: string) {
    await requireAdmin();
    const result = await validateTranslationCsv(csv);

    return {
        success: result.errors.length === 0,
        message:
            result.errors.length === 0
                ? `${result.previews.length}개 번역을 반영할 수 있습니다.`
                : "CSV 내용을 수정한 뒤 다시 검증해주세요.",
        errors: result.errors,
        previews: result.previews.slice(0, 20),
        totalCount: result.previews.length,
    };
}

export async function importMusicTranslationsCsv(csv: string) {
    await requireAdmin();
    const result = await validateTranslationCsv(csv);
    if (result.errors.length > 0) {
        return {
            success: false,
            message: "검증 오류가 있어 번역을 반영하지 않았습니다.",
            errors: result.errors,
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
                    reviewedAt: row.status === "approved" ? reviewedAt : null,
                },
                update: {
                    title: row.title,
                    status: row.status,
                    reviewedAt: row.status === "approved" ? reviewedAt : null,
                },
            })
        )
    );

    updateTag(CACHE_TAGS.musicCatalog);
    updateTag(CACHE_TAGS.musicDetails);
    revalidatePath("/admin/music");

    return {
        success: true,
        message: `${result.rows.length}개 번역을 반영했습니다.`,
        errors: [],
    };
}

export async function saveMusicTranslation(formData: FormData) {
    await requireAdmin();
    const musicIndex = String(formData.get("musicIndex") ?? "").trim();
    const locale = String(formData.get("locale") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();

    if (
        !musicIndex ||
        !MUSIC_TRANSLATION_LOCALES.includes(
            locale as (typeof MUSIC_TRANSLATION_LOCALES)[number]
        ) ||
        !MUSIC_TRANSLATION_STATUSES.includes(
            status as (typeof MUSIC_TRANSLATION_STATUSES)[number]
        ) ||
        title.length > 300
    ) {
        return;
    }

    if (!title) {
        await db.musicTranslation.deleteMany({
            where: { musicIndex, locale },
        });
    } else {
        await db.musicTranslation.upsert({
            where: {
                musicIndex_locale: { musicIndex, locale },
            },
            create: {
                musicIndex,
                locale,
                title,
                status,
                reviewedAt: status === "approved" ? new Date() : null,
            },
            update: {
                title,
                status,
                reviewedAt: status === "approved" ? new Date() : null,
            },
        });
    }

    updateTag(CACHE_TAGS.musicCatalog);
    updateTag(CACHE_TAGS.musicDetails);
    revalidatePath(`/admin/music/${encodeURIComponent(musicIndex)}`);
}
