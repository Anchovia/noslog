import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildOfficialXPostSegments } from "@/features/home/officialXPostContent";

const { env } = vi.hoisted(() => ({
    env: { X_BEARER_TOKEN: undefined as string | undefined },
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/env/server", () => ({ serverEnv: env }));
const { translateMock } = vi.hoisted(() => ({
    translateMock: vi.fn(async () => null as { ko: string; en: string } | null),
}));
vi.mock("@/features/home/server/officialXPostTranslation", () => ({
    getOfficialXPostTranslations: translateMock,
}));
// The six-hour data cache is Next's concern; here every call reaches the fetcher.
vi.mock("next/cache", () => ({
    unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
}));

async function loadService() {
    vi.resetModules();
    return import("@/features/home/server/officialXPostService");
}

function jsonResponse(status: number, body: unknown) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
    });
}

const realTimeline = {
    data: [
        {
            id: "2097492558306033739",
            text: "【 Real譜面追加 】\n9月10日(木)10:00より、『Just Be Friends』に高難度の“Real”譜面が追加。 #ノスタルジア\n\nhttps://t.co/98Ze9MjIOV https://t.co/4I9QNGPXxb",
            created_at: "2026-09-09T01:09:30.000Z",
            attachments: { media_keys: ["3_2097492484444364800"] },
            entities: {
                urls: [
                    {
                        url: "https://t.co/98Ze9MjIOV",
                        expanded_url:
                            "https://p.eagate.573.jp/game/nostalgia/op3/news/entrance.html#20260909-01",
                        display_url: "p.eagate.573.jp/game/nostalgia…",
                    },
                    {
                        url: "https://t.co/4I9QNGPXxb",
                        expanded_url:
                            "https://x.com/NOSTALGIA_573/status/2097492558306033739/photo/1",
                        display_url: "pic.x.com/4I9QNGPXxb",
                        media_key: "3_2097492484444364800",
                    },
                ],
            },
        },
        {
            id: "2095015245991510252",
            text: "older",
            created_at: "2026-09-02T05:05:32.000Z",
        },
    ],
    includes: {
        media: [
            {
                media_key: "3_2097492484444364800",
                type: "photo",
                url: "https://pbs.twimg.com/media/HRvKTTZboAAZuVA.jpg",
                width: 640,
                height: 360,
            },
        ],
        users: [
            {
                id: "831685375735132160",
                name: "ノスタルジア公式@Op.3好評稼働中！",
                username: "NOSTALGIA_573",
                profile_image_url:
                    "https://pbs.twimg.com/profile_images/2075145444016209920/AK864Pkk_normal.png",
            },
        ],
    },
    meta: { result_count: 2 },
};

describe("official X post text", () => {
    it("replaces t.co links with readable destinations and drops the photo link", () => {
        const post = realTimeline.data[0]!;
        const links = post.entities!.urls.map((entry) => ({
            url: entry.url,
            expandedUrl: entry.expanded_url,
            displayUrl: entry.display_url,
            isMedia: Boolean(entry.media_key),
        }));
        expect(buildOfficialXPostSegments(post.text, links)).toEqual([
            {
                type: "text",
                value: "【 Real譜面追加 】\n9月10日(木)10:00より、『Just Be Friends』に高難度の“Real”譜面が追加。 #ノスタルジア\n\n",
            },
            {
                type: "link",
                href: "https://p.eagate.573.jp/game/nostalgia/op3/news/entrance.html#20260909-01",
                label: "p.eagate.573.jp/game/nostalgia…",
            },
        ]);
    });

    it("keeps plain text untouched when there are no links", () => {
        expect(buildOfficialXPostSegments("hello", [])).toEqual([
            { type: "text", value: "hello" },
        ]);
    });
});

