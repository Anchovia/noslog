import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { storedPost } from "./fixtures/officialX";
const { claim, updateMany, fetchLatest, translate, revalidateTag, env } =
    vi.hoisted(() => ({
        claim: vi.fn(),
        updateMany: vi.fn(),
        fetchLatest: vi.fn(),
        translate: vi.fn(),
        revalidateTag: vi.fn(),
        env: {
            X_BEARER_TOKEN: "token",
            GEMINI_API_KEY: "key" as string | undefined,
        },
    }));
vi.mock("@/lib/db", () => ({
    default: { $queryRaw: claim, officialXFeed: { updateMany } },
}));
vi.mock("@/lib/env/server", () => ({ serverEnv: env }));
vi.mock("next/cache", () => ({
    revalidateTag,
    unstable_cache: (fn: () => unknown) => fn,
}));
vi.mock("@/features/home/server/officialXTimeline", () => ({
    fetchOfficialXLatestPost: fetchLatest,
}));
vi.mock("@/features/home/server/officialXPostTranslation", () => ({
    translateOfficialXPost: translate,
}));
import { syncOfficialXFeed } from "@/features/home/server/officialXSync";

beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-19T00:17:00Z"));
    claim
        .mockReset()
        .mockResolvedValue([
            { content: storedPost, lastSuccessAt: new Date() },
        ]);
    updateMany.mockReset().mockResolvedValue({ count: 1 });
    fetchLatest.mockReset().mockResolvedValue(null);
    translate
        .mockReset()
        .mockResolvedValue({ ko: "새 번역", en: "New translation" });
    env.GEMINI_API_KEY = "key";
    env.X_BEARER_TOKEN = "token";
});
afterEach(() => vi.useRealTimers());

