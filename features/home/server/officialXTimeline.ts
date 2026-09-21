import "server-only";
import { serverEnv } from "@/lib/env/server";
import { recordExternalCall } from "@/lib/analytics";
import type {
    OfficialXPostContent,
    OfficialXPostLink,
} from "@/features/home/officialXPostContent";
import { officialXPostSchema } from "@/features/home/schemas/officialXPostSchema";

const OFFICIAL_X_USERNAME = "NOSTALGIA_573";
const OFFICIAL_X_URL = `https://x.com/${OFFICIAL_X_USERNAME}`;
const OFFICIAL_X_USER_ID = "831685375735132160";
const X_API_TIMEOUT_MS = 8_000;

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
    errors?: unknown[];
};

function isHttpsUrl(value: string | undefined): value is string {
    return typeof value === "string" && value.startsWith("https://");
}

export async function fetchOfficialXLatestPost(
    sinceId?: string
): Promise<OfficialXPostContent | null> {
    const token = serverEnv.X_BEARER_TOKEN;
    if (!token) throw new Error("X_BEARER_TOKEN is not configured");
    const url = new URL(
        `https://api.x.com/2/users/${OFFICIAL_X_USER_ID}/tweets`
    );
    // API minimum is 5. Only the newest eligible post is displayed; no history pagination.
    url.searchParams.set("max_results", "5");
    if (sinceId) url.searchParams.set("since_id", sinceId);
    url.searchParams.set("exclude", "retweets,replies");
    url.searchParams.set("tweet.fields", "created_at,entities,attachments");
    url.searchParams.set("expansions", "attachments.media_keys,author_id");
    url.searchParams.set(
        "media.fields",
        "type,url,preview_image_url,width,height,alt_text"
    );
    url.searchParams.set("user.fields", "name,username,profile_image_url");
    // 외부 API 통계 — 실제로 부른 횟수만 센다(캐시에서 꺼낼 때는 이 함수가 돌지 않는다)
    void recordExternalCall("x-api").catch(() => null);
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(X_API_TIMEOUT_MS),
    });
    if (!response.ok) {
        throw new Error(`X API responded with ${response.status}`);
    }
    const body = (await response.json()) as TimelineResponse;
    if (body.errors?.length) throw new Error("X API returned a partial error");
    if (!body.data?.length) {
        if (body.meta?.result_count === 0) return null;
        throw new Error("X API returned an invalid timeline");
    }
    const latest = body.data[0];
    if (
        !latest ||
        !/^\d+$/.test(latest.id) ||
        typeof latest.text !== "string" ||
        !latest.created_at ||
        !Number.isFinite(Date.parse(latest.created_at))
    ) {
        throw new Error("X API returned an invalid post");
    }
    if (sinceId && BigInt(latest.id) <= BigInt(sinceId)) return null;

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
    return officialXPostSchema.parse({
        id: latest.id,
        url: `${OFFICIAL_X_URL}/status/${latest.id}`,
        text: latest.text,
        createdAt: latest.created_at,
        author: {
            name: author?.name ?? OFFICIAL_X_USERNAME,
            username: author?.username ?? OFFICIAL_X_USERNAME,
            avatarUrl: isHttpsUrl(author?.profile_image_url)
                ? author.profile_image_url
                : null,
        },
        image,
        links,
        translations: null,
    });
}
