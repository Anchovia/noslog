import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { storedPost } from "./fixtures/officialX";
const { findUnique, cacheOptions, translate } = vi.hoisted(() => ({
    findUnique: vi.fn(),
    cacheOptions: vi.fn(),
    translate: vi.fn(),
}));
vi.mock("@/lib/db", () => ({ default: { officialXFeed: { findUnique } } }));
vi.mock("next/cache", () => ({
    unstable_cache: (fn: () => unknown, keys: string[], options: unknown) => {
        cacheOptions(keys, options);
        return fn;
    },
}));
vi.mock("@/features/home/server/officialXPostTranslation", () => ({
    translateOfficialXPost: translate,
}));
const fetchMock = vi.fn();
beforeEach(() => {
    findUnique.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});
async function read() {
    return (
        await import("@/features/home/server/officialXPostService")
    ).getOfficialXLatestPost();
}
describe("home reads persisted official news only", () => {
    it("returns stored translations without X or Gemini, even after 30 days", async () => {
        findUnique.mockResolvedValue({
            content: storedPost,
            lastSuccessAt: new Date("2026-01-01"),
        });
        expect(await read()).toEqual({ status: "ready", post: storedPost });
        expect(fetchMock).not.toHaveBeenCalled();
        expect(translate).not.toHaveBeenCalled();
        expect(cacheOptions).toHaveBeenCalledWith(
            ["official-x-stored-feed-v1"],
            { revalidate: false, tags: ["official-x-feed"] }
        );
    });
    it("returns untranslated stored content immediately", async () => {
        findUnique.mockResolvedValue({
            content: { ...storedPost, translations: null },
            lastSuccessAt: new Date(),
        });
        expect(await read()).toMatchObject({
            status: "ready",
            post: { translations: null },
        });
        expect(translate).not.toHaveBeenCalled();
        expect(fetchMock).not.toHaveBeenCalled();
    });
    it("distinguishes a successful empty account from uninitialized state", async () => {
        findUnique
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce({ content: null, lastSuccessAt: null })
            .mockResolvedValueOnce({
                content: null,
                lastSuccessAt: new Date(),
            });
        expect(await read()).toEqual({ status: "error" });
        expect(await read()).toEqual({ status: "error" });
        expect(await read()).toEqual({ status: "empty" });
    });
    it("fails gracefully on a missing migration or malformed stored content without fetching externally", async () => {
        findUnique
            .mockRejectedValueOnce(new Error("table missing"))
            .mockResolvedValueOnce({
                content: { id: "1" },
                lastSuccessAt: new Date(),
            });
        expect(await read()).toEqual({ status: "error" });
        expect(await read()).toEqual({ status: "error" });
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
