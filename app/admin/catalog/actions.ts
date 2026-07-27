"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import {
    applyMusicCatalogSnapshot,
    parseMusicCatalogSnapshot,
} from "@/lib/services/music/catalogSync";

export async function reviewMusicCatalogCandidate(formData: FormData) {
    await requireAdmin();
    const candidateId = Number(formData.get("candidateId"));
    const decision = String(formData.get("decision") ?? "");
    if (
        !Number.isInteger(candidateId) ||
        !["approve", "reject"].includes(decision)
    ) {
        return;
    }

    const candidate = await db.musicCatalogCandidate.findUnique({
        where: { id: candidateId },
        select: { id: true, payload: true, status: true },
    });
    if (!candidate || candidate.status === "applied") return;

    const now = new Date();
    if (decision === "reject") {
        await db.musicCatalogCandidate.update({
            where: { id: candidate.id },
            data: { status: "rejected", reviewedAt: now },
        });
    } else {
        const snapshot = parseMusicCatalogSnapshot(candidate.payload);
        await applyMusicCatalogSnapshot(snapshot);
        await db.musicCatalogCandidate.update({
            where: { id: candidate.id },
            data: {
                status: "applied",
                reviewedAt: now,
                appliedAt: now,
            },
        });
        updateTag(CACHE_TAGS.musicCatalog);
        updateTag(CACHE_TAGS.musicDetails);
        updateTag(CACHE_TAGS.chartRankings);
        updateTag(CACHE_TAGS.userRankings);
    }

    revalidatePath("/admin");
    revalidatePath("/admin/catalog");
}
