"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";

function optionalText(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();
    return text || null;
}

function optionalDate(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();
    if (!text) return null;
    const date = new Date(`${text}T00:00:00.000Z`);
    return Number.isNaN(date.getTime()) ? null : date;
}

export async function saveBingo(formData: FormData) {
    await requireAdmin();

    const idValue = Number(formData.get("id"));
    const id = Number.isInteger(idValue) && idValue > 0 ? idValue : null;
    const title = String(formData.get("title") ?? "").trim();
    const coverMusicIndex = String(
        formData.get("coverMusicIndex") ?? ""
    ).trim();
    const rewardNos = Math.max(0, Number(formData.get("rewardNos")) || 0);
    const requiredLines = Math.min(
        12,
        Math.max(1, Number(formData.get("requiredLines")) || 1)
    );
    const status = ["draft", "published", "archived"].includes(
        String(formData.get("status"))
    )
        ? String(formData.get("status"))
        : "draft";

    if (!title || !coverMusicIndex) return;
    const coverExists = await db.music.count({
        where: { index: coverMusicIndex },
    });
    if (!coverExists) return;

    const cells = Array.from({ length: 25 }, (_, offset) => {
        const position = offset + 1;
        const prefix = `cell-${position}`;
        const ruleConfigText = String(
            formData.get(`${prefix}-ruleConfig`) ?? ""
        ).trim();
        let ruleConfig: Prisma.InputJsonValue | typeof Prisma.DbNull =
            Prisma.DbNull;
        if (ruleConfigText) {
            try {
                ruleConfig = JSON.parse(
                    ruleConfigText
                ) as Prisma.InputJsonValue;
            } catch {
                ruleConfig = { value: ruleConfigText };
            }
        }

        const targetLevelText = String(
            formData.get(`${prefix}-targetLevel`) ?? ""
        ).trim();
        return {
            position,
            title:
                String(formData.get(`${prefix}-title`) ?? "").trim() ||
                `${String.fromCharCode(64 + Math.ceil(position / 5))}${((position - 1) % 5) + 1}`,
            missionType: String(
                formData.get(`${prefix}-missionType`) || "record"
            ),
            ruleType: String(formData.get(`${prefix}-ruleType`) || "manual"),
            ruleConfig,
            categoryShort: optionalText(
                formData.get(`${prefix}-categoryShort`)
            ),
            targetDifficulty: optionalText(
                formData.get(`${prefix}-targetDifficulty`)
            ),
            targetLevel: targetLevelText ? Number(targetLevelText) : null,
            musicIndex: optionalText(formData.get(`${prefix}-musicIndex`)),
        };
    });

    let bingoId = id;
    await db.$transaction(async (tx) => {
        if (id) {
            await tx.bingo.update({
                where: { id },
                data: {
                    title,
                    description: optionalText(formData.get("description")),
                    coverMusicIndex,
                    rewardNos,
                    requiredLines,
                    status,
                    startsAt: optionalDate(formData.get("startsAt")),
                    endsAt: optionalDate(formData.get("endsAt")),
                },
            });
        } else {
            const created = await tx.bingo.create({
                data: {
                    title,
                    description: optionalText(formData.get("description")),
                    coverMusicIndex,
                    rewardNos,
                    requiredLines,
                    status,
                    startsAt: optionalDate(formData.get("startsAt")),
                    endsAt: optionalDate(formData.get("endsAt")),
                },
            });
            bingoId = created.id;
        }

        for (const cell of cells) {
            await tx.bingoCell.upsert({
                where: {
                    bingoId_position: {
                        bingoId: bingoId!,
                        position: cell.position,
                    },
                },
                create: { ...cell, bingoId: bingoId! },
                update: cell,
            });
        }
    });

    updateTag(CACHE_TAGS.bingos);
    revalidatePath("/admin");
    revalidatePath("/admin/bingos");
    revalidatePath("/bingo");
    revalidatePath(`/bingo/${bingoId}`);
    if (!id) redirect(`/admin/bingos/${bingoId}`);
}

export async function deleteBingo(formData: FormData) {
    await requireAdmin();
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id)) return;

    const progressCount = await db.bingoCellProgress.count({
        where: { cell: { bingoId: id } },
    });
    if (progressCount > 0) return;

    await db.bingo.delete({ where: { id } });
    updateTag(CACHE_TAGS.bingos);
    revalidatePath("/admin");
    revalidatePath("/admin/bingos");
    revalidatePath("/bingo");
    redirect("/admin/bingos");
}
