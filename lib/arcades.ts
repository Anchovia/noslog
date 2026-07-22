import "server-only";

import { unstable_cache } from "next/cache";

import { CACHE_TAGS } from "./cacheTags";
import db from "./db";

async function queryActiveArcades() {
    return db.arcade.findMany({
        where: { is_active: true },
        select: { id: true, name: true, region: true },
        orderBy: [{ region: "asc" }, { name: "asc" }],
    });
}

export const getActiveArcades = unstable_cache(
    queryActiveArcades,
    ["active-arcades"],
    { tags: [CACHE_TAGS.arcades], revalidate: 3600 }
);

// 공개 오락실 페이지에서는 선호 인원 집계를 최신 상태로 함께 조회함
export async function getGamecenterArcades() {
    return db.arcade.findMany({
        where: { is_active: true },
        select: {
            id: true,
            name: true,
            region: true,
            address: true,
            latitude: true,
            longitude: true,
            machine_count: true,
            play_price: true,
            coin_count: true,
            business_hours: true,
            machine_status: true,
            status_note: true,
            notes: true,
            _count: { select: { users: true } },
        },
        orderBy: [{ region: "asc" }, { name: "asc" }],
    });
}
