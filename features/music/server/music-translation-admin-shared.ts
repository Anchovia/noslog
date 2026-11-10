import "server-only";

import { revalidatePath, updateTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-tags";
import { logServerError } from "@/lib/observability/server";

export function logMusicTranslationError(
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

export function refreshMusicTranslations(musicIndex?: string) {
    updateTag(CACHE_TAGS.musicCatalog);
    updateTag(CACHE_TAGS.musicDetails);
    // 서열표 구간도 번역 제목을 싣는다(2026-10-16 D8 · B6)
    updateTag(CACHE_TAGS.tierLists);
    revalidatePath("/admin/music");
    if (musicIndex) {
        revalidatePath("/admin/music/" + encodeURIComponent(musicIndex));
        revalidatePath("/music/" + encodeURIComponent(musicIndex));
    }
}
