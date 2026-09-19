import "server-only";
import { unstable_cache } from "next/cache";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";
import { officialXPostSchema } from "@/features/home/schemas/officialXPostSchema";
import type { OfficialXPostContent } from "@/features/home/officialXPostContent";

export const OFFICIAL_X_CACHE_TAG = "official-x-feed";
export const OFFICIAL_X_FEED_ID = "NOSTALGIA_573";
export type OfficialXPost =
    | { status: "ready"; post: OfficialXPostContent }
    | { status: "empty" }
    | { status: "error" };

// Home only reads persisted data. Cache invalidation can never call X or Gemini.
const readStoredPost = unstable_cache(
    async (): Promise<OfficialXPost> => {
        const feed = await db.officialXFeed.findUnique({
            where: { id: OFFICIAL_X_FEED_ID },
            select: { content: true, lastSuccessAt: true },
        });
        if (!feed || (!feed.content && !feed.lastSuccessAt)) {
            // Do not cache an uninitialized feed or a missing migration as an empty account.
            throw new Error("Official X feed has not been initialized");
        }
        return feed.content
            ? { status: "ready", post: officialXPostSchema.parse(feed.content) }
            : { status: "empty" };
    },
    ["official-x-stored-feed-v1"],
    {
        tags: [OFFICIAL_X_CACHE_TAG],
        revalidate: false,
    }
);

export async function getOfficialXLatestPost(): Promise<OfficialXPost> {
    try {
        return await readStoredPost();
    } catch (error) {
        logServerError(error, {
            event: "official-x.read.failed",
            routePath: "/",
            routeType: "page",
        });
        return { status: "error" };
    }
}
