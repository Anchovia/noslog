import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildOfficialXPostSegments } from "@/features/home/officialXPostContent";
import { realTimeline } from "./fixtures/officialX";
const { env, recordExternalCall } = vi.hoisted(() => ({
    env: { X_BEARER_TOKEN: "token" as string | undefined },
    recordExternalCall: vi.fn(async () => {}),
}));
vi.mock("@/lib/env/server", () => ({ serverEnv: env }));
vi.mock("@/lib/analytics", () => ({ recordExternalCall }));
import { fetchOfficialXLatestPost } from "@/features/home/server/officialXTimeline";
const fetchMock = vi.fn<typeof fetch>();
function respond(body: unknown, status = 200) {
    fetchMock.mockResolvedValue(new Response(JSON.stringify(body), { status }));
}
beforeEach(() => {
    fetchMock.mockReset();
    env.X_BEARER_TOKEN = "token";
    vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

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

describe("official X incremental timeline", () => {
    it("fetches only posts after the persisted ID, retaining media, links and author", async () => {
        respond(realTimeline);
        const post = await fetchOfficialXLatestPost("2095015245991510252");
        expect(post).toMatchObject({
            id: realTimeline.data[0].id,
            image: { width: 640, height: 360 },
            author: { name: realTimeline.includes.users[0].name },
            translations: null,
        });
        expect(post?.links.map((link) => link.isMedia)).toEqual([false, true]);
        const [input, init] = fetchMock.mock.calls[0]!;
        const url = new URL(String(input));
        expect(url.pathname).toBe("/2/users/831685375735132160/tweets");
        expect(url.searchParams.get("since_id")).toBe("2095015245991510252");
        expect(url.searchParams.get("max_results")).toBe("5");
        expect(url.searchParams.get("exclude")).toBe("retweets,replies");
        expect(init?.headers).toEqual({ Authorization: "Bearer token" });
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
    it("bootstraps without since_id and uses the newest post only", async () => {
        respond(realTimeline);
        expect((await fetchOfficialXLatestPost())?.id).toBe(
            realTimeline.data[0].id
        );
        expect(
            new URL(String(fetchMock.mock.calls[0]![0])).searchParams.has(
                "since_id"
            )
        ).toBe(false);
    });
    it("treats a successful empty incremental response as no new post", async () => {
        respond({ meta: { result_count: 0 } });
        await expect(
            fetchOfficialXLatestPost("2097492558306033739")
        ).resolves.toBeNull();
    });
    it("does not regress the cursor if X returns the same or an older post", async () => {
        respond(realTimeline);
        await expect(
            fetchOfficialXLatestPost("2097492558306033739")
        ).resolves.toBeNull();
    });
    it.each([
        {},
        { errors: [{ title: "Forbidden" }], meta: { result_count: 0 } },
        { data: [{ id: "invalid", text: "bad" }] },
    ])("rejects malformed or partial responses", async (body) => {
        respond(body);
        await expect(fetchOfficialXLatestPost()).rejects.toThrow();
    });
    it("surfaces quota/payment errors without automatic retries", async () => {
        respond({}, 402);
        await expect(fetchOfficialXLatestPost()).rejects.toThrow("402");
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
    it("does not call X without a token", async () => {
        env.X_BEARER_TOKEN = undefined;
        await expect(fetchOfficialXLatestPost()).rejects.toThrow("configured");
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
