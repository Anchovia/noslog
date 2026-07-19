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
