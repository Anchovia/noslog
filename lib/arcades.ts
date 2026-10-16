import "server-only";

import { unstable_cache } from "next/cache";

import { CACHE_TAGS } from "./cache-tags";
import db from "./db";

async function queryActiveArcades() {
    // 지역은 공개 정보가 정본(2026-10-16 DB 재설계 D6)
    const arcades = await db.arcade.findMany({
        where: { is_active: true },
        select: {
            id: true,
            name: true,
            publicDetails: { select: { administrativeArea: true } },
        },
        orderBy: [
            { publicDetails: { administrativeArea: "asc" } },
            { name: "asc" },
        ],
    });
    return arcades.map(({ publicDetails, ...arcade }) => ({
        ...arcade,
        region: publicDetails?.administrativeArea ?? null,
    }));
}

export const getActiveArcades = unstable_cache(
    queryActiveArcades,
    ["active-arcades"],
    { tags: [CACHE_TAGS.arcades], revalidate: 3600 }
);
