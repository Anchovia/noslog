import "server-only";

import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-tags";
import db from "@/lib/db";
import { approvedMusicTranslationsSelect } from "@/lib/i18n/music-title";
import type { TierDifficulty } from "@/lib/tiers/tier-scope";

function getTierChartWhere(
    difficulties: TierDifficulty[],
    levels: string[]
): Prisma.MusicChartWhereInput {
    const regularLevels = levels
        .filter((level) => /^\d+$/.test(level))
        .map(Number);
    const realLevels = levels
        .filter((level) => /^real-[1-3]$/.test(level))
        .map((level) => Number(level.slice(5)));
    const levelFilters: Prisma.MusicChartWhereInput[] = [];

    if (regularLevels.length > 0) {
        levelFilters.push({
            difficulty: { not: "Real" },
            level: { in: regularLevels },
        });
    }
    if (realLevels.length > 0) {
        levelFilters.push({ difficulty: "Real", level: { in: realLevels } });
    }

    return {
        ...(difficulties.length > 0
            ? { difficulty: { in: difficulties } }
            : {}),
        ...(levels.length > 0 ? { OR: levelFilters } : {}),
    };
}

// 구간별 정적 채보 데이터는 필터 조합별로 공유 캐시함
export const getCachedTierBand = unstable_cache(
    async (
        slug: string,
        bandId: number,
        difficulties: TierDifficulty[] = [],
        levels: string[] = []
    ) => {
        const chartWhere = getTierChartWhere(difficulties, levels);

        return db.tierBand.findFirst({
            where: {
                id: bandId,
                tierList: { slug, status: "published", goal: { not: null } },
            },
            select: {
                id: true,
                value: true,
                position: true,
                entries: {
                    where: { chart: chartWhere },
                    orderBy: { position: "asc" },
                    select: {
                        id: true,
                        chartId: true,
                        position: true,
                        chart: {
                            select: {
                                difficulty: true,
                                level: true,
                                music: {
                                    select: {
                                        index: true,
                                        title: true,
                                        titleKana: true,
                                        artist: true,
                                        background: true,
                                        translations:
                                            approvedMusicTranslationsSelect,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    },
    ["public-tier-band", "goal-v4"],
    {
        revalidate: 3600,
        tags: [CACHE_TAGS.tierLists],
    }
);
