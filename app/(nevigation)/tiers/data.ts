import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { unstable_cache } from "next/cache";

export type PublicTierMode = "all" | "basic" | "recital";

// 공개 서열표 목록을 모드별로 캐시함
export const getCachedTierLists = unstable_cache(
    async (mode: PublicTierMode) => {
        const tierLists = await db.tierList.findMany({
            where: {
                status: "published",
                ...(mode === "all" ? {} : { mode }),
            },
            select: {
                id: true,
                slug: true,
                title: true,
                mode: true,
                updatedAt: true,
                entries: { select: { chartId: true } },
            },
            orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        });

        return tierLists.map((tierList) => ({
            ...tierList,
            updatedAt: tierList.updatedAt.toISOString(),
        }));
    },
    ["public-tier-lists", "official-v1"],
    {
        revalidate: 3600,
        tags: [CACHE_TAGS.tierLists],
    }
);

// 서열표 구간과 채보 배치는 모든 사용자에게 동일하므로 slug별로 캐시함
export const getCachedTierDetail = unstable_cache(
    async (slug: string) => {
        const tierList = await db.tierList.findFirst({
            where: { slug, status: "published" },
            select: {
                id: true,
                slug: true,
                title: true,
                mode: true,
                updatedAt: true,
                bands: {
                    orderBy: { position: "asc" },
                    select: {
                        id: true,
                        value: true,
                        position: true,
                        entries: {
                            orderBy: { position: "asc" },
                            select: {
                                id: true,
                                chartId: true,
                                position: true,
                                chart: {
                                    select: {
                                        difficulty: true,
                                        music: {
                                            select: {
                                                index: true,
                                                title: true,
                                                background: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return tierList
            ? {
                  ...tierList,
                  updatedAt: tierList.updatedAt.toISOString(),
              }
            : null;
    },
    ["public-tier-detail", "official-v1"],
    {
        revalidate: 3600,
        tags: [CACHE_TAGS.tierLists],
    }
);

// 플레이 기록은 로그인 사용자마다 다르므로 공유 캐시를 사용하지 않음
export function getUserTierRecords(userId: number, chartIds: number[]) {
    if (chartIds.length === 0) return Promise.resolve([]);

    return db.playData.findMany({
        where: { user_id: userId, chart_id: { in: chartIds } },
        select: {
            chart_id: true,
            score: true,
            rank: true,
            fc_type: true,
        },
    });
}
