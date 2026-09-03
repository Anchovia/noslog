"use server";

import { revalidatePath, updateTag } from "next/cache";

import {
    saveChartMetadata as saveChartMetadataService,
    saveMusicMetadata as saveMusicMetadataService,
} from "@/features/music/server/musicAdminService";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import {
    MUSIC_TRANSLATION_LOCALES,
    MUSIC_TRANSLATION_STATUSES,
    parseMusicTranslationCsv,
} from "@/lib/musicTranslations/csv";

export async function saveMusicMetadata(formData: FormData) {
    return saveMusicMetadataService(formData);
}

export async function saveChartMetadata(formData: FormData) {
    return saveChartMetadataService(formData);
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

export async function approveMusicTranslation(formData: FormData) {
    await requireAdmin();
    const musicIndex = String(formData.get("musicIndex") ?? "").trim();
    const locale = String(formData.get("locale") ?? "").trim();

    if (
        !musicIndex ||
        !MUSIC_TRANSLATION_LOCALES.includes(
            locale as (typeof MUSIC_TRANSLATION_LOCALES)[number]
        )
    ) {
        return;
    }

    await db.musicTranslation.updateMany({
        where: { musicIndex, locale },
        data: {
            status: "approved",
            reviewedAt: new Date(),
        },
    });

    updateTag(CACHE_TAGS.musicCatalog);
    updateTag(CACHE_TAGS.musicDetails);
    revalidatePath("/admin/music");
    revalidatePath(`/admin/music/${encodeURIComponent(musicIndex)}`);
}
