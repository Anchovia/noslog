import "server-only";

import { unstable_cache } from "next/cache";

import { CACHE_TAGS } from "./cacheTags";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "./cachePolicy";
import db from "./db";

async function queryPublishedAnnouncements() {
    const announcements = await db.announcement.findMany({
        where: { isPublished: true },
        select: {
            id: true,
            title: true,
            content: true,
            publishedAt: true,
        },
        orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
        take: 3,
    });

    return announcements.map((announcement) => ({
        ...announcement,
        publishedAt: announcement.publishedAt?.toISOString() ?? null,
    }));
}

export const getPublishedAnnouncements = unstable_cache(
    queryPublishedAnnouncements,
    ["published-announcements"],
    {
        tags: [CACHE_TAGS.announcements],
        revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    }
);
