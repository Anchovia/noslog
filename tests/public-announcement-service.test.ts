import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    eligibleAnnouncements,
    eligibleAnnouncementSummaries,
    localizeAnnouncement,
    localizeAnnouncementSummary,
} from "@/features/announcements/schemas/publicAnnouncementSchema";

const mocks = vi.hoisted(() => ({
    summaries: vi.fn(),
    detail: vi.fn(),
    cache: new Map<string, unknown>(),
}));
vi.mock("next/cache", () => ({
    unstable_cache:
        (fn: (...args: unknown[]) => unknown, keys: string[]) =>
        (...args: unknown[]) => {
            const key = JSON.stringify([keys, args]);
            if (!mocks.cache.has(key)) mocks.cache.set(key, fn(...args));
            return mocks.cache.get(key);
        },
}));
vi.mock("@/lib/db", () => ({
    default: {
        $queryRaw: mocks.summaries,
        announcement: { findUnique: mocks.detail },
    },
}));
import {
    getAnnouncement,
    getAnnouncementArchive,
    getHomeAnnouncements,
} from "@/features/announcements/server/publicAnnouncementService";

const record = (id: number) => ({
    id,
    publicSlug: `notice-${id}`,
    isPublished: true,
    publishedAt: new Date("2026-09-01T00:00:00Z"),
    placement: "ROUTINE",
    category: "NOTICE",
    priority: 0,
    activeFrom: null as Date | null,
    expiresAt: null as Date | null,
    translations: ["ko", "ja", "en"].map((locale) => ({
        locale,
        title: `${locale} ${id}`,
        content: "🎹".repeat(5000),
        modifiedAt: new Date("2026-09-02T00:00:00.000Z"),
    })),
});
const summary = (item: ReturnType<typeof record>) => ({
    ...item,
    translations: item.translations.map(({ content, ...translation }) => ({
        ...translation,
        contentLength: Array.from(content).length,
        hasContent: content.trim().length > 0,
    })),
});

describe("announcement summary and detail reads", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-09-22T00:00:00Z"));
        mocks.cache.clear();
        mocks.summaries.mockResolvedValue([
            summary(record(1)),
            summary(record(2)),
        ]);
        mocks.detail.mockImplementation(
            ({ where }: { where: { id: number } }) =>
                Promise.resolve(record(where.id))
        );
    });
    afterEach(() => vi.useRealTimers());

    it("home and archive omit bodies and reuse the candidate cache", async () => {
        const home = await getHomeAnnouncements("ko");
        const archive = await getAnnouncementArchive("ja", null, 1);
        expect(home.list.map((item) => item.announcement.id)).toEqual([2, 1]);
        expect(archive?.announcements[0]).toMatchObject({
            title: "ja 2",
            modifiedAt: "2026-09-02T00:00:00.000Z",
        });
        expect(JSON.stringify(home)).not.toContain("content");
        expect(mocks.summaries).toHaveBeenCalledOnce();
        expect(mocks.detail).not.toHaveBeenCalled();
        const query = (
            mocks.summaries.mock.calls[0][0] as TemplateStringsArray
        ).join("?");
        expect(query).toContain("char_length(t.content)");
        expect(query).not.toContain("'content',");
    });

    it("loads one detail only, retaining body, localization and adjacent summaries", async () => {
        const detail = await getAnnouncement("en", "notice-1");
        expect(detail?.content).toBe("🎹".repeat(5000));
        expect(detail?.title).toBe("en 1");
        expect(detail?.older).toBeNull();
        expect(detail?.newer?.id).toBe(2);
        expect(detail?.newer).not.toHaveProperty("content");
        await getAnnouncement("ko", "notice-1");
        expect(mocks.detail).toHaveBeenCalledOnce();
        expect(mocks.detail.mock.calls[0][0].where).toEqual({ id: 1 });
        expect(await getAnnouncement("ko", "absent")).toBeNull();
        expect(mocks.detail).toHaveBeenCalledOnce();
    });

    it("reevaluates publication, critical start and expiry against cached candidates", async () => {
        const notice = {
            ...record(1),
            placement: "SERVICE_CRITICAL",
            publishedAt: new Date("2026-09-22T01:00:00Z"),
            activeFrom: new Date("2026-09-22T02:00:00Z"),
            expiresAt: new Date("2026-09-22T03:00:00Z"),
        };
        mocks.summaries.mockResolvedValue([summary(notice)]);
        expect((await getHomeAnnouncements("ko")).list).toEqual([]);
        vi.setSystemTime(notice.publishedAt);
        expect((await getHomeAnnouncements("ko")).list).toHaveLength(1);
        expect((await getHomeAnnouncements("ko")).critical).toBeNull();
        vi.setSystemTime(notice.activeFrom);
        expect((await getHomeAnnouncements("ko")).critical?.id).toBe(1);
        vi.setSystemTime(notice.expiresAt);
        expect((await getHomeAnnouncements("ko")).critical).toBeNull();
        expect((await getHomeAnnouncements("ko")).list).toHaveLength(1);
        expect(mocks.summaries).toHaveBeenCalledOnce();
    });

    it.each([
        "",
        " \t\n\u00a0\u3000\ufeff",
        "x".repeat(5001),
        "🎹".repeat(5000),
    ])("preserves body validation for a summary (%#)", (content) => {
        const item = record(1);
        item.translations[1].content = content;
        const full = eligibleAnnouncements([item], new Date());
        const compact = eligibleAnnouncementSummaries(
            [summary(item)],
            new Date()
        );
        expect(compact.length).toBe(full.length);
        if (full.length) {
            const { content: ignored, ...metadata } = localizeAnnouncement(
                full[0],
                "ja"
            );
            expect(ignored).toBe(content);
            expect(localizeAnnouncementSummary(compact[0], "ja")).toEqual(
                metadata
            );
        }
    });

    it("still rejects missing locales and an unpublished detail after candidate lookup", async () => {
        const item = summary(record(1));
        item.translations.pop();
        expect(eligibleAnnouncementSummaries([item], new Date())).toEqual([]);
        mocks.detail.mockResolvedValue({ ...record(1), isPublished: false });
        expect(await getAnnouncement("ko", "notice-1")).toBeNull();
    });
});
