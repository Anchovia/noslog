"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";

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
