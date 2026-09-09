import "server-only";
import { unstable_cache } from "next/cache";
import { serverEnv } from "@/lib/env/server";
import type {
    OfficialXPostContent,
    OfficialXPostLink,
} from "@/features/home/officialXPostContent";

export const OFFICIAL_X_USERNAME = "NOSTALGIA_573";
export const OFFICIAL_X_URL = `https://x.com/${OFFICIAL_X_USERNAME}`;
// Numeric id of @NOSTALGIA_573. Fixed here so the home page never pays for
// a user lookup; screen names can change, ids cannot.
const OFFICIAL_X_USER_ID = "831685375735132160";
const X_API_TIMEOUT_MS = 8_000;
// Every X API read is billed, so the latest post is refreshed at most once
// per six hours: once in Next's shared data cache, and again in this
// instance's memory so a path revalidation or a hard reload cannot trigger
// an extra paid call while the value is still fresh.
export const OFFICIAL_X_REVALIDATE_SECONDS = 6 * 60 * 60;
// After a failed request, skip the API for a while so a broken token or an
// empty credit balance does not turn every home render into a paid call.
const FAILURE_BACKOFF_MS = 5 * 60 * 1000;

export type OfficialXPost =
    | { status: "ready"; post: OfficialXPostContent }
    | { status: "empty" }
    | { status: "error" };

type TimelineResponse = {
    data?: {
        id: string;
        text: string;
        created_at?: string;
        attachments?: { media_keys?: string[] };
        entities?: {
            urls?: {
                url: string;
                expanded_url?: string;
                display_url?: string;
                media_key?: string;
            }[];
        };
    }[];
    includes?: {
        media?: {
            media_key: string;
            type: string;
            url?: string;
            preview_image_url?: string;
            width?: number;
            height?: number;
            alt_text?: string;
        }[];
        users?: {
            id: string;
            name: string;
            username: string;
            profile_image_url?: string;
        }[];
    };
    meta?: { result_count?: number };
};

let lastFailureAt = 0;
let memo: { value: OfficialXPost; at: number } | null = null;

function isHttpsUrl(value: string | undefined): value is string {
    return typeof value === "string" && value.startsWith("https://");
}

async function fetchLatestPost(): Promise<
    Exclude<OfficialXPost, { status: "error" }>
> {
    const token = serverEnv.X_BEARER_TOKEN;
    if (!token) throw new Error("X_BEARER_TOKEN is not configured");
    const url = new URL(
        `https://api.x.com/2/users/${OFFICIAL_X_USER_ID}/tweets`
    );
    // 5 is the smallest page the API allows. Reads are deduplicated per UTC
    // day, so the refresh costs roughly one page of reads per day.
    url.searchParams.set("max_results", "5");
    url.searchParams.set("exclude", "retweets,replies");
    url.searchParams.set("tweet.fields", "created_at,entities,attachments");
    url.searchParams.set("expansions", "attachments.media_keys,author_id");
    url.searchParams.set(
        "media.fields",
        "type,url,preview_image_url,width,height,alt_text"
    );
    url.searchParams.set("user.fields", "name,username,profile_image_url");
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(X_API_TIMEOUT_MS),
    });
    if (!response.ok) {
        throw new Error(`X API responded with ${response.status}`);
    }
    const body = (await response.json()) as TimelineResponse;
    const latest = body.data?.[0];
    if (!latest || !/^\d+$/.test(latest.id)) return { status: "empty" };

    const author = body.includes?.users?.find(
        (user) => user.id === OFFICIAL_X_USER_ID
    );
    const mediaKey = latest.attachments?.media_keys?.[0];
    const media = mediaKey
        ? body.includes?.media?.find((item) => item.media_key === mediaKey)
        : undefined;
    // Photos expose `url`; videos and GIFs only expose a preview frame.
    const imageUrl = media?.url ?? media?.preview_image_url;
    const image =
        media && isHttpsUrl(imageUrl) && media.width && media.height
            ? {
                  url: imageUrl,
                  width: media.width,
                  height: media.height,
                  alt: media.alt_text?.trim() || null,
              }
            : null;
    const links: OfficialXPostLink[] = (latest.entities?.urls ?? [])
        .filter((entry) => entry.url && isHttpsUrl(entry.expanded_url))
        .map((entry) => ({
            url: entry.url,
            expandedUrl: entry.expanded_url!,
            displayUrl: entry.display_url ?? entry.expanded_url!,
            isMedia: Boolean(entry.media_key),
        }));
    return {
        status: "ready",
        post: {
            id: latest.id,
            url: `${OFFICIAL_X_URL}/status/${latest.id}`,
            text: latest.text,
            createdAt: latest.created_at ?? new Date().toISOString(),
            author: {
                name: author?.name ?? OFFICIAL_X_USERNAME,
                username: author?.username ?? OFFICIAL_X_USERNAME,
                avatarUrl: isHttpsUrl(author?.profile_image_url)
                    ? author.profile_image_url
                    : null,
            },
            image,
            links,
        },
    };
}

const getCachedLatestPost = unstable_cache(
    fetchLatestPost,
    ["official-x-latest-post-v2"],
    { revalidate: OFFICIAL_X_REVALIDATE_SECONDS }
);

export async function getOfficialXLatestPost(): Promise<OfficialXPost> {
    if (!serverEnv.X_BEARER_TOKEN) return { status: "error" };
    const now = Date.now();
    if (memo && now - memo.at < OFFICIAL_X_REVALIDATE_SECONDS * 1000) {
        return memo.value;
    }
    if (now - lastFailureAt < FAILURE_BACKOFF_MS) {
        return { status: "error" };
    }
    try {
        const value = await getCachedLatestPost();
        memo = { value, at: Date.now() };
        return value;
    } catch (error) {
        lastFailureAt = Date.now();
        console.error("[official-x] failed to load the latest post", error);
        return { status: "error" };
    }
}
