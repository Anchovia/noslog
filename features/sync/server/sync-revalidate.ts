import "server-only";

import { revalidateTag } from "next/cache";

import type { runSync } from "@/features/sync/server/run-sync";
import type { getSyncUser } from "@/features/sync/server/sync-attempt-data";
import {
    CACHE_TAGS,
    getChartRankingTag,
    getUserProfileTag,
} from "@/lib/cache-tags";

// 바뀐 채보가 이보다 많으면(첫 전체 동기화 등) 채보별 대신 전체 순위 태그 하나로 비운다
const CHART_TAG_REVALIDATE_LIMIT = 200;

export function revalidateSyncCaches(
    user: NonNullable<Awaited<ReturnType<typeof getSyncUser>>>,
    {
        grades,
        changedChartIds,
        newAchievements,
        catalogUpdates,
    }: Awaited<ReturnType<typeof runSync>>
) {
    // 공용 캐시는 이번 동기화로 실제로 바뀐 만큼만 비운다(2026-10-15 S3) — 바뀐 게 없으면 본인 프로필만
    const gradeChanged =
        grades !== null &&
        (grades.grade_basic !== (user.stats?.gradeBasic ?? null) ||
            grades.grade_recital !== (user.stats?.gradeRecital ?? null));
    revalidateTag(getUserProfileTag(user.id), "max");
    if (changedChartIds.length > CHART_TAG_REVALIDATE_LIMIT) {
        revalidateTag(CACHE_TAGS.chartRankings, "max");
    } else {
        for (const chartId of changedChartIds)
            revalidateTag(getChartRankingTag(chartId), "max");
    }
    // 전체 랭킹 = Grd · 기록에서 나온 레이팅
    if (gradeChanged || changedChartIds.length > 0)
        revalidateTag(CACHE_TAGS.userRankings, "max");
    // 모든 프로필 = 각자의 Grd 순위 · 업적 달성 인원
    if (gradeChanged || newAchievements.length > 0)
        revalidateTag(CACHE_TAGS.userProfiles, "max");
    // 빙고 · 악곡 정보는 곡 목록이 바뀐 경우만
    if (catalogUpdates.applied > 0) {
        revalidateTag(CACHE_TAGS.bingos, "max");
        revalidateTag(CACHE_TAGS.musicCatalog, "max");
        revalidateTag(CACHE_TAGS.musicDetails, "max");
    }
}
