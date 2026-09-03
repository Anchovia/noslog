import { revalidatePath, updateTag } from "next/cache";

import {
    musicCatalogReviewInputFromFormData,
    musicCatalogReviewSchema,
    type MusicCatalogStatus,
} from "@/features/music/schemas/musicCatalogAdminSchema";
import type { AdminMusicCatalogCandidate } from "@/features/music/types/musicCatalogAdmin";
import type { ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";
import {
    applyMusicCatalogSnapshot,
    describeMusicCatalogChanges,
    musicCatalogSnapshotSchema,
    parseMusicCatalogSnapshot,
} from "@/lib/services/music/catalogSync";

type MusicCatalogReviewResult = ActionResult;

function logMusicCatalogError(
    error: unknown,
    event: string,
    routeType = "action"
) {
    logServerError(error, {
        event,
        routePath: "/admin/catalog",
        routeType,
    });
}

function refreshMusicCatalog(updatePublicData: boolean) {
    if (updatePublicData) {
        updateTag(CACHE_TAGS.musicCatalog);
        updateTag(CACHE_TAGS.musicDetails);
        updateTag(CACHE_TAGS.chartRankings);
        updateTag(CACHE_TAGS.userRankings);
    }
    revalidatePath("/admin");
    revalidatePath("/admin/catalog");
}

export async function listMusicCatalogCandidates(
    status: MusicCatalogStatus
): Promise<AdminMusicCatalogCandidate[]> {
    await requireAdmin();

    try {
        const candidates = await db.musicCatalogCandidate.findMany({
            where: { status },
            orderBy: { lastSeenAt: "desc" },
            take: 100,
        });

        return candidates.flatMap((candidate) => {
            const payloadResult = musicCatalogSnapshotSchema.safeParse(
                candidate.payload
            );
            if (!payloadResult.success) return [];
            const beforeResult = candidate.beforeSnapshot
                ? musicCatalogSnapshotSchema.safeParse(candidate.beforeSnapshot)
                : null;
            const before =
                beforeResult?.success === true ? beforeResult.data : null;

            return [
                {
                    id: candidate.id,
                    status,
                    title: payloadResult.data.title,
                    artist: payloadResult.data.artist,
                    musicIndex: payloadResult.data.musicIndex,
                    seenCount: candidate.seenCount,
                    lastSeenAt: candidate.lastSeenAt,
                    changes: describeMusicCatalogChanges(
                        before,
                        payloadResult.data
                    ),
                },
            ];
        });
    } catch (error) {
        logMusicCatalogError(error, "admin.music-catalog.list.failed", "page");
        throw error;
    }
}

export async function reviewMusicCatalogCandidate(
    formData: FormData
): Promise<MusicCatalogReviewResult> {
    await requireAdmin();
    const result = musicCatalogReviewSchema.safeParse(
        musicCatalogReviewInputFromFormData(formData)
    );
    if (!result.success) {
        return {
            success: false,
            message:
                result.error.issues[0]?.message ??
                "악곡 업데이트 검토 요청을 확인해주세요.",
        };
    }
    const input = result.data;

    try {
        const candidate = await db.musicCatalogCandidate.findUnique({
            where: { id: input.candidateId },
            select: { id: true, payload: true, status: true },
        });
        if (!candidate) {
            return {
                success: false,
                message: "악곡 업데이트를 찾을 수 없습니다.",
            };
        }
        if (candidate.status === "applied") {
            return {
                success: false,
                message: "이미 반영된 악곡 업데이트입니다.",
            };
        }

        const now = new Date();
        if (input.decision === "reject") {
            await db.musicCatalogCandidate.update({
                where: { id: candidate.id },
                data: { status: "rejected", reviewedAt: now },
            });
            refreshMusicCatalog(false);
            return { success: true, message: "악곡 업데이트를 반려했습니다." };
        }

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
        refreshMusicCatalog(true);
        return { success: true, message: "악곡 업데이트를 반영했습니다." };
    } catch (error) {
        logMusicCatalogError(error, "admin.music-catalog.review.failed");
        return {
            success: false,
            message: "악곡 업데이트를 처리하지 못했습니다.",
        };
    }
}
