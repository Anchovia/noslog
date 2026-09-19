import "server-only";
import { revalidateTag } from "next/cache";
import type { Prisma } from "@prisma/client";
import db from "@/lib/db";
import { serverEnv } from "@/lib/env/server";
import { officialXPostSchema } from "@/features/home/schemas/officialXPostSchema";
import type { OfficialXPostContent } from "@/features/home/officialXPostContent";
import {
    OFFICIAL_X_CACHE_TAG,
    OFFICIAL_X_FEED_ID,
} from "./officialXPostService";
import { fetchOfficialXLatestPost } from "./officialXTimeline";
import { translateOfficialXPost } from "./officialXPostTranslation";

export const OFFICIAL_X_SYNC_INTERVAL_MS = 12 * 60 * 60 * 1000;
// Longer than the route's hard duration; protects a run just before a slot boundary.
const RUN_GUARD_MS = 3 * 60 * 1000;

type ClaimedFeed = { content: Prisma.JsonValue; lastSuccessAt: Date | null };
export type OfficialXSyncResult = {
    status: "skipped" | "unchanged" | "updated" | "translation-pending";
};

export async function syncOfficialXFeed(): Promise<OfficialXSyncResult> {
    if (!serverEnv.X_BEARER_TOKEN)
        throw new Error("X_BEARER_TOKEN is not configured");
    const now = new Date();
    const slot = new Date(
        Math.floor(now.getTime() / OFFICIAL_X_SYNC_INTERVAL_MS) *
            OFFICIAL_X_SYNC_INTERVAL_MS
    );
    const guard = new Date(now.getTime() - RUN_GUARD_MS);
    // One atomic DB claim across processes/deployments, including duplicate deliveries.
    // Failures consume this slot too: no automatic paid retries until the next slot.
    const [feed] = await db.$queryRaw<ClaimedFeed[]>`
        INSERT INTO "OfficialXFeed" ("id", "last_attempt_at")
        VALUES (${OFFICIAL_X_FEED_ID}, ${now})
        ON CONFLICT ("id") DO UPDATE SET "last_attempt_at" = EXCLUDED."last_attempt_at"
        WHERE "OfficialXFeed"."last_attempt_at" IS NULL
            OR ("OfficialXFeed"."last_attempt_at" < ${slot}
                AND "OfficialXFeed"."last_attempt_at" < ${guard})
        RETURNING "content", "last_success_at" AS "lastSuccessAt"
    `;
    if (!feed) return { status: "skipped" };
    const previous = feed.content
        ? officialXPostSchema.parse(feed.content)
        : null;
    const incoming = await fetchOfficialXLatestPost(previous?.id);
    let post = incoming ?? previous;
    let changed = false;

    async function save(content: OfficialXPostContent) {
        const result = await db.officialXFeed.updateMany({
            // Fence a stale worker: it must not overwrite a newer run's content.
            where: { id: OFFICIAL_X_FEED_ID, lastAttemptAt: now },
            data: { content, lastSuccessAt: new Date() },
        });
        if (result.count !== 1)
            throw new Error("Official X sync ownership lost");
        changed = true;
        revalidateTag(OFFICIAL_X_CACHE_TAG, { expire: 0 });
    }

    if (
        incoming &&
        (!previous ||
            incoming.id !== previous.id ||
            incoming.text !== previous.text ||
            JSON.stringify(incoming.links) !== JSON.stringify(previous.links))
    ) {
        // Persist the cursor/raw post BEFORE Gemini: translation failures never refetch this post.
        post = { ...incoming, translations: null };
        await save(post);
    } else if (previous) {
        post = previous;
    }

    if (post && !post.translations && serverEnv.GEMINI_API_KEY) {
        const translations = await translateOfficialXPost(
            post.text,
            post.links
        );
        if (!translations) return { status: "translation-pending" };
        await save({ ...post, translations });
    } else if (!post && !feed.lastSuccessAt) {
        // A successful empty initial response is distinct from uninitialized/error.
        const result = await db.officialXFeed.updateMany({
            where: { id: OFFICIAL_X_FEED_ID, lastAttemptAt: now },
            data: { lastSuccessAt: new Date() },
        });
        if (result.count !== 1)
            throw new Error("Official X sync ownership lost");
    }
    // Also heals a prior cache-invalidation failure; unchanged content is never rewritten.
    revalidateTag(OFFICIAL_X_CACHE_TAG, { expire: 0 });
    return { status: changed ? "updated" : "unchanged" };
}
