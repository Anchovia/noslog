import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
    eligibleAnnouncements,
    localizeAnnouncement,
    publicAnnouncementSchema,
    selectHomeAnnouncements,
} from "@/features/announcements/schemas/publicAnnouncementSchema";
import AnnouncementBody, {
    announcementLink,
} from "@/features/announcements/components/announcementBody";

const now = new Date("2026-09-07T12:00:00Z");
const record = () => ({
    id: 1,
    publicSlug: "notice-1",
    isPublished: true as const,
    publishedAt: new Date("2026-09-01T00:00:00Z"),
    placement: "ROUTINE" as const,
    category: "UPDATE" as const,
    priority: 0,
    activeFrom: null,
    expiresAt: null,
    translations: (["ko", "ja", "en"] as const).map((locale) => ({
        locale,
        title: `${locale} title`,
        content: `${locale} body`,
        modifiedAt: null,
    })),
});

describe("P11 public announcement eligibility", () => {
    it("keeps legacy, untranslated, draft and scheduled notices private", () => {
        const good = record();
        expect(
            eligibleAnnouncements(
                [
                    { ...good, publicSlug: null },
                    { ...good, translations: good.translations.slice(0, 2) },
                    { ...good, isPublished: false },
                    { ...good, publishedAt: null },
                    { ...good, publishedAt: new Date("2026-10-01T00:00:00Z") },
                ],
                now
            )
        ).toEqual([]);
    });
    it("rejects duplicate locale translations and blank content", () => {
        const good = record();
        expect(
            publicAnnouncementSchema.safeParse({
                ...good,
                translations: [
                    good.translations[0],
                    good.translations[0],
                    good.translations[2],
                ],
            }).success
        ).toBe(false);
        good.translations[1].content = " ";
        expect(publicAnnouncementSchema.safeParse(good).success).toBe(false);
    });
    it("accepts cache-serialized dates and enforces 80/5000 code point limits", () => {
        const good = record();
        good.translations[0].title = "🎹".repeat(80);
        good.translations[0].content = "あ".repeat(5000);
        expect(
            eligibleAnnouncements([JSON.parse(JSON.stringify(good))], now)
        ).toHaveLength(1);
        good.translations[0].title += "x";
        expect(publicAnnouncementSchema.safeParse(good).success).toBe(false);
        good.translations[0].title = "Valid";
        good.translations[0].content += "x";
        expect(publicAnnouncementSchema.safeParse(good).success).toBe(false);
    });
    it("uses original publication and stable ID ordering", () => {
        expect(
            eligibleAnnouncements(
                [
                    {
                        ...record(),
                        id: 3,
                        publishedAt: new Date("2026-08-01T00:00:00Z"),
                    },
                    record(),
                    { ...record(), id: 2 },
                ],
                now
            ).map((item) => item.id)
        ).toEqual([2, 1, 3]);
    });
    it("localizes identity and modification date without falling back", () => {
        const a = publicAnnouncementSchema.parse(record());
        a.translations[0].modifiedAt = now;
        expect(localizeAnnouncement(a, "ko").modifiedAt).toBe(
            now.toISOString()
        );
        expect(localizeAnnouncement(a, "ko").category).toBe("UPDATE");
        expect(
            eligibleAnnouncements(
                [{ ...record(), category: undefined }],
                now
            )[0]?.category
        ).toBe("NOTICE");
        expect(localizeAnnouncement(a, "ja")).toMatchObject({
            slug: "notice-1",
            title: "ja title",
            modifiedAt: null,
        });
    });
    it("keeps expired critical history as a plain row and removes its Home prominence", () => {
        const a = {
            ...record(),
            placement: "SERVICE_CRITICAL",
            activeFrom: new Date("2026-09-01T00:00:00Z"),
            expiresAt: now,
        };
        const eligible = eligibleAnnouncements([a], now);
        expect(eligible).toHaveLength(1);
        const result = selectHomeAnnouncements(eligible, now);
        expect(result.critical).toBeNull();
        expect(
            result.list.map((item) => [item.record.id, item.pinned])
        ).toEqual([[1, false]]);
    });
    it("selects one critical item deterministically and pins active critical rows above routine ones", () => {
        const records = Array.from({ length: 6 }, (_, id) => ({
            ...record(),
            id: id + 1,
        }));
        const critical = [1, 2].map((priority) => ({
            ...record(),
            id: priority + 10,
            placement: "SERVICE_CRITICAL",
            priority,
            activeFrom: new Date("2026-09-01T00:00:00Z"),
        }));
        const result = selectHomeAnnouncements(
            eligibleAnnouncements([...records, ...critical], now),
            now
        );
        expect(result.critical?.id).toBe(12);
        expect(
            result.list.map((item) => [item.record.id, item.pinned])
        ).toEqual([
            [12, true],
            [11, true],
            [6, false],
        ]);
    });
});
describe("P11 restricted Markdown", () => {
    const render = (content: string) =>
        renderToStaticMarkup(
            createElement(AnnouncementBody, {
                content,
                locale: "ja",
                siteUrl: "https://noslog.app",
                externalLabel: "外部サイト",
            })
        );
    it("renders approved native semantics and localizes internal links", () => {
        const html = render(
            "## Section\n\n### Subsection\n\nA **strong** word.\n\n- One\n- Two\n\n1. First\n\n[Music](/ko/music)\n\n[Discord](https://discord.com)"
        );
        for (const element of [
            "<h2",
            "<h3",
            "<p",
            "<ul",
            "<ol",
            "<li",
            "<strong",
            "<a",
        ])
            expect(html).toContain(element);
        expect(html).toContain('href="/ja/music"');
        expect(html).toContain("外部サイト");
        expect(html).not.toContain('target="_blank"');
    });
    it("never renders executable HTML, images, code, H1 or unsafe URLs", () => {
        const html = render(
            '# Hidden\n\n<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">\n\n![image](https://example.com/a.png)\n\n[attack](javascript:alert%281%29)\n\n`code`'
        );
        for (const unsafe of [
            "<script",
            "<img",
            "<h1",
            "<code",
            "javascript:",
            "onerror=",
        ])
            expect(html).not.toContain(unsafe);
    });
    it.each([
        "javascript:alert(1)",
        "data:text/html,x",
        "file:///tmp/a",
        "\\\\evil.test",
        " https://evil.test",
    ])("rejects unsafe destination %s", (url) =>
        expect(announcementLink(url, "ko", "https://noslog.app")).toBeNull()
    );
});