describe("official X latest post", () => {
    const fetchMock = vi.fn<typeof fetch>();

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-09-10T00:00:00Z"));
        vi.stubGlobal("fetch", fetchMock);
        vi.spyOn(console, "error").mockImplementation(() => {});
        env.X_BEARER_TOKEN = "token";
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.useRealTimers();
    });

    it("builds the card content from the newest post, its photo, and the author", async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse(200, realTimeline));
        const { getOfficialXLatestPost } = await loadService();
        const result = await getOfficialXLatestPost();
        expect(result.status).toBe("ready");
        if (result.status !== "ready") return;
        expect(result.post).toMatchObject({
            id: "2097492558306033739",
            url: "https://x.com/NOSTALGIA_573/status/2097492558306033739",
            createdAt: "2026-09-09T01:09:30.000Z",
            author: {
                name: "ノスタルジア公式@Op.3好評稼働中！",
                username: "NOSTALGIA_573",
                avatarUrl:
                    "https://pbs.twimg.com/profile_images/2075145444016209920/AK864Pkk_normal.png",
            },
            image: {
                url: "https://pbs.twimg.com/media/HRvKTTZboAAZuVA.jpg",
                width: 640,
                height: 360,
                alt: null,
            },
        });
        expect(result.post.links.map((link) => link.isMedia)).toEqual([
            false,
            true,
        ]);
        const [url, init] = fetchMock.mock.calls[0]!;
        const requested = new URL(String(url));
        expect(requested.origin + requested.pathname).toBe(
            "https://api.x.com/2/users/831685375735132160/tweets"
        );
        expect(requested.searchParams.get("max_results")).toBe("5");
        expect(requested.searchParams.get("exclude")).toBe("retweets,replies");
        expect(requested.searchParams.get("expansions")).toBe(
            "attachments.media_keys,author_id"
        );
        expect((init?.headers as Record<string, string>).Authorization).toBe(
            "Bearer token"
        );
    });

    it("attaches the translation produced for the post text and links", async () => {
        translateMock.mockResolvedValueOnce({ ko: "한국어", en: "English" });
        fetchMock.mockResolvedValueOnce(jsonResponse(200, realTimeline));
        const { getOfficialXLatestPost } = await loadService();
        const result = await getOfficialXLatestPost();
        expect(result.status).toBe("ready");
        if (result.status !== "ready") return;
        expect(result.post.translations).toEqual({
            ko: "한국어",
            en: "English",
        });
        expect(translateMock).toHaveBeenCalledWith(
            realTimeline.data[0].id,
            realTimeline.data[0].text,
            result.post.links
        );
    });

    it("renders text-only posts without an image", async () => {
        fetchMock.mockResolvedValueOnce(
            jsonResponse(200, {
                data: [
                    {
                        id: "1",
                        text: "plain",
                        created_at: "2026-09-09T00:00:00.000Z",
                    },
                ],
                meta: { result_count: 1 },
            })
        );
        const { getOfficialXLatestPost } = await loadService();
        const result = await getOfficialXLatestPost();
        expect(result).toMatchObject({
            status: "ready",
            post: {
                image: null,
                links: [],
                author: { username: "NOSTALGIA_573" },
            },
        });
    });

    it("reports empty when the account has no eligible posts", async () => {
        fetchMock.mockResolvedValueOnce(
            jsonResponse(200, { meta: { result_count: 0 } })
        );
        const { getOfficialXLatestPost } = await loadService();
        await expect(getOfficialXLatestPost()).resolves.toEqual({
            status: "empty",
        });
    });

    it("reports an error without calling the API when no token is configured", async () => {
        env.X_BEARER_TOKEN = undefined;
        const { getOfficialXLatestPost } = await loadService();
        await expect(getOfficialXLatestPost()).resolves.toEqual({
            status: "error",
        });
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("backs off after a failed request instead of retrying on every render", async () => {
        fetchMock.mockResolvedValue(
            jsonResponse(402, { title: "Payment Required" })
        );
        const { getOfficialXLatestPost } = await loadService();
        await expect(getOfficialXLatestPost()).resolves.toEqual({
            status: "error",
        });
        await expect(getOfficialXLatestPost()).resolves.toEqual({
            status: "error",
        });
        expect(fetchMock).toHaveBeenCalledTimes(1);
        vi.setSystemTime(new Date("2026-09-10T00:05:01Z"));
        await getOfficialXLatestPost();
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("serves the remembered post for six hours even when the data cache is bypassed", async () => {
        fetchMock.mockResolvedValue(jsonResponse(200, realTimeline));
        const { getOfficialXLatestPost } = await loadService();
        await getOfficialXLatestPost();
        await getOfficialXLatestPost();
        vi.setSystemTime(new Date("2026-09-10T05:59:00Z"));
        await getOfficialXLatestPost();
        expect(fetchMock).toHaveBeenCalledTimes(1);
        vi.setSystemTime(new Date("2026-09-10T06:00:01Z"));
        await getOfficialXLatestPost();
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });
});