describe("12-hour official news sync", () => {
    it("does not rewrite or retranslate unchanged content", async () => {
        await expect(syncOfficialXFeed()).resolves.toEqual({
            status: "unchanged",
        });
        expect(fetchLatest).toHaveBeenCalledWith(storedPost.id);
        expect(updateMany).not.toHaveBeenCalled();
        expect(translate).not.toHaveBeenCalled();
    });
    it("does not start paid work when another worker already claimed this slot", async () => {
        claim.mockResolvedValue([]);
        await expect(syncOfficialXFeed()).resolves.toEqual({
            status: "skipped",
        });
        expect(fetchLatest).not.toHaveBeenCalled();
        expect(translate).not.toHaveBeenCalled();
        expect(updateMany).not.toHaveBeenCalled();
    });
    it("claims UTC half-day slots atomically with a boundary overlap guard", async () => {
        await syncOfficialXFeed();
        const [sql, id, now, slot, guard] = claim.mock.calls[0]!;
        expect(sql.join("?")).toContain('ON CONFLICT ("id") DO UPDATE');
        expect(sql.join("?")).toContain('"last_attempt_at" <');
        expect(id).toBe("NOSTALGIA_573");
        expect(now).toEqual(new Date("2026-09-19T00:17:00Z"));
        expect(slot).toEqual(new Date("2026-09-19T00:00:00Z"));
        expect(guard).toEqual(new Date("2026-09-19T00:14:00Z"));
        vi.setSystemTime(new Date("2026-09-19T12:17:00Z"));
        await syncOfficialXFeed();
        expect(claim.mock.calls[1]![3]).toEqual(
            new Date("2026-09-19T12:00:00Z")
        );
    });
    it("lets only one concurrent worker fetch and translate", async () => {
        claim
            .mockResolvedValueOnce([{ content: null, lastSuccessAt: null }])
            .mockResolvedValue([]);
        fetchLatest.mockResolvedValue({ ...storedPost, translations: null });
        const results = await Promise.all([
            syncOfficialXFeed(),
            syncOfficialXFeed(),
        ]);
        expect(results.map((result) => result.status).sort()).toEqual([
            "skipped",
            "updated",
        ]);
        expect(fetchLatest).toHaveBeenCalledTimes(1);
        expect(translate).toHaveBeenCalledTimes(1);
    });
    it("saves the new raw post before translation, then persists translations", async () => {
        const incoming = {
            ...storedPost,
            id: "2097492558306033740",
            text: "new",
            translations: null,
        };
        fetchLatest.mockResolvedValue(incoming);
        await expect(syncOfficialXFeed()).resolves.toEqual({
            status: "updated",
        });
        expect(updateMany).toHaveBeenCalledTimes(2);
        expect(updateMany.mock.calls[0]![0].data.content).toEqual(incoming);
        expect(updateMany.mock.invocationCallOrder[0]).toBeLessThan(
            translate.mock.invocationCallOrder[0]!
        );
        expect(updateMany.mock.calls[1]![0].data.content.translations).toEqual({
            ko: "새 번역",
            en: "New translation",
        });
        expect(updateMany.mock.calls[0]![0].where.lastAttemptAt).toEqual(
            new Date()
        );
        expect(revalidateTag).toHaveBeenCalledWith("official-x-feed", {
            expire: 0,
        });
    });
    it("keeps raw data when translation fails and retries only translation next time", async () => {
        const pending = { ...storedPost, translations: null };
        claim.mockResolvedValueOnce([{ content: null, lastSuccessAt: null }]);
        fetchLatest.mockResolvedValueOnce(pending);
        translate.mockResolvedValueOnce(null);
        expect(await syncOfficialXFeed()).toEqual({
            status: "translation-pending",
        });
        expect(updateMany).toHaveBeenCalledTimes(1);
        claim.mockResolvedValue([
            { content: pending, lastSuccessAt: new Date() },
        ]);
        updateMany.mockClear();
        vi.setSystemTime(new Date("2026-09-19T12:17:00Z"));
        expect(await syncOfficialXFeed()).toEqual({ status: "updated" });
        expect(fetchLatest).toHaveBeenLastCalledWith(storedPost.id);
        expect(updateMany).toHaveBeenCalledTimes(1);
        expect(
            updateMany.mock.calls[0]![0].data.content.translations
        ).not.toBeNull();
    });
    it("retains the previous post on X failure", async () => {
        fetchLatest.mockRejectedValue(new Error("X 402"));
        await expect(syncOfficialXFeed()).rejects.toThrow("402");
        expect(updateMany).not.toHaveBeenCalled();
        expect(translate).not.toHaveBeenCalled();
    });
    it("does not translate or advance content after a raw DB write fails", async () => {
        fetchLatest.mockResolvedValue({
            ...storedPost,
            id: "2097492558306033740",
            translations: null,
        });
        updateMany.mockRejectedValue(new Error("DB unavailable"));
        await expect(syncOfficialXFeed()).rejects.toThrow("DB unavailable");
        expect(translate).not.toHaveBeenCalled();
    });
    it("rejects a stale worker whose claim is no longer current", async () => {
        fetchLatest.mockResolvedValue({
            ...storedPost,
            id: "2097492558306033740",
            translations: null,
        });
        updateMany.mockResolvedValue({ count: 0 });
        await expect(syncOfficialXFeed()).rejects.toThrow("ownership lost");
        expect(translate).not.toHaveBeenCalled();
    });
    it("initializes a genuinely empty account once", async () => {
        claim.mockResolvedValue([{ content: null, lastSuccessAt: null }]);
        expect(await syncOfficialXFeed()).toEqual({ status: "unchanged" });
        expect(updateMany).toHaveBeenCalledWith(
            expect.objectContaining({ data: { lastSuccessAt: new Date() } })
        );
        expect(translate).not.toHaveBeenCalled();
    });
    it("can persist raw news with no Gemini key and translate in a later run", async () => {
        env.GEMINI_API_KEY = undefined;
        fetchLatest.mockResolvedValue({
            ...storedPost,
            id: "2097492558306033740",
            translations: null,
        });
        expect(await syncOfficialXFeed()).toEqual({ status: "updated" });
        expect(translate).not.toHaveBeenCalled();
        expect(updateMany).toHaveBeenCalledTimes(1);
    });
    it("fails without acquiring a claim when X configuration is missing", async () => {
        env.X_BEARER_TOKEN = "";
        await expect(syncOfficialXFeed()).rejects.toThrow("configured");
        expect(claim).not.toHaveBeenCalled();
    });
});
